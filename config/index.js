const _ = require('lodash');

// All configurations will extend these options
// ============================================
let all = {
    jwt: {
        secret   : "fSk35bzq6KutR0dQVKTL",
        issuer   : "http://projeto.arqsi.local",
        audience : "Everyone"
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all
);