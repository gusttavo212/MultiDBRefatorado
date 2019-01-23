const BaseRoute = require('./base/baseRoute');

class HeroRoutes  extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;

    };

    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: (request, headers) => {
                try{
                    const { //Dados que eu quero da request
                          nome,
                          skip,
                          limit,                          
                        } = request.query//Query string

                    console.log('Limit', limit)    
                    let query = {}
                    if(nome) {
                        query.nome = nome
                    };               

                    if (isNaN(skip)){
                        throw Error('O tipo do Skip é incorreto');
                    };
                    if (isNaN(limit)){
                        throw Error('O tipo do Limit é incorreto');
                    };
                                        
                    return this.db.read(
                        query,
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