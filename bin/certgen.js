"use strict";
const commandLineArgs = require('command-line-args');
const forge = require('node-forge');
const fs = require('fs');

// argument options
const optionDefinitions = [,
    {
        name: 'help',
        group: ['rsa', 'ssl', '_all'],
        alias: 'h',
        type: Boolean
    },
    {
        name: 'verbose',
        alias: 'v',
        group: ['rsa', 'ssl', '_all'],
        type: Boolean,
        default: true,
        defaultValue: false
    },
    {
        name: 'type',
        alias: 't',
        group: ['rsa', 'ssl', '_all'],
        type: String,
        required: true
    },

    // rsa only options
    {
        name: 'bitsize',
        alias: 'b',
        group: ['rsa', '_all'],
        type: Number,
        defaultValue: 2048,
        default: true
    },
    {
        name: 'amount',
        alias: 'a',
        group: ['rsa', '_all'],
        type: Number,
        defaultValue: 1,
        default: true
    },
    {
        name: 'single',
        alias: 's',
        group: ['rsa', '_all'],
        type: Boolean,
        defaultValue: false,
        default: true
    },
    {
        name: 'out',
        alias: 'o',
        group: ['rsa', '_all'],
        type: String,
        defaultValue: './',
        default: true
    },
    {
        name: 'private',
        type: String,
        group: ['rsa', '_all'],
        defaultValue: 'private.key',
        default: true
    },
    {
        name: 'public',
        type: String,
        group: ['rsa', '_all'],
        defaultValue: 'public.pem',
        default: true
    },
    // { name: 'destination', alias: 'd',type: String, multiple: true, defaultOption: true }
]
// parse the arguments
const options = commandLineArgs(optionDefinitions);

// logger object
const log = require('./log')(options._all.verbose);

// show options if debug is enabled
log.debug(options);

// display help
if (options.help) {
    require('./help.js');
}

// not looking for help but no type is set, throw a error
if (!options.type) {
    log.error('No type is set. Use --type or -t to select either "ssl" or "rsa".');
    process.exit();
}

log.debug('Selected certificate type: ' + options.type);

// check which to use
switch (options.type.toLowerCase()) {
    case 'rsa':
        // create rsa certificate with the current options
        require('./rsa.js')(options)();
        break
    case 'ssl':
        break;
}

// create rsa certificate
rsa();