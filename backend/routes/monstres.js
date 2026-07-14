import express from 'express';
import {
    validerChampsRequis,
    verifierDoublonsGenerique,
    validerIdExistant,
    nettoyerDonnees
} from '../middlewares/validation.js';

const router = express.Router();

// GET – Liste paginée avec recherche
router.get('/', async (req, res) => {
    try {
        const db = req.db;
        if (!db) {
            console.error('❌ db non disponible dans req');
            return res.status(500).json({ success: false, error: 'Base de données non disponible' });
        }

        const page = parseInt(req.query?.page) || 1;
        const limit = parseInt(req.query?.limit) || 20;
        const offset = (page - 1) * limit;
        const search = req.query?.search || '';

        let whereClause = '';
        let params = [];
        let countWhere = '';
        let countParams = [];

        if (search && search.length > 0) {
            const searchPattern = `%${search}%`;
            // Préfixer les colonnes : m. pour monstres, e. pour episodes
            whereClause = 'WHERE m.nom_fr LIKE ? OR m.nom_jp LIKE ? OR e.titre_fr LIKE ?';
            params = [searchPattern, searchPattern, searchPattern];
            countWhere = 'WHERE m.nom_fr LIKE ? OR m.nom_jp LIKE ? OR e.titre_fr LIKE ?';
            countParams = [searchPattern, searchPattern, searchPattern];
        }

        const [rows] = await db.query(
            `SELECT m.*, 
                    e.numero_jp as episode_numero_jp,
                    e.numero_fr as episode_numero_fr,
                    e.titre_fr as episode_titre_fr
             FROM monstres m
             LEFT JOIN episodes e ON m.episode_id = e.id
             ${whereClause}
             ORDER BY m.nom_fr ASC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [countResult] = await db.query(
            `SELECT COUNT(DISTINCT m.id) as total 
             FROM monstres m
             LEFT JOIN episodes e ON m.episode_id = e.id
             ${countWhere}`,
            countParams
        );
        const total = countResult[0].total;

        res.json({
            success: true,
            data: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ Erreur GET /monstres:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Par ID
router.get('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [monstre] = await db.query(
            `SELECT m.*, e.titre_fr as episode_titre_fr
             FROM monstres m
             LEFT JOIN episodes e ON m.episode_id = e.id
             WHERE m.id = ?`,
            [id]
        );
        if (monstre.length === 0) {
            return res.status(404).json({ success: false, error: "Monstre non trouvé" });
        }
        res.json({ success: true, data: monstre[0] });
    } catch (error) {
        console.error('❌ Erreur GET /monstres/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST – Créer
router.post('/', async (req, res) => {
    try {
        const db = req.db;
        const { nom_fr, nom_jp, episode_id, description, type_monstre, taille, puissance } = req.body;
        validerChampsRequis(req.body, ['nom_fr']);

        if (episode_id) {
            await validerIdExistant(db, 'episodes', episode_id, 'Épisode');
        }

        const doublons = await verifierDoublonsGenerique(db, 'monstres', ['nom_fr', 'nom_jp'], [nom_fr, nom_jp]);
        if (doublons.length > 0) {
            return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
        }

        const [result] = await db.query(
            `INSERT INTO monstres (nom_fr, nom_jp, episode_id, description, type_monstre, taille, puissance)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nom_fr, nom_jp || null, episode_id || null, description || null, type_monstre || null, taille || null, puissance || null]
        );

        const [newMonstre] = await db.query(
            `SELECT m.*, e.titre_fr as episode_titre_fr
             FROM monstres m
             LEFT JOIN episodes e ON m.episode_id = e.id
             WHERE m.id = ?`,
            [result.insertId]
        );
        res.status(201).json({ success: true, message: "Monstre créé", data: newMonstre[0] });
    } catch (error) {
        console.error('❌ Erreur POST /monstres:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PATCH – Mise à jour partielle
router.patch('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const updates = nettoyerDonnees(req.body, ['nom_fr', 'nom_jp', 'episode_id', 'description', 'type_monstre', 'taille', 'puissance']);

        const [existing] = await db.query('SELECT * FROM monstres WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Monstre non trouvé" });
        }

        if (updates.episode_id) {
            await validerIdExistant(db, 'episodes', updates.episode_id, 'Épisode');
        }

        if (updates.nom_fr || updates.nom_jp) {
            const doublons = await verifierDoublonsGenerique(
                db,
                'monstres',
                updates.nom_fr ? ['nom_fr'] : updates.nom_jp ? ['nom_jp'] : [],
                updates.nom_fr ? [updates.nom_fr] : updates.nom_jp ? [updates.nom_jp] : [],
                id
            );
            if (doublons.length > 0) {
                return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
            }
        }

        const fieldsToUpdate = [];
        const values = [];
        Object.keys(updates).forEach(field => {
            fieldsToUpdate.push(`${field} = ?`);
            values.push(updates[field]);
        });
        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ success: false, error: "Aucun champ valide" });
        }
        values.push(id);

        await db.query(`UPDATE monstres SET ${fieldsToUpdate.join(', ')} WHERE id = ?`, values);

        const [updated] = await db.query(
            `SELECT m.*, e.titre_fr as episode_titre_fr
             FROM monstres m
             LEFT JOIN episodes e ON m.episode_id = e.id
             WHERE m.id = ?`,
            [id]
        );
        res.json({ success: true, message: "Monstre mis à jour", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PATCH /monstres:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT – Remplacement complet
router.put('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { nom_fr, nom_jp, episode_id, description, type_monstre, taille, puissance } = req.body;

        const [existing] = await db.query('SELECT * FROM monstres WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Monstre non trouvé" });
        }

        validerChampsRequis(req.body, ['nom_fr']);
        if (episode_id) {
            await validerIdExistant(db, 'episodes', episode_id, 'Épisode');
        }

        const doublons = await verifierDoublonsGenerique(db, 'monstres', ['nom_fr', 'nom_jp'], [nom_fr, nom_jp], id);
        if (doublons.length > 0) {
            return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
        }

        await db.query(
            `UPDATE monstres 
             SET nom_fr = ?, nom_jp = ?, episode_id = ?, description = ?, type_monstre = ?, taille = ?, puissance = ?
             WHERE id = ?`,
            [nom_fr, nom_jp || null, episode_id || null, description || null, type_monstre || null, taille || null, puissance || null, id]
        );

        const [updated] = await db.query(
            `SELECT m.*, e.titre_fr as episode_titre_fr
             FROM monstres m
             LEFT JOIN episodes e ON m.episode_id = e.id
             WHERE m.id = ?`,
            [id]
        );
        res.json({ success: true, message: "Monstre remplacé", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PUT /monstres:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM monstres WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Monstre non trouvé" });
        }
        await db.query('DELETE FROM monstres WHERE id = ?', [id]);
        res.json({ success: true, message: "Monstre supprimé" });
    } catch (error) {
        console.error('❌ Erreur DELETE /monstres:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Export CSV
router.get('/export/csv', async (req, res) => {
    try {
        const db = req.db;
        const [rows] = await db.query(
            `SELECT m.id, m.nom_fr, m.nom_jp, m.type_monstre, m.taille, m.puissance, m.description, e.titre_fr as episode_titre
             FROM monstres m
             LEFT JOIN episodes e ON m.episode_id = e.id
             ORDER BY m.nom_fr`
        );
        let csv = 'id,nom_fr,nom_jp,type,taille,puissance,episode,description\n';
        rows.forEach(row => {
            csv += `${row.id},${row.nom_fr || ''},${row.nom_jp || ''},${row.type_monstre || ''},${row.taille || ''},${row.puissance || ''},${row.episode_titre || ''},${(row.description || '').replace(/,/g, ';')}\n`;
        });
        res.header('Content-Type', 'text/csv');
        res.attachment('monstres.csv');
        res.send(csv);
    } catch (error) {
        console.error('❌ Erreur export CSV monstres:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;