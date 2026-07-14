import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { configurePassport } from './config/passport.js';
import authRoutes from './routes/auth.js';
import { requireAuth } from './middlewares/authMiddleware.js';
import { dbMiddleware } from './middlewares/dbMiddleware.js';

// Import des routeurs
import personnagesRoutes from './routes/personnages.js';
import robotsRoutes from './routes/robots.js';
import vaisseauxRoutes from './routes/vaisseaux.js';
import armesRoutes from './routes/armes.js';
import episodesRoutes from './routes/episodes.js';
import monstresRoutes from './routes/monstres.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// --- Middlewares de base (indépendants) ---
app.use(cors({
    origin: process.env.CORS_ORIGIN || FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'votre_secret_session',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// --- Base de données (variable, sera définie plus tard) ---
let db;

// --- Routes publiques (indépendantes de la DB) ---
app.get('/api/v1/test', (req, res) => {
    res.json({ success: true, message: 'Test OK' });
});
app.post('/api/v1/easter-egg', (req, res) => {
    console.log('🔥 Easter Egg activé !');
    res.json({ success: true });
});

// --- Fonction d'initialisation de la base de données ---
async function initDatabase() {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'db',
            user: process.env.MYSQL_USER || 'app_user',
            password: process.env.MYSQL_PASSWORD || 'app_password',
            database: process.env.MYSQL_DATABASE || 'goldorak_db',
            port: process.env.DB_PORT || 3306,
            charset: 'utf8mb4'
        });
        await db.query("SET NAMES utf8mb4");
        console.log('✅ Connexion DB établie');
        return db;
    } catch (error) {
        console.error('❌ Erreur DB:', error);
        process.exit(1);
    }
}

// --- Démarrage asynchrone ---
(async () => {
    // 1. Initialiser la DB
    await initDatabase();

    // 2. Configurer Passport
    configurePassport(db);

    // 3. Monter les routes d'authentification (dépend de db)
    app.use('/api/v1/auth', authRoutes(db));

    // 4. Middleware db (injecte db dans req)
    app.use('/api/v1', dbMiddleware(db));

    // 5. Health (dépend de db)
    app.get('/api/v1/health', async (req, res) => {
        try {
            await db.query('SELECT 1');
            res.json({ success: true, status: 'online' });
        } catch (error) {
            res.status(503).json({ success: false, status: 'offline', error: error.message });
        }
    });

    // 6. Middleware d'authentification (sauf exceptions)
    app.use('/api/v1', (req, res, next) => {
        if (req.path === '/health' || req.path === '/easter-egg' || req.path === '/test' || req.path.startsWith('/auth')) {
            return next();
        }
        console.log('🛡️ Protection activée pour', req.path);
        requireAuth(req, res, next);
    });

    // 7. Monter les routeurs protégés (utilisent req.db)
    app.use('/api/v1/personnages', personnagesRoutes);
    app.use('/api/v1/robots', robotsRoutes);
    app.use('/api/v1/vaisseaux', vaisseauxRoutes);
    app.use('/api/v1/armes', armesRoutes);
    app.use('/api/v1/episodes', episodesRoutes);
    app.use('/api/v1/monstres', monstresRoutes);

    // 8. Stats (dépend de db)
    app.get('/api/v1/stats', requireAuth, async (req, res) => {
        try {
            const [personnages] = await db.query('SELECT COUNT(*) as count FROM personnages');
            const [robots] = await db.query('SELECT COUNT(*) as count FROM robots');
            const [armes] = await db.query('SELECT COUNT(*) as count FROM armes');
            const [episodes] = await db.query('SELECT COUNT(*) as count FROM episodes');
            const [monstres] = await db.query('SELECT COUNT(*) as count FROM monstres');
            const [vaisseaux] = await db.query('SELECT COUNT(*) as count FROM vaisseaux');
            res.json({
                success: true,
                data: {
                    personnages: personnages[0].count,
                    robots: robots[0].count,
                    armes: armes[0].count,
                    episodes: episodes[0].count,
                    monstres: monstres[0].count,
                    vaisseaux: vaisseaux[0].count
                }
            });
        } catch (error) {
            console.error('❌ Erreur stats:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // 9. Gestion des erreurs
    app.use((err, req, res, next) => {
        console.error('❌ Erreur serveur:', err);
        res.status(500).json({ success: false, error: err.message });
    });

    app.use((req, res) => {
        res.status(404).json({ success: false, error: 'Route non trouvée' });
    });

    // 10. Démarrer le serveur
    app.listen(PORT, () => {
        console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
        console.log(`📅 ${new Date().toLocaleString('fr-FR')}`);
        console.log('🔗 Routes disponibles :');
        console.log('   GET  /api/v1/test         (non protégé)');
        console.log('   GET  /api/v1/health       (non protégé)');
        console.log('   POST /api/v1/easter-egg   (non protégé)');
        console.log('   POST /api/v1/auth/guest   (non protégé)');
        console.log('   /api/v1/personnages       (protégé)');
        console.log('   /api/v1/robots            (protégé)');
        console.log('   /api/v1/vaisseaux         (protégé)');
        console.log('   /api/v1/armes             (protégé)');
        console.log('   /api/v1/episodes          (protégé)');
        console.log('   /api/v1/monstres          (protégé)');
        console.log('   GET  /api/v1/stats        (protégé)');
    });
})();