const assert = require('assert');
const api = require('./../api');
let app = {};
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impvc2VwIiwiaWQiOjEsImlhdCI6MTU0ODk0OTE0OX0.uYuurCcxJRGJwuY0cW85G6UlFnXr5B85-LWMmaJ3QGc'

describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api;
    });

    it('Obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'josep',
                password: '123'
            }
        });
        const dados = JSON.parse(result.payload);
       
        assert.deepEqual(result.statusCode, 200);
        assert.ok(dados.token.length > 10);
    });
});