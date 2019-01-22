const hapi = require('hapi');
const Context = require('./../src/db/strategies/base/contextStrategy');
const MongoDb = require('./../src/db/strategies/mongodb/mongodb');
const HeroiSchema = require('./../src/db/strategies/mongodb/schemas/heroisSchema');
const HeroRoutes = require('./routes/heroRoutes');

const app = new hapi.Server({
    port: 5000
});

function mapRoutes(instance, methods) {    
    return methods.map(method => instance[method]())
};

async function main(){
    const connection = MongoDb.connect();
    const context = new Context(new MongoDb(connection, HeroiSchema));    
    app.route([        
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods())            
    ]);

    await app.start();
    console.log('Servidor rodando na porta', app.info.port);

    return app;
};

module.exports = main();
