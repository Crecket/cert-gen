#! /usr/bin/env node
"use strict";

const commandLineArgs = require('command-line-args');
const forge = require('node-forge');
const fs = require('fs');

// http://javascriptplayground.com/blog/2012/08/writing-a-command-line-node-tool/

// argument options
const optionDefinitions = [,
    {
        name: 'help',
        alias: 'h',
        type: Boolean
    },
    {
        name: 'verbose',
        alias: 'v',
        type: Boolean,
        default: true,
        defaultValue: false
    },
    {
        name: 'type',
        alias: 't',
        defaultOption: true,
        default: 'rsa',
        type: String,
        required: true
    },

    // ssl
    {
        name: 'notBefore',
        type: String,
        defaultValue: 'now',
        default: true
    },
    {
        name: 'notAfter',
        type: String,
        defaultValue: '1 year',
        default: true
    },
    {
        name: 'issuer',
        type: String,
        defaultValue: '1 year',
        default: true
    },

    // rsa
    {
        name: 'bitsize',
        alias: 'b',
        type: Number,
        defaultValue: 2048,
        default: true
    },
    {
        name: 'amount',
        alias: 'a',
        type: Number,
        defaultValue: 1,
        default: true
    },
    {
        name: 'single',
        alias: 's',
        type: Boolean,
        defaultValue: false,
        default: true
    },
    {
        name: 'out',
        alias: 'o',
        type: String,
        defaultValue: './',
        default: true
    },
    {
        name: 'private',
        type: String,
        defaultValue: 'private.key',
        default: true
    },
    {
        name: 'public',
        type: String,
        defaultValue: 'public.pem',
        default: true
    },
    // { name: 'destination', alias: 'd',type: String, multiple: true, defaultOption: true }
]
// parse the arguments
const options = commandLineArgs(optionDefinitions);

// create log object using options
const log = require('./utils/log')(options.verbose);

// show options if debug is enabled
log.debug(options);

// display help
if (options.help) {
    require('./help');
}

// check if the target amount is atleast 1
if (options.amount <= 0) {
    log.error('Amount setting has to be 1 or higher');
    process.exit();
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
    default:
        log.error('No valid type given (' + options.type + '). Enter either ssl or rsa');
        break;
}
