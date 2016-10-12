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
        header: "RSA and SSL Options",
        optionList: [
            {
                name: "bitsize",
                alias: "b",
                description: "Output directory, defaults to: 2048"
            },
            {
                name: "single",
                description: "Store files to 1 file with 2 line breaks instead of 2 seperate files. The --public option will be ignored."
            },
            {
                name: "out",
                alias: "o",
                description: "Output directory, defaults to current folder"
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
                desc: "Change the bitsize and store the certificates to 1 file named KeyPairFile.crt",
                example: "$ certgen rsa -b 4096 --single --private KeyPairFile.crt"
            },
            {
                desc: "Target output folder",
                example: "$ certgen rsa -o ../../some_folder/"
            }
        ]
    },
    {
        header: "SSL Examples",
        content: [
            {
                desc: "Issuer json file input",
                example: "$ cert-gen ssl --issuer ./issuer.json"
            },
            {
                desc: "Subject json file input",
                example: "$ cert-gen ssl --subject ./subject.json"
            },
            {
                desc: "Private RSA Key file input",
                example: "$ cert-gen ssl --rsaPrivate ./localhost.key"
            },
            {
                desc: "Full example",
                example: "$ cert-gen ssl --issuer ./example_configs/issuer.json --subject ./example_c onfigs/subject.json --rsaPrivate ./example_configs/localhost.key -b 2048 --verbose"
            },
        ]
    },
]));
process.exit();