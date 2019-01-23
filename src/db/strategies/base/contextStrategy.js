const ICrud = require('./../interfaces/interfaceCrud');
//CLASSE USANDA EM TODO LUGAR que manda para os metodos da classe do banco passa do em strategy

//Todo uso do crud vem pra esta classe
//daki vai para a classe do contexto especificado seja mongo ou postgres
class ContextStrategy extends ICrud {//Classe abstrata
    constructor(strategy){
        super();
        this._database = strategy;
    };

    create(item, skip, limit) {
        return this._database.create(item);
    };
    read(item, skip, limit) {
        return this._database.read(item, skip, limit);
    };
    update(id, item) {
        return this._database.update(id, item);
    };
    delete(id) {
        return this._database.delete(id);
    }
    isConnected() {
        return this._database.isConnected();
    };
    static connect() {
        return this._database.connect();
    };
};

module.exports = ContextStrategy;