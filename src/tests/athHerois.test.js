const assert = require('assert');
const api = require('./../api');
const Context = require('./../db/strategies/base/contextStrategy');
const PostGres = require('./../db/strategies/postgres/postgres');
const UsuarioSchema = require('./../db/strategies/postgres/schemas/usuarioSchema');
let app = {};
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impvc2VwIiwiaWQiOjEsImlhdCI6MTU0ODk0OTE0OX0.uYuurCcxJRGJwuY0cW85G6UlFnXr5B85-LWMmaJ3QGc'

const USER = {
    username: 'josep',
    password: '123'
};
const USER_DB = {
    ...USER,
    password: ''
}
describe.only('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api;

        const connectionPostgres = await PostGres.connect();
        const model = await PostGres.defineModel(connectionPostgres, UsuarioSchema);
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
});