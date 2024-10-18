// middlewares/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Erreur lors de la vérification du token :', err);
        res.status(400).json({ message: 'Token invalide.' });
    }
};

module.exports = auth;
