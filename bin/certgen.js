"use strict";
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const forge = require('node-forge');
const fs = require('fs');

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
        name: 'bitsize',
        alias: 'b',
        type: Number,
        defaultValue: 2048,
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

// logger object
const log = require('./log.js')(options.verbose);

// show options if debug is enabled
log.debug(options);

// display help
if (options.help) {
    console.log(getUsage([
        {
            header: "Certgen",
            content: "Generate RSA certificates through the command line."
        },
        {
            header: "Options",
            content: "",
            optionList: [
                {
                    name: "verbose",
                    alias: "v",
                    default: false,
                    description: "Will display extra information and any possible errors"
                },
                {
                    name: "help",
                    alias: "h",
                    description: "Print this usage guide."
                },
                {
                    name: "bitsize",
                    alias: "b",
                    description: "Output directory, defaults to: 2048"
                },
                {
                    name: "out",
                    alias: "o",
                    description: "Output directory, defaults to: ./"
                },
                {
                    name: "private",
                    description: "Private key filename + extension, defaults to: 'private.key'"
                },
                {
                    name: "public",
                    description: "Public key filename + extension, defaults to: 'public.pem'"
                }
            ]
        }
    ]));
    process.exit();
}

// create rsa certificate
rsa();