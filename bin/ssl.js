module.exports = function (options) {
    const forge = require('node-forge');
    const fs = require('fs');
    const store_file = require('./utils/store_file')(options);
    const log = require('./utils/log.js')(options.verbose);

    var certificate,
        certificateAfter,
        certificateBefore,
        rsaKeyset,
        issueAttributes;
    return function () {
        // check the initial generic settings
        genericSettings();

    };

    // some default settings which we'll be using everywhere, only need to check these once
    function genericSettings() {

        // parse the input dates
        log.debug('Parsing notBefore and notAfter options');
        certificateAfter = chrono.parseDate(options.notAfter);
        certificateBefore = chrono.parseDate(options.notBefore);
        log.debug(certificateAfter, certificateBefore);

        // check if the input dates are valid and properly parsed
        if (!certificateBefore) {
            log.error('Failed to parse the certificate start input. For a few valid examples check out https://github.com/wanasit/chrono#chrono');
            process.exit();
        }
        if (!certificateAfter) {
            log.error('Failed to parse the certificate expire input. For a few valid examples check out https://github.com/wanasit/chrono#chrono');
            process.exit();
        }
    }

    // generate a new keypair or use input from options
    function getRsaKeypair() {
        // TODO allow using existing key files
        rsaKeyset = forge.pki.rsa.generateKeyPair(options.bitsize);
        return rsaKeyset;
    }

    // create crt and set everything except subject
    function setupCrt() {

        // create new empty certificate
        log.debug('Creating plain certificate');
        certificate = forge.pki.createCertificate();

        // get the rsa keyset from options or generate a new one
        getRsaKeypair();

        // store rsa keyset in certificate
        certificate.publicKey = rsaKeyset.publicKey;
        certificate.privateKey = rsaKeyset.privateKey;

        // set certificate dates
        certificate.validity.notAfter = certificateAfter;
        certificate.validity.notBefore = certificateBefore;

    }

    // Generate a Csr request for a given subject and sign it
    // The only thing that may vary in this is the subject right now
    function signCrt(subject) {

        // TODO get json file from options
        var attrs = [];
        certificate.setSubject(attrs);
        certificate.setIssuer(attrs);

        // sign certificate with the more secure sha256 instead of sha1
        // TODO allow signing with alternate private key
        certificate.sign(keys.privateKey, forge.md.sha256.create());

        // TODO to pem
        var certPem = forge.pki.certificateToPem(cert);
        var pubKey = forge.pki.publicKeyToPem(keys.publicKey);
        var privKey = forge.pki.privateKeyToPem(keys.privateKey);

        const targetCombinedLocation = options.out + prefix + options.private;

        // TODO use store_file obj
        store_file(folder + inputFileName + '.crt', certPem, 'utf8', function (err) {
            if (err) throw err;
            console.log('Saved ssl certificate to: ' + folder + inputFileName + '.crt');
        });
        store_file(folder + inputFileName + '.key', privKey, 'utf8', function (err) {
            if (err) throw err;
            console.log('Saved ssl private key to: ' + folder + inputFileName + '.key');
        });
    }
};


//*

var test = function (options) {
    const forge = require('node-forge');
    const fs = require('fs');
    const store_file = require('./utils/store_file')(options);
    const log = require('./utils/log.js')(options.verbose);
    const queue = require('./utils/queue.js')(options);

    function generateKeypair(callback) {

        // generate key set
        log.debug('Generating keySet for bitsize: ' + options.bitsize);
        forge.pki.rsa.generateKeyPair({bits: options.bitsize, workers: 2}, function (err, keypair) {
            if (err) {
                log.error(err);
                return;
            }
            callback(keypair);
        });
    }

    function handleKeySetResults(keypair, prefix, callback) {
        // turn keys into pem format
        log.debug('Certificates to PEM-format');
        var publicDer = forge.pki.publicKeyToPem(keypair.publicKey);
        var privateDer = forge.pki.privateKeyToPem(keypair.privateKey);

        // by default postfix is empty
        if (!prefix) {
            prefix = '';
        }

        log.debug('Public PEM:');
        log.debug(publicDer);
        log.debug('Private PEM:');
        log.debug(privateDer);

        // single file or double
        if (options.single) {
            // combine into 1 file
            var combinedDer = publicDer + "\n\n" + privateDer;
            const targetCombinedLocation = options.out + prefix + options.private;

            // store combined file in output location
            store_file(targetCombinedLocation, combinedDer, function (success) {
                if (success) {
                    log.info('Saved RSA private and public key to: ' + targetCombinedLocation);
                }

                // call callback if set
                if (callback) callback(true);
            });
        } else {
            // set output locations
            const targetPrivateLocation = options.out + prefix + options.private;
            const targetPublicLocation = options.out + prefix + options.public;

            // store files in output locations
            store_file(targetPrivateLocation, privateDer, function (success) {
                if (success) {
                    log.info('Saved RSA private key to: ' + targetPrivateLocation);
                }

                // call callback if set
                if (callback) callback(true);
            });
            store_file(targetPublicLocation, publicDer, function (success) {
                if (success) {
                    log.info('Saved RSA public key to: ' + targetPublicLocation);
                }

                // call callback if set
                if (callback) callback(true);
            });
        }
    }

    // this function checks if the queue needs to do another iteration, and call the required functions if that is the case
    function needsNext(index) {
        // generate a single keypair
        generateKeypair(function (keypair) {

            // handle the resulting keypair
            handleKeySetResults(keypair, index, function () {
                if (!queue.next()) {
                }
            });
        });
    }

    return function () {
        if (options.amount > 1) {
            queue.start(needsNext);
        } else {
            // generate a single keypair
            generateKeypair(function (keypair) {

                // handle the resulting keypair
                handleKeySetResults(keypair);
            });
        }
    };
};
//*/