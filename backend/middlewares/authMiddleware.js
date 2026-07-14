// backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise';

export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log('🔑 Auth header reçu:', authHeader ? 'Présent' : 'ABSENT');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('⛔ Token manquant ou mal formé');
        return res.status(401).json({
            success: false,
            error: 'Accès non autorisé - Token manquant'
        });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Token extrait:', token.substring(0, 20) + '...');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ Token valide pour', decoded.displayName || decoded.email);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            displayName: decoded.displayName,
            provider: decoded.provider
        };
        next();
    } catch (error) {
        console.log('❌ Token invalide:', error.message);
        return res.status(401).json({
            success: false,
            error: 'Token invalide ou expiré'
        });
    }
}