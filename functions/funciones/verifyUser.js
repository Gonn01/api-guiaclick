const jwt = require('jsonwebtoken');

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

async function verifyUser(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no provisto' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, SUPABASE_JWT_SECRET);
        req.user = payload; // ahora tenés: { sub: 'id-de-supabase', email, ... }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

module.exports = verifyUser;
