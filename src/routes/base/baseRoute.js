class BaseRoute {
    static methods() {
        return Object.getOwnPropertyNames(this.prototype)
                      .filter(method => method !== 'constructor' && !method.startsWith('_'))
                      //Ignorar methodos privados que tem '_' e o constructor
    };
};
module.exports = BaseRoute;