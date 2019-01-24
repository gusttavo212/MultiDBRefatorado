const BaseRoute = require('./base/baseRoute');
const joi = require('joi');

const failAction = (request, headers, erro) => {
    throw erro;
}

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
                    }
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
                    return 'Erro interno no servidor';
                }

            }
        };
    };

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                validate: {
                    failAction,
                    payload: {
                        nome: joi.string().required().min(3).max(100),
                        poder: joi.string().required().min(2).max(30)
                    }
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
                    return 'Internal Error!';
                }
            }
        };
    };

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    failAction,
                    payload: {
                        nome: joi.string().required().min(3).max(100),
                        poder: joi.string().required().min(2).max(30)
                    },
                    params: {
                        id: joi.string().required()
                    },
                }
            },
            handler: async (request) => {
                try {
                    const {
                        id
                    } = request.params;

                    const {
                        payload
                    } = request;

                    const dadosString = JSON.stringify(payload);
                    const dados = JSON.parse(dadosString);

                    const result = await this.db.update(id, dados);
                    console.log('RESULTADO:', result)
                    
                    return {
                        message: 'Heroi atualizado com sucesso!'
                    }
                } catch (error) {
                    console.log('Deu Ruim', error);
                    return 'Internal Error!';
                }
            }
        }
    }



};

module.exports = HeroRoutes;