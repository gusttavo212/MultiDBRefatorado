const BaseRoute = require('./base/baseRoute');
const joi = require('joi');

class HeroRoutes  extends BaseRoute {
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
                    failAction: (request, headers, erro) => {
                        throw erro;
                    },
                    query: {
                        skip: joi.number().integer().default(0),
                        limit: joi.number().integer().default(10),
                        nome: joi.string().min(3).max(100)
                    }
                }
            },
            handler: (request, headers) => {
                try{
                    const { //Dados que eu quero da request
                          nome,
                          skip,
                          limit,                          
                        } = request.query//Query string     
                        const query = nome ? {
                            nome: {$regex: `.*${nome}*.`}//Buscar só com uma parte do nome 
                        } : {}           
                                        
                    return this.db.read(
                        nome ? query : {},
                        parseInt(skip),
                        parseInt(limit));
                    
                }catch(error) {
                    console.log('Deu ruim', error);
                    return 'Erro interno no servidor';
                }
                
            }
        };
    };
    
};

module.exports = HeroRoutes;