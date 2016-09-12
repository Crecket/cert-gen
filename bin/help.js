const getUsage = require('command-line-usage');

console.log(getUsage([
    {
        header: "Certgen",
        content: "Generate SSL or RSA certificates through the command line. Project home: [underline]{https://github.com/Crecket/certgen}"
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
            }
        ]
    },
    {
        header: "RSA Options",
        optionList: [
            {
                name: "bitsize",
                alias: "b",
                description: "Output directory, defaults to: 2048"
            },
            {
                name: "amount",
                alias: "a",
                description: "Amount of certificates to generate. Values above 1 will cause the script to add a integer to the scriptname. E.G. key1.key, key2.key ..."
            },
            {
                name: "single",
                alias: "s",
                description: "Store files to 1 file with 2 line breaks instead of 2 seperate files. The --public option will be ignored."
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
    },
    {
        header: "RSA Examples",
        content: [
            {
                desc: "Bitsize for the certificate",
                example: "$ certgen -b 4096"
            },
            {
                desc: "Amount of key sets to generate",
                alias: "a",
                example: '$ certgen -a 3'
            },
            {
                desc: "Store the keys to 1 file instead of multiple",
                alias: "s",
                example: '$ certgen -s'
            },
            {
                desc: "Target output folder",
                example: "$ certgen -o ../../some_folder/"
            },
            {
                desc: "Private key filename",
                example: "$ certgen --private key_file"
            },
            {
                desc: "Public key filename",
                example: "$ certgen --public public.crt"
            }
        ]
    },
    // {
    //     header: "SSL Options",
    //     content: "",
    //     optionList: [
    //         {
    //             name: "bitsize",
    //             alias: "b",
    //             description: "Output directory, defaults to: 2048"
    //         },
    //         {
    //             name: "out",
    //             alias: "o",
    //             description: "Output directory, defaults to: ./"
    //         },
    //         {
    //             name: "private",
    //             description: "Private key filename + extension, defaults to: 'private.key'"
    //         },
    //         {
    //             name: "public",
    //             description: "Public key filename + extension, defaults to: 'public.pem'"
    //         }
    //     ]
    // },
]));
process.exit();