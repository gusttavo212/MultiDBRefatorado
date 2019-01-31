const BaseRoute = require('./base/baseRoute');
const joi = require('joi');
const boom = require('boom');
const jwt = require('jsonwebtoken')
const failAction = (request, headers, erro) => {
    throw erro;
}
const USER = {
    username: 'josep',
    password: '123'
}

class AuthRoutes extends BaseRoute {
    constructor(secret) {
        super()
        this.secret = secret
    }
    login() {
        return {
            path:'/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'faz login com user e senha do banco',
                validate: {
                    failAction,
                    payload: {
                        username: joi.string().required(),
                        password: joi.string().required()
                    },
                }
            },
            handler: async (request) => {
                const {
                    username,
                    password
                    } = request.payload;

                if(
                    username.toLowerCase() !== USER.username ||
                    password !== USER.password
                )
                    return boom.unauthorized();

                const token = jwt.sign({
                    username: username,
                    id: 1
                }, this.secret)    
                return {
                    token
                }
                
            }
        }
    }
}

module.exports = AuthRoutes;