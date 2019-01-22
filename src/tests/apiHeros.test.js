const assert = require('assert');
const api = require('./../apiExample.1');
let app = {};

describe('Suite de testes da API Heroes', function () {
    this.beforeAll(async () => {
        app = await api;
    });

    it('Listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode //status 200 quer dizer q foi
        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));
    });
});