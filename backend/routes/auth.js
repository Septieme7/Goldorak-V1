// backend/routes/auth.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export default function(db) {
    const router = express.Router();

    console.log('🔌 authRoutes reçoit db:', db ? 'OK' : 'UNDEFINED');

    function generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                displayName: user.display_name,
                provider: user.oauth_provider
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
    }

    // ==================== GOOGLE ====================
    router.get('/google',
        passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    router.get('/google/callback',
        passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login?error=auth_failed` }),
        (req, res) => {
            const token = generateToken(req.user);
            res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
        }
    );

    // ==================== GITHUB ====================
    router.get('/github',
        passport.authenticate('github', { scope: ['user:email'] })
    );

    router.get('/github/callback',
        passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login?error=auth_failed` }),
        (req, res) => {
            const token = generateToken(req.user);
            res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
        }
    );

    // ==================== MODE INVITÉ ====================
    router.post('/guest', async (req, res) => {
        console.log('📥 Route /guest appelée');

        if (!db) {
            console.error('❌ db est undefined dans /guest');
            return res.status(500).json({
                success: false,
                error: 'Erreur interne: base de données non disponible'
            });
        }

        try {
            const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
            const guestEmail = `guest_${Date.now()}@goldorak.local`;
            const displayName = 'Invité';

            console.log('👤 Tentative de création:', { guestId, guestEmail });

            // Vérifier si la table users existe
            const [tables] = await db.query("SHOW TABLES LIKE 'users'");
            if (tables.length === 0) {
                console.error('❌ Table "users" inexistante');
                return res.status(500).json({
                    success: false,
                    error: 'Table utilisateurs manquante'
                });
            }

            // Insertion (sans last_login pour éviter les problèmes)
            const [result] = await db.query(
                `INSERT INTO users (oauth_provider, oauth_id, email, display_name, avatar_url, created_at)
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                ['guest', guestId, guestEmail, displayName, null]
            );

            console.log('✅ Invité créé, ID:', result.insertId);

            const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            const token = generateToken(newUser);

            res.json({
                success: true,
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    displayName: newUser.display_name,
                    provider: newUser.oauth_provider,
                    isGuest: true
                }
            });
        } catch (error) {
            console.error('❌ Erreur dans /guest:', error);
            console.error('📄 Détail SQL:', error.sqlMessage || error.message);
            console.error('📄 Stack:', error.stack);

            // Gestion du doublon
            if (error.code === 'ER_DUP_ENTRY') {
                try {
                    const [existing] = await db.query(
                        'SELECT * FROM users WHERE oauth_provider = ? ORDER BY created_at DESC LIMIT 1',
                        ['guest']
                    );
                    if (existing.length > 0) {
                        const token = generateToken(existing[0]);
                        return res.json({
                            success: true,
                            token,
                            user: {
                                id: existing[0].id,
                                email: existing[0].email,
                                displayName: existing[0].display_name,
                                provider: existing[0].oauth_provider,
                                isGuest: true
                            }
                        });
                    }
                } catch (e) {
                    console.error('❌ Erreur récupération invité existant:', e);
                }
            }

            res.status(500).json({
                success: false,
                error: 'Erreur lors de la création du compte invité',
                detail: error.sqlMessage || error.message
            });
        }
    });

    // ==================== UTILITAIRES ====================
    router.get('/verify', (req, res) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, error: 'Token manquant' });
        }
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            res.json({ success: true, user: decoded });
        } catch (error) {
            res.status(401).json({ success: false, error: 'Token invalide ou expiré' });
        }
    });

    router.get('/me', (req, res) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, error: 'Non authentifié' });
        }
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            res.json({ success: true, user: decoded });
        } catch (error) {
            res.status(401).json({ success: false, error: 'Token invalide' });
        }
    });

    router.post('/logout', (req, res) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Erreur lors de la déconnexion' });
            }
            res.json({ success: true, message: 'Déconnexion réussie' });
        });
    });

    return router;
}