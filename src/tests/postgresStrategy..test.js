const assert = require('assert');
const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');

const context = new Context (new Postgres())
const MOCK_HEROI_CADASTRAR = {
    nome: 'Gavião Negro',
    poder: 'flexas'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: 'Batman',
    poder: 'Dinheiro'
}

describe('Postgres Strategy', function(){
    this.timeout(Infinity)
    this.beforeAll(async function () {
       await context.connect()
       await context.delete();
       await context.create(MOCK_HEROI_ATUALIZAR)
    })
    it('PostgresSQL Connection', async function () {
        const result = await context.isConnected()
        assert.equal(result, true)//(resultado, esperado)
    })
    it('Cadastrar', async function () {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id;
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('Listar', async function () {
        const [result] = await context.read({nome: MOCK_HEROI_CADASTRAR.nome});
        delete result.id;
        //const posicaoZero = result[0]
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    })
    it('Atualizar', async function () {
        const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome})
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher Maravilha'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualzado] = await context.read({ id: itemAtualizar.id});
        assert.deepEqual(itemAtualzado.nome, novoItem.nome);
        assert.deepEqual(result, 1);
        //Concatenar objetos
    })
    it('Remover por ID', async function () {
        const [item] = await context.read({});
        const result = await context.delete(item.id);
        assert.deepEqual(result, 1);
    })
})
