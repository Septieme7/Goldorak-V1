import express from 'express';
import {
    validerChampsRequis,
    verifierDoublonsGenerique,
    validerIdExistant,
    validerEnum,
    nettoyerDonnees
} from '../middlewares/validation.js';

const router = express.Router();
const valeursFrequence = ['Très Fréquente', 'Fréquente', 'Occasionnelle', 'Assez Rare', 'Rare', 'Très Rare'];

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
            // Préfixer les colonnes : a. pour armes, r. pour robots
            whereClause = 'WHERE a.nom_fr LIKE ? OR a.nom_jp LIKE ? OR r.nom_fr LIKE ?';
            params = [searchPattern, searchPattern, searchPattern];
            countWhere = 'WHERE a.nom_fr LIKE ? OR a.nom_jp LIKE ? OR r.nom_fr LIKE ?';
            countParams = [searchPattern, searchPattern, searchPattern];
        }

        const [rows] = await db.query(
            `SELECT a.*, r.nom_fr as robot_nom_fr, r.nom_jp as robot_nom_jp
             FROM armes a
             LEFT JOIN robots r ON a.robot_id = r.id
             ${whereClause}
             ORDER BY a.nom_fr ASC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [countResult] = await db.query(
            `SELECT COUNT(DISTINCT a.id) as total 
             FROM armes a
             LEFT JOIN robots r ON a.robot_id = r.id
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
        console.error('❌ Erreur GET /armes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Par ID
router.get('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [arme] = await db.query(
            `SELECT a.*, r.nom_fr as robot_nom_fr, r.nom_jp as robot_nom_jp
             FROM armes a
             LEFT JOIN robots r ON a.robot_id = r.id
             WHERE a.id = ?`,
            [id]
        );
        if (arme.length === 0) {
            return res.status(404).json({ success: false, error: "Arme non trouvée" });
        }
        res.json({ success: true, data: arme[0] });
    } catch (error) {
        console.error('❌ Erreur GET /armes/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST – Créer
router.post('/', async (req, res) => {
    try {
        const db = req.db;
        const { nom_fr, nom_jp, robot_id, puissance, frequence_utilisation, description } = req.body;
        validerChampsRequis(req.body, ['nom_fr']);

        if (robot_id) {
            await validerIdExistant(db, 'robots', robot_id, 'Robot');
        }
        const frequenceValide = validerEnum(frequence_utilisation, valeursFrequence, 'frequence_utilisation');

        const doublons = await verifierDoublonsGenerique(db, 'armes', ['nom_fr', 'nom_jp'], [nom_fr, nom_jp]);
        if (doublons.length > 0) {
            return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
        }

        const [result] = await db.query(
            `INSERT INTO armes (nom_fr, nom_jp, robot_id, puissance, frequence_utilisation, description)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nom_fr, nom_jp || null, robot_id || null, puissance || null, frequenceValide, description || null]
        );

        const [newArme] = await db.query(
            `SELECT a.*, r.nom_fr as robot_nom_fr
             FROM armes a
             LEFT JOIN robots r ON a.robot_id = r.id
             WHERE a.id = ?`,
            [result.insertId]
        );
        res.status(201).json({ success: true, message: "Arme créée", data: newArme[0] });
    } catch (error) {
        console.error('❌ Erreur POST /armes:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PATCH – Mise à jour partielle
router.patch('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const updates = nettoyerDonnees(req.body, ['nom_fr', 'nom_jp', 'robot_id', 'puissance', 'frequence_utilisation', 'description']);

        const [existing] = await db.query('SELECT * FROM armes WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Arme non trouvée" });
        }

        if (updates.robot_id) {
            await validerIdExistant(db, 'robots', updates.robot_id, 'Robot');
        }
        if (updates.frequence_utilisation) {
            updates.frequence_utilisation = validerEnum(updates.frequence_utilisation, valeursFrequence, 'frequence_utilisation');
        }

        if (updates.nom_fr || updates.nom_jp) {
            const doublons = await verifierDoublonsGenerique(
                db,
                'armes',
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

        await db.query(`UPDATE armes SET ${fieldsToUpdate.join(', ')} WHERE id = ?`, values);

        const [updated] = await db.query(
            `SELECT a.*, r.nom_fr as robot_nom_fr
             FROM armes a
             LEFT JOIN robots r ON a.robot_id = r.id
             WHERE a.id = ?`,
            [id]
        );
        res.json({ success: true, message: "Arme mise à jour", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PATCH /armes:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT – Remplacement complet
router.put('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { nom_fr, nom_jp, robot_id, puissance, frequence_utilisation, description } = req.body;

        const [existing] = await db.query('SELECT * FROM armes WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Arme non trouvée" });
        }

        validerChampsRequis(req.body, ['nom_fr']);
        if (robot_id) {
            await validerIdExistant(db, 'robots', robot_id, 'Robot');
        }
        const frequenceValide = validerEnum(frequence_utilisation, valeursFrequence, 'frequence_utilisation');

        const doublons = await verifierDoublonsGenerique(db, 'armes', ['nom_fr', 'nom_jp'], [nom_fr, nom_jp], id);
        if (doublons.length > 0) {
            return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
        }

        await db.query(
            `UPDATE armes 
             SET nom_fr = ?, nom_jp = ?, robot_id = ?, puissance = ?, frequence_utilisation = ?, description = ?
             WHERE id = ?`,
            [nom_fr, nom_jp || null, robot_id || null, puissance || null, frequenceValide, description || null, id]
        );

        const [updated] = await db.query(
            `SELECT a.*, r.nom_fr as robot_nom_fr
             FROM armes a
             LEFT JOIN robots r ON a.robot_id = r.id
             WHERE a.id = ?`,
            [id]
        );
        res.json({ success: true, message: "Arme remplacée", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PUT /armes:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM armes WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Arme non trouvée" });
        }
        await db.query('DELETE FROM armes WHERE id = ?', [id]);
        res.json({ success: true, message: "Arme supprimée" });
    } catch (error) {
        console.error('❌ Erreur DELETE /armes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Export CSV
router.get('/export/csv', async (req, res) => {
    try {
        const db = req.db;
        const [rows] = await db.query(
            `SELECT a.id, a.nom_fr, a.nom_jp, a.puissance, a.frequence_utilisation, a.description, r.nom_fr as robot_nom
             FROM armes a
             LEFT JOIN robots r ON a.robot_id = r.id
             ORDER BY a.nom_fr`
        );
        let csv = 'id,nom_fr,nom_jp,puissance,frequence,robot,description\n';
        rows.forEach(row => {
            csv += `${row.id},${row.nom_fr || ''},${row.nom_jp || ''},${row.puissance || ''},${row.frequence_utilisation || ''},${row.robot_nom || ''},${(row.description || '').replace(/,/g, ';')}\n`;
        });
        res.header('Content-Type', 'text/csv');
        res.attachment('armes.csv');
        res.send(csv);
    } catch (error) {
        console.error('❌ Erreur export CSV armes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;