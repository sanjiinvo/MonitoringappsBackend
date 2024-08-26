const jwt = require('jsonwebtoken');

module.exports = (roles = []) =>{
    if( typeof roles ==='string'){
        roles = [roles]
    }
    return (req, res, next) => {
        const token = req.headers['authorization']

        if(!token){
            return res.status(401).json({error: 'No token provided'})
        }
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decoded
            if(!roles.length && !roles.includes(decoded.role)){
                return res.status(403).json({error: 'forbidden'})
            }
            next()
        } catch (error) {
            res.status(401).json({error: 'Token is invalid'})
        }
    }
}