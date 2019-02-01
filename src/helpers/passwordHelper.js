const bcrypt = require('bcryptjs');

const {
    promisify
} = require('util');

const hashAsync = promisify(bcrypt.hash)
const compareAsync = promisify(bcrypt.compare)
const SALT = 3

class PasswordHelper {

    static hashPassword (pass) {
        return hashAsync(pass, SALT)
    }
    static comparePassword(pass, hash) {
        return compareAsync(pass, hash)
    }
}

module.exports = PasswordHelper;