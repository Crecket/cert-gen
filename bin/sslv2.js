const forge = require('node-forge');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const chrono = require('chrono-node');
const inquirer = require('inquirer');
const os = require('os');

function SSL(options) {
    this._options = options;
    const store_file = require('./utils/store_file')(this._options);
    const log = require('./utils/log.js')(this._options.verbose);

    // generate a certificate
    this.generateCertificate = () => {
        return new Promise((resolve, reject) => {
            // first parse the dates
            this.parseDates()
            // check the issuer option
                .then(this.checkIssuerInfo)

                // check the subject option
                .then(this.checkSubjectInfo)

                // check the rsa private key option
                .then(this.checkRsaInfo)

                // get the files
                .then(this.getOptionFiles)

                // finish
                .then((res)=> {
                    // finished all the things
                })
                .catch((err)=> {
                    reject(err);
                })
        })
    };

    /**
     * parse the before and after dates using chrono
     *
     * @returns {Promise}
     */
    this.parseDates = () => {
        return new Promise((resolve, reject) => {
            // parse the input dates
            log.debug('');
            log.debug('Parsing notBefore and notAfter options');
            this.certificateAfter = chrono.parseDate(this._options.notAfter);
            this.certificateBefore = chrono.parseDate(this._options.notBefore);
            log.debug(
                'Not before: ' + this.certificateBefore,
                'Not after: ' + this.certificateAfter
            );

            // check if the input dates are valid and properly parsed
            if (!this.certificateBefore) {
                reject(new Error('Failed to parse the certificate start input. For a few valid examples ' +
                    'check out https://github.com/wanasit/chrono#chrono'));
            } else if (!this.certificateAfter) {
                reject(new Error('Failed to parse the certificate expire input. For a few valid examples ' +
                    'check out https://github.com/wanasit/chrono#chrono'));
            } else {
                resolve(true);
            }
        })
    };

    /**
     * fetch the issuer and subject info and prompt for file it it is not set
     *
     * @returns {Promise}
     */
    this.getOptionFiles = () => {
        return new Promise((resolve, reject) => {

            // loader list
            var loaders = [
                // subject loader
                this.subjectLoader(),
                // issuer loader
                this.issuerLoader()
            ];

            // if no rsa private key is already set
            if (!this.rsaPrivate) {
                // rsa loader
                loaders.push(this.rsaLoader());
            }

            // wait for all loaders to resolve
            Promise.all(loaders)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * check the issuer json input
     *
     * @returns {Promise}
     */
    this.checkIssuerInfo = () => {
        return new Promise((resolve, reject) => {
            // check if cli option given
            if (this._options.issuer) {
                // check if file exists
                fs.exists(this._options.issuer, (exists) => {
                    if (exists) {
                        // file exists
                        resolve();
                    } else {
                        reject(new Error('Issuer file not found'));
                    }
                });
            } else {
                // no option given, give prompt
                inquirer.prompt([{
                    type: 'input',
                    name: 'issuer',
                    message: 'No issuer option give, please enter the location to your issuer.json file: '
                }]).then((answers) => {
                    // check if file exists
                    fs.exists(answers.issuer, (exists) => {
                        if (exists) {
                            // file exists, update options
                            this._options.issuer = answers.issuer;
                            resolve();
                        } else {
                            reject(new Error('Issuer file not found'));
                        }
                    });
                });
            }
        });
    };

    /**
     * Check the subject input
     *
     * @returns {Promise}
     */
    this.checkSubjectInfo = () => {
        return new Promise((resolve, reject) => {
            // check if cli option given
            if (this._options.subject) {
                // check if file exists
                fs.exists(this._options.subject, (exists) => {
                    if (exists) {
                        // file exists
                        resolve();
                    } else {
                        reject(new Error('Subject file not found'));
                    }
                });
            } else {
                // no option given, give prompt
                inquirer.prompt([{
                    type: 'input',
                    name: 'subject',
                    message: 'No subject option give, please enter the location to your subject.json file: '
                }]).then((answers) => {
                    // check if file exists
                    fs.exists(answers.subject, (exists) => {
                        if (exists) {
                            // file exists, update options
                            this._options.subject = answers.subject;
                            resolve();
                        } else {
                            reject(new Error('Subject file not found'));
                        }
                    });
                });
            }
        });
    };

    /**
     * get rsa certificate if option is set
     *
     * @returns {Promise}
     */
    this.checkRsaInfo = () => {
        return new Promise((resolve, reject) => {
            // check if cli option given
            if (this._options.rsaPrivate) {
                // check if file exists
                fs.exists(this._options.rsaPrivate, (exists) => {
                    if (exists) {
                        // file exists, try to load it
                        this.rsaLoader().then(()=> {
                            resolve()
                        }).catch((err)=> {
                            reject(err)
                        });
                    } else {
                        reject(new Error('rsaPrivate file not found'));
                    }
                });
            } else {
                // no option given, give prompt
                log.debug('No rsaPrivate option, prompt for next');
                inquirer.prompt([{
                    type: 'list',
                    name: 'create_new',
                    message: 'Private key given, want to create a new one automatically or enter the location of your key file: ',
                    choices: [
                        'Create a new key automatically',
                        'Enter the location to a existing key'
                    ]
                }]).then((answers) => {
                    if (answers.create_new === "Create a new key automatically") {
                        // no rsa key given, generate new keyset
                        var keyPromise = this.createRsaKey();
                        keyPromise.then((result)=> {
                            // finished creating key file
                            resolve();
                        });
                        keyPromise.catch((err)=> {
                            // failed to generate rsa keyset
                            reject(err);
                        });
                    } else {
                        // prompt for rsa location
                        inquirer.prompt([{
                            type: 'input',
                            name: 'rsaPrivate',
                            message: 'Enter the location of your RSA Private key: '
                        }]).then((answers) => {
                            // check if file exists
                            fs.exists(answers.rsaPrivate, (exists) => {
                                if (exists) {
                                    // file exists, update options
                                    this._options.rsaPrivate = answers.rsaPrivate;
                                    resolve();
                                } else {
                                    reject(new Error('Rsa key file not found'));
                                }
                            });
                        });
                    }
                });
            }
        });
    };

    /**
     * Load issuer file
     *
     * @returns {Promise}
     */
    this.issuerLoader = () => {
        return new Promise((resolveSub, rejectSub)=> {
            log.debug('Loading issuer');
            fs.readFile(this._options.issuer, 'utf8', (error, result)=> {
                if (error) {
                    rejectSub(new Error(error));
                }
                try {
                    this.issuer = JSON.parse(result);
                } catch (e) {
                }
                log.debug('Loaded issuer: ', this.issuer);
                resolveSub();
            });
        })
    };

    /**
     * Load subject file
     *
     * @returns {Promise}
     */
    this.subjectLoader = () => {
        return new Promise((resolveSub, rejectSub)=> {
            log.debug('Loading subject');
            fs.readFile(this._options.subject, 'utf8', (error, result)=> {
                if (error) {
                    rejectSub(new Error(error));
                }
                try {
                    this.subject = JSON.parse(result);
                } catch (e) {
                }
                log.debug('Loaded subject: ', this.subject);
                resolveSub();
            });
        })
    };

    /**
     * Load rsa key file
     *
     * @returns {Promise}
     */
    this.rsaLoader = () => {
        return new Promise((resolve, reject)=> {
            log.debug('Loading rsaPrivate');
            fs.readFile(this._options.rsaPrivate, 'utf8', (error, result)=> {
                if (error) {
                    reject(new Error(error));
                } else {
                    try {
                        log.debug('Loaded PEM');
                        this.rsaPrivate = forge.pki.privateKeyFromPem(result);
                        resolve();
                    } catch (e) {
                        log.debug(e);
                        reject(e);
                    }
                }
            });
        })
    };

    /**
     * generate a rsa keyset
     *
     * @returns {Promise}
     */
    this.createRsaKey = () => {
        return new Promise((resolve, reject)=> {
            // generate key set
            log.debug('Generating keySet for bitsize: ' + this._options.bitsize);
            forge.pki.rsa.generateKeyPair({
                bits: this._options.bitsize,
                workers: os.cpus().length
            }, (err, keypair) => {
                if (err) {
                    log.error(err);
                    reject(err);
                } else {
                    // to pem and store it in options
                    this.rsaPrivate = forge.pki.privateKeyToPem(keypair.privateKey);
                    resolve(keypair);
                }
            });
        });
    };

}

module.exports = SSL;