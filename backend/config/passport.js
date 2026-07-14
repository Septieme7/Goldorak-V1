// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

export function configurePassport(db) {
    // Sérialisation de l'utilisateur pour la session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Désérialisation de l'utilisateur depuis la session
    passport.deserializeUser(async (id, done) => {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            done(null, rows[0]);
        } catch (error) {
            done(error, null);
        }
    });

    // Stratégie Google OAuth2
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8800/api/v1/auth/google/callback'
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                // Vérifier si l'utilisateur existe déjà
                const [existing] = await db.query(
                    'SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?',
                    ['google', profile.id]
                );

                if (existing.length > 0) {
                    // Utilisateur existant
                    return done(null, existing[0]);
                }

                // Créer un nouvel utilisateur
                const [result] = await db.query(
                    `INSERT INTO users (oauth_provider, oauth_id, email, display_name, avatar_url, created_at)
                    VALUES (?, ?, ?, ?, ?, NOW())`,
                    [
                        'google',
                        profile.id,
                        profile.emails?.[0]?.value || null,
                        profile.displayName,
                        profile.photos?.[0]?.value || null
                    ]
                );

                const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
                done(null, newUser[0]);
            } catch (error) {
                done(error, null);
            }
        }));
    }

    // Stratégie GitHub OAuth2
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
        passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:8800/api/v1/auth/github/callback',
            scope: ['user:email']
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                // Vérifier si l'utilisateur existe déjà
                const [existing] = await db.query(
                    'SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?',
                    ['github', profile.id]
                );

                if (existing.length > 0) {
                    // Utilisateur existant
                    return done(null, existing[0]);
                }

                // Créer un nouvel utilisateur
                const [result] = await db.query(
                    `INSERT INTO users (oauth_provider, oauth_id, email, display_name, avatar_url, created_at)
                    VALUES (?, ?, ?, ?, ?, NOW())`,
                    [
                        'github',
                        profile.id,
                        profile.emails?.[0]?.value || null,
                        profile.displayName || profile.username,
                        profile.photos?.[0]?.value || null
                    ]
                );

                const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
                done(null, newUser[0]);
            } catch (error) {
                done(error, null);
            }
        }));
    }

    return passport;
}
