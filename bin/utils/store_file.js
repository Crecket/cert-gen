module.exports = function (options) {
    const forge = require('node-forge');
    const fs = require('fs');
    const log = require('./log.js')(options.verbose);

    return function (path, contents, callback, encoding) {
        if (!encoding) {
            // default
            encoding = 'utf8';
        }

        // attempt to write file
        fs.writeFile(path, contents, encoding, function (err) {
            if (err) {
                // check if it is a common error code
                if (err.code === 'ENOENT') {
                    err = 'Failed to write file, make sure the directory exists and is writable! Target path: '+ path;
                }

                log.error(err);
                callback(false);
                return;
            } else {
                callback(true);
            }
        });
    }
};