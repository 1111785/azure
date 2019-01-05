const authService = require('../services/auth.service');
const User        = require('../models/User');
var jwthelper    = require('jwt-decode');

function isAuthenticated(){
    return function(req, res, next){
        //Get the token from the request
        let token = getTokenFromRequest(req);
        if(!token){
            return res.status(401).send({error:"token_not_provided", message:"Precisa de um token para poder usar esta api."});
        }
        
        //Verify if the provided token is valid
        authService.verifyToken(token, (err, decoded) => {
            if(err){
                return res.status(401).json({error: 'invalid_token', message: err.message});
            }
            
            //Make sure the user associated with the token is valid
            User.findOne({email: decoded.sub})
            .then(user => {
                if(!user){
                    return res.status(401).json({
                        error   : 'invalid_user',
                        message : "O seu token não é válido. Por favor, faça login outra vez e tente de novo."
                    });
                }
                //Attach the user to the request object so that controllers can access the logged in user
                req.user = user;
                next();
            })
            .catch(error => {
                return res.status(401).json({
                    error   : 'invalid_user',
                    message : "O seu token não é válido. Por favor, faça login outra vez e tente de novo."
                });
            });
        });
    };
}

/**
* This function accepts a variable number of arguments. This allows the programmer to check 
* for multiple roles at the same time.
* 
* How to use: 
*  1. hasRole('admin')
*  2. hasRole('admin', 'utente')
*/
function hasRole(...args){
    let requiredRoles = args; 
    return function(req, res, next){
        let user = req.user || {};
        
        //Special case: 'admin' is always allowed
        if(user.role === 'admin'){
            return next();
        }
        
        if(requiredRoles.indexOf(user.role) === -1){
            return res.status(403).json({
                error: 'forbidden',
                message: 'Não tem permissões utilizar esta funcionalidade'
            });
        }
        
        next();
    };
}

function getTokenFromRequest(req){
    //Try to get from Headers
    let token = req.headers.authorization;
    if(token){
        //It is expected to be something like "Bearer <token>"
        let parts = token.split(' ');
        return parts.length == 2 ? parts[1] : null;
    }
    
    //Default to query variable
    return req.query.token;
}

function getUser(token) {
        
    if (!token) {
        return null;
    }

    return jwthelper(token);
}

module.exports.isAuthenticated = isAuthenticated;
module.exports.hasRole = hasRole;
module.exports.getTokenFromRequest = getTokenFromRequest;
module.exports.getUser = getUser;
