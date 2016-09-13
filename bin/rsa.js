module.exports = function (options) {
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
                if(!queue.next()){
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