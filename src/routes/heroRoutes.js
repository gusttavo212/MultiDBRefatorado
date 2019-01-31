const BaseRoute = require('./base/baseRoute');
const joi = require('joi');
const boom = require('boom');

const failAction = (request, headers, erro) => {
    throw erro;
}

const headers= joi.object({
    authorization: joi.string().required()
}).unknown()

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;
    };
    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Deve listar herois',
                notes: 'Pode paginar resultados e filtrar por nome',
                validate: {
                    //Posso validar
                    //payload
                    //headers/params => na url :id
                    //query => ?skip=10&limit=0&nome=deve
                    failAction,
                    query: {
                        skip: joi.number().integer().default(0),
                        limit: joi.number().integer().default(10),
                        nome: joi.string().min(3).max(100)
                    },
                    headers,
                }
            },
            handler: (request, headers) => {
                try {
                    const { //Dados que eu quero da request
                        nome,
                        skip,
                        limit,
                    } = request.query //Query string                        
                    const query = nome ? {
                        nome: {
                            $regex: `.*${nome}*.`
                        } //Buscar só com uma parte do nome 
                    } : {}

                    return this.db.read(
                        nome ? query : {},
                        parseInt(skip),
                        parseInt(limit));

                } catch (error) {
                    console.log('Deu ruim', error);
                    return boom.internal();
                }

            }
        };
    };

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Deve cadastrar herois',
                notes: 'Deve cadastrar heroi por nome e poder',
                validate: {
                    failAction,
                    payload: {
                        nome: joi.string().required().min(3).max(100),
                        poder: joi.string().required().min(2).max(30)
                    },
                    headers,
                }
            },
            handler: async (request) => {
                try {
                    const {
                        nome,
                        poder
                    } = request.payload; //Pegar o nome e o poder da request
                    const result = await this.db.create({
                        nome,
                        poder
                    });
                    return {
                        message: 'Heroi cadastrado com sucesso!',
                        _id: result._id
                    };
                } catch (error) {
                    console.log('Deu Ruim', error);
                    return boom.internal();
                }
            }
        };
    };

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],  
                description: 'Deve atualizar herois por id',
                notes: 'Deve receber nome e poder',             
                validate: {                   
                    failAction,
                    payload: {
                        nome: joi.string().required().min(3).max(100),
                        poder: joi.string().required().min(2).max(30)
                    },
                    params: {
                        id: joi.string().required()
                    },
                    headers,
                }
            },
            handler: async (request) => {
                try {
                    const payload = request.payload;
                    const id = request.params.id;
                    return this.db.update(id, payload)
                } catch (error) {
                    console.log('Deu Ruim', error);
                    return boom.internal();
                }
            }
        }
    }

    delete () {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {           
               tags:['api'],
               description: 'Deve deletar herois por id',
               notes: 'não deve deletar com id invalido',
                validate: {
                    failAction,
                    params: {
                        id: joi.string().required()
                    },
                    headers
                }
            },
            handler: async (request) => {
                try {
                    const id = request.params.id;
                    const result = await this.db.delete(id);
                    return result                    
                } catch (error) {
                    console.log('Deu Ruim', error);
                    return boom.internal();
                }
            }
        }
    }



};

module.exports = HeroRoutes;