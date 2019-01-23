const assert = require('assert');
const api = require('./../apiExample.1');
let app = {};

describe.only('Suite de testes da API Heroes', function () {
    this.beforeAll(async () => {
        app = await api;
    });

    it('Listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=3'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode //status 200 quer dizer q foi
        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));
    });
    it('Listar /herois Deve retornar somente 10 registros', async () => {
        const TAMANHO_LIMITE = 10;
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        });        
        const dados = JSON.parse(result.payload); 
        
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);//Status 200 requisição efetuada
        assert.ok(dados.length === TAMANHO_LIMITE);//Deve ter somente 10 dados

    });
    it('O Limit e o Skip tem que ser numeros INT', async () => {
        const TAMANHO_LIMITE = 'AEEEEEEE';
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        });    
        const errorResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message":"child \"limit\" fails because [\"limit\" must be a number]",
            "validation":{
                "source":"query",
                "keys":["limit"]
            }
        }   
        assert.deepEqual(result.statusCode, 400);  
        assert.deepEqual(result.payload, JSON.stringify(errorResult));     

    });
    it('Listar /herois deve filtrar um item', async () => {
        const TAMANHO_LIMITE = 30;
        const NAME = 'Homen Aranha-1548102086825'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${NAME}`
        });      
        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);//Status 200 requisição efetuada  
        assert.ok(dados[0].nome === NAME);   

    });
    
});