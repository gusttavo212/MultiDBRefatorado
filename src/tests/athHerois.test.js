const assert = require('assert');
const api = require('./../api');
const Context = require('./../db/strategies/base/contextStrategy');
const PostGres = require('./../db/strategies/postgres/postgres');
const UsuarioSchema = require('./../db/strategies/postgres/schemas/usuarioSchema');
let app = {};


const USER = {
    username: 'josep',
    password: '123'
};
const USER_DB = {
    ...USER,
    password: '$2a$04$458Tr9oBICUdv.iaS0j.uePzSN6oJ1xIjddpp3UQipPJoEj/KWqka'
}
describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api;

        const connectionPostgres = await PostGres.connect();
        const model = await PostGres.defineModel(connectionPostgres, UsuarioSchema);
        
        const postgres = new Context(new PostGres(connectionPostgres, model))
        await postgres.update(null, USER_DB, true)
    });

    it('Obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });
        const dados = JSON.parse(result.payload);
       
        assert.deepEqual(result.statusCode, 200);
        assert.ok(dados.token.length > 10);
    });

    it('Deve retornar não autorizado ao usar um login que não existe', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'josefino',
                password: '123'
            }
        });
        const statusCode = result.statusCode        
        const dados = JSON.parse(result.payload);
       
        assert.deepEqual(result.statusCode, 401);
        assert.ok(dados.error, 'Unauthorized');
    });
});