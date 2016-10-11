const forge = require('node-forge');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const chrono = require('chrono-node');
const inquirer = require('inquirer');

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
                // get the files
                .then(this.getOptionFiles)
                .catch((err)=> {
                    reject(err);
                })

        })
    };

    // parse the before and after dates using chrono
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

    // fetch the issuer and subject info and prompt for file it it is not set
    this.getOptionFiles = () => {
        return new Promise((resolve, reject) => {
            this.subject = fs.readFileSync(this._options.subject);
            this.issuer = fs.readFileSync(this._options.issuer);
            this.rsa = fs.readFileSync(this._options.rsa);
        });
    }

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
                }]).then(function (answers) {
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
                }]).then(function (answers) {
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
}

module.exports = SSL;