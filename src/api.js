//npm i vision inert hapi-swagger

const hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const HeroRoutes = require('./routes/heroRoutes');
const AuthRoutes = require('./routes/authRoutes');

const Postgres = require('../src/db/strategies/postgres/postgres');
const UsuarioSchema = require('../src/db/strategies/postgres/schemas/usuarioSchema');

const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const JWT_SECRET = 'SEGREDO_MANIERO_123';
const hapiJwt = require('hapi-auth-jwt2');

const app = new hapi.Server({
    port: 5000
});

function mapRoutes(instance, methods) {    
    return methods.map(method => instance[method]())
};

async function main(){
    const connection = MongoDb.connect();
    const context = new Context(new MongoDb(connection, HeroiSchema));  

    const connectionPostgres = await Postgres.connect();
    const modelUsuario = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
    const contextPostgres = new Context(new Postgres(connectionPostgres, modelUsuario));

    const swaggerOptions = {
        info: {
            title: 'API Herois  -#CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }
    await app.register([
        hapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
       /* options: {
            expiresIn: 20
       }*/
       validate: (dados, request) => {
           //Verificar no banco se o usuario continua ativo ou continua pagando
           return {
               isValid: true
           }
       }
    })

    app.auth.default('jwt') 
    app.route([        
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),//Retorna rotas de heroRoutes
        ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoutes.methods())//Retorna rotas de AuthRoutes     
    ]);

    await app.start();
    console.log('Servidor rodando na porta', app.info.port);

    return app;
};

module.exports = main();
