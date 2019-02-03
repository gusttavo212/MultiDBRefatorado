const ICrud = require('./../interfaces/interfaceCrud');
const Sequelize = require('sequelize');



class Postgres extends ICrud {
    constructor(connection, schema) {
        super();
        this._connection = connection;
        this._schema = schema;        
    };
    async isConnected() {
        try{
            await this._connection.authenticate();
            return true;
        }
        catch(error) {
            console.log('fail!!!', error);
            return false;
        }
    };
    async create(item) {
        const {
            dataValues
        } = await this._schema.create(item);

        return dataValues;
    };
    
    async delete(id) {
        const query = id ? { id } : {};
        return this._schema.destroy({where: query});
    }
    
    async update(id, item, upsert = false) {
        const fn = upsert ? 'upsert' : 'update'

        return this._schema[fn](item, {
            where: id
        });
        //Retorna 1 se o update deu certo e 0 se não
    }
    async read(item = {}) {
        return this._schema.findAll({where: item, raw: true});
    }

    static async connect() {
        const connection = new Sequelize(
            'heroes',
            'gadsden',
            '250433',
            {
                 host: 'localhost',
                 dialect: 'postgres',
                 quoteIdentifiers: false,
                 operatosAliases: false,
                 logging: false
            }
        );
        return connection;
    };

    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        );

        await model.sync();

        return model;
    }
};

module.exports = Postgres;