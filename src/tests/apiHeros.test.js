const assert = require('assert');
const api = require('./../api');
let app = {};
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impvc2VwIiwiaWQiOjEsImlhdCI6MTU0ODk0OTE0OX0.uYuurCcxJRGJwuY0cW85G6UlFnXr5B85-LWMmaJ3QGc'
const headers = {
    Authorization: TOKEN
}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
};
const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'Flechas'    
}
let MOCK_ID = '';
describe('Suite de testes da API Heroes', function () {
    this.beforeAll(async () => {
        app = await api;
        
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })
       const dados = JSON.parse(result.payload)
       MOCK_ID = dados._id;
    });

    it('Listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
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
            headers,
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
            headers,
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
    it('não deve cadastrar com payload errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: {
                NAME: 'Flash'
            }
        })
        const payload = JSON.parse(result.payload)
        assert.deepEqual(result.statusCode, 400)
        assert.ok(payload.message.search('"nome" is required') !== -1)
    })

    it('Cadastrar POST /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            headers,
            payload: MOCK_HEROI_CADASTRAR
        });      

        const statusCode = result.statusCode;
        const { 
            message,
            _id
         } = JSON.parse(result.payload);
        assert.ok(statusCode === 200);
        assert.notStrictEqual(_id, undefined);
        assert.deepEqual(message, 'Heroi cadastrado com sucesso!')
    });

    it('Atualuizar PATCH /herois/id', async () => {
        const _id = MOCK_ID;
        const expected = {
            nome: 'Canário Negro',
            poder: 'Grito'
        };
       
        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        });

        assert.deepEqual(result.statusCode, 200) 
        assert.deepEqual(JSON.parse(result.payload).nModified, 1)
    });     

    it('remover DELETE - /herois/id:', async () => {
        const _id = MOCK_ID;
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        });        
        
        assert.ok(result.statusCode === 200);    
        assert.deepEqual(JSON.parse(result.payload).n, 1);
    });

   //Não deve remover com id incorreto
    
});