module.exports = function (options) {
    const forge = require('node-forge');
    const fs = require('fs');

    return function () {
        const log = require('./log.js')(options.verbose);

        // generate key set
        log.debug('Generating keySet for bitsize: ' + options.bitsize);

        forge.pki.rsa.generateKeyPair({bits: options.bitsize, workers: 2}, function (err, keypair) {
            if (err) {
                log.error(err);
                return;
            }

            // turn keys into pem format
            log.debug('Certificates to PEM-format');
            var publicDer = forge.pki.publicKeyToPem(keypair.publicKey);
            var privateDer = forge.pki.privateKeyToPem(keypair.privateKey);

            log.debug('Public PEM:');
            log.debug(publicDer);
            log.debug('Private PEM:');
            log.debug(privateDer);

            // set output locations
            const targetPrivateLocation = options.out + options.private;
            const targetPublicLocation = options.out + options.public;

            // store files in output locations
            fs.writeFile(targetPrivateLocation, privateDer, 'utf8', function (err) {
                if (err) {
                    log.error(err);
                    return;
                }
                log.info('Saved RSA private key to: ' + targetPrivateLocation);
            });

            fs.writeFile(targetPublicLocation, publicDer, 'utf8', function (err) {
                if (err) {
                    log.error(err);
                    return;
                }
                log.info('Saved RSA public key to: ' + targetPublicLocation);
            });
        });
    };
};