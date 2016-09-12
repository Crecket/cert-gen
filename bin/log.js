const chalk = require('chalk');

function log(color, input) {
    if (typeof input !== "object") {
        console.log(chalk[color](input));
        return;
    }
    console.log(input);
}

module.exports = function (verbose) {
    var loggers = {
        log: function () {
            if (verbose) {
                for (var i = 0; i < arguments.length; i++) log(arguments[i]);
            }
        },
        error: function () {
            if (verbose) {
                for (var i = 0; i < arguments.length; i++) log('red', arguments[i]);
            }
        },
        debug: function () {
            if (verbose) {
                for (var i = 0; i < arguments.length; i++) log('cyan', arguments[i]);
            }
        },
        info: function () {
            for (var i = 0; i < arguments.length; i++) log('magenta', arguments[i]);
        },
        warn: function () {
            for (var i = 0; i < arguments.length; i++) log('yellow', arguments[i]);
        },
    };
    return loggers;
};