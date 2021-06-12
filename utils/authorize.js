const jwt = require('jsonwebtoken');
const { SECRET } = require('./data');

function authorize(req, res, next) {
    const { token } = req.cookies
    
    if (token == null) {
        req.user = null;
        next();
        return;
    }

    try {
        const user = jwt.verify(token, SECRET);
        req.user = user;
    } catch {
        req.user = null;
    }

    next();
}

module.exports = authorize;
