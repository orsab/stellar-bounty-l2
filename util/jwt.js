const expressJwt = require('express-jwt');

const jwt = () => {
    const secret = process.env.JWT_SECRET;
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/login',
            '/register',
            '/',
        ],
    });
}

module.exports = jwt;