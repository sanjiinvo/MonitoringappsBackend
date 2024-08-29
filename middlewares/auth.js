const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        try {
            // Убираем слово "Bearer" из токена
            const tokenWithoutBearer = token.split(' ')[1];
            const decoded = jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY);
            req.user = decoded;

            // Если массив roles пуст, доступ разрешен для всех
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token is invalid' });
        }
    };
};
