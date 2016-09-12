module.exports = function (options) {
    const fs = require('fs');
    const log = require('./log.js')(options.verbose);

    // current index
    var index = 1;

    // contains the callback used to iterate and check from the parent
    var callbackFunction = false;

    return {
        start: function (callback) {
            log.debug('Starting RSA queue, generating ' + options.amount + ' keysets.');

            // store callback in the object
            callbackFunction = callback;

            // begin by calling the callback once
            callbackFunction(index);
        },
        next: function () {
            index++;
            if (index <= options.amount) {

                // if a callback is set propperly, call it
                if (callbackFunction) {
                    callbackFunction(index);
                }
                return true;
            }
            log.debug('Finished RSA queue.');
            return false;
        },
        reset: function () {
            log.debug('Reset RSA queue.');
            index = 0;
            callbackFunction = false;
        }
    };
};