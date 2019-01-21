const ICrud = require("./../interfaces/interfaceCrud");
const mongoose = require("mongoose");
const STATUS = {
  0: "Disconectado",
  1: "Conectado",
  2: "Conectando",
  3: "Disconectado"
};

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected() {
    const state = STATUS[this._connection.readyState];
    if (state === "Conectado") return state;

    if (state !== "Conectando") return state;

    await new Promise(resolve => setTimeout(resolve, 1000));

    return STATUS[this._connection.readyState];
  };

  static connect() {
    mongoose.connect(
      "mongodb://gadsden:250433@localhost/herois?authSource=admin&w=1",
      { useNewUrlParser: true },
      function(error) {
        if (!error) return;
        console.log("Falha na conexão", error);
      }
    );

    const connection = mongoose.connection;
    
    connection.once("open", () => console.log("Database MONGODB CONECTADO"));

    return connection;

  };

  create(item) {
    return this._schema.create(item);    
  };

  read(item, skip=0, limit=10) {//Skip = Seria a pagina
    return this._schema.find(item).skip(skip).limit(limit);
  };

  update(id, item) {
    return this._schema.updateOne({_id: id}, {$set: item})//updateOne é o novo update
  };

  delete(id) {
    return this._schema.deleteOne({_id: id});
  };
}

module.exports = MongoDB;
