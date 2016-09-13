module.exports = function (options) {
    const forge = require('node-forge');
    const chrono = require('chrono-node');

    // parse the input dates
    var certificateAfter = chrono.parseDate(options.notAfter);
    var certificateBefore = chrono.parseDate(options.notBefore);
    return function () {
        // https://github.com/digitalbazaar/forge#x509
    };
};

var forge = require('node-forge');
var fs = require('fs');

function generateSslCertificate(bitSize, inputFileName) {

    var keys = forge.pki.rsa.generateKeyPair(bitSize);
    var cert = forge.pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.privateKey = keys.privateKey;
    cert.validity.notBefore = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    var attrs = [{
        name: 'commonName',
        value: 'localhost'
    }, {
        name: 'countryName',
        value: 'NL'
    }, {
        shortName: 'ST',
        value: 'SomeState'
    }, {
        name: 'localityName',
        value: 'someLocation'
    }, {
        name: 'organizationName',
        value: 'CrecketCerts'
    }, {
        shortName: 'OU',
        value: 'Test'
    }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);

    // self-sign certificate
    cert.sign(keys.privateKey, forge.md.sha256.create());

    var certPem = forge.pki.certificateToPem(cert);
    // var pubKey = pki.publicKeyToPem(keys.publicKey);
    var privKey = forge.pki.privateKeyToPem(keys.privateKey);

    function handleWrite(err) {
        if (err) throw err;
        console.log('It\'s saved!');
    }

    // console.log('Cert');
    // console.log(certPem);
    fs.writeFile(folder + inputFileName + '.crt', certPem, 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved ssl certificate to: ' + folder + inputFileName + '.crt');
    });

    // console.log('Private Key');
    // console.log(privKey);
    fs.writeFile(folder + inputFileName + '.key', privKey, 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved ssl private key to: ' + folder + inputFileName + '.key');
    });
}


// generate a ssl certificate
generateSslCertificate(2048, file_name_ssl);
