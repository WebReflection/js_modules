// really ... nothing special, just a cleaned up argv
module.exports = process.argv.slice(1 + /(?:^|\/|\\)node(?:\.exe)?$/.test(process.argv[0]));