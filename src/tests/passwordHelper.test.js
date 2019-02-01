const asseert = require('assert');
const PasswordHelper = require('./../helpers/passwordHelper');

const SENHA = 'Gustavo@12321'
const HASH = '$2a$04$/ni.HGTVgj89dSHtMLUprOuI6RhtZnFgGFaCO9ZFxktgv3ey8IYEe';


describe('UserHelper test suite', function () {
    it('Deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
      
        asseert.ok(result.length > 10);
    });

    it('Deve comparar uma senha com seu hash', async ()=> {
        const result = await PasswordHelper.comparePassword(SENHA, HASH);
        asseert.ok(result);
    })
})