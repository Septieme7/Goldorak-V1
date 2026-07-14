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
            // Préfixer les colonnes avec la table correspondante
            whereClause = 'WHERE r.nom_fr LIKE ? OR r.nom_jp LIKE ? OR p.nom_fr LIKE ?';
            params = [searchPattern, searchPattern, searchPattern];
            countWhere = 'WHERE r.nom_fr LIKE ? OR r.nom_jp LIKE ? OR p.nom_fr LIKE ?';
            countParams = [searchPattern, searchPattern, searchPattern];
        }

        const [rows] = await db.query(
            `SELECT r.*, 
                    p.nom_fr as pilote_nom_fr,
                    p.nom_jp as pilote_nom_jp,
                    COUNT(a.id) as nombre_armes
             FROM robots r
             LEFT JOIN personnages p ON r.pilote_id = p.id
             LEFT JOIN armes a ON r.id = a.robot_id
             ${whereClause}
             GROUP BY r.id
             ORDER BY r.nom_fr ASC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [countResult] = await db.query(
            `SELECT COUNT(DISTINCT r.id) as total 
             FROM robots r
             LEFT JOIN personnages p ON r.pilote_id = p.id
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
        console.error('❌ Erreur GET /robots:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Par ID
router.get('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [robot] = await db.query(
            `SELECT r.*, p.nom_fr as pilote_nom_fr, p.nom_jp as pilote_nom_jp
             FROM robots r
             LEFT JOIN personnages p ON r.pilote_id = p.id
             WHERE r.id = ?`,
            [id]
        );
        if (robot.length === 0) {
            return res.status(404).json({ success: false, error: "Robot non trouvé" });
        }
        const [armes] = await db.query(
            'SELECT id, nom_fr, nom_jp, puissance, frequence_utilisation FROM armes WHERE robot_id = ?',
            [id]
        );
        res.json({ success: true, data: { ...robot[0], armes } });
    } catch (error) {
        console.error('❌ Erreur GET /robots/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST – Créer
router.post('/', async (req, res) => {
    try {
        const db = req.db;
        const { nom_fr, nom_jp, pilote_id, type_robot, hauteur, poids, description } = req.body;
        validerChampsRequis(req.body, ['nom_fr']);

        if (pilote_id) {
            await validerIdExistant(db, 'personnages', pilote_id, 'Personnage');
        }

        const doublons = await verifierDoublonsGenerique(db, 'robots', ['nom_fr', 'nom_jp'], [nom_fr, nom_jp]);
        if (doublons.length > 0) {
            return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
        }

        const [result] = await db.query(
            `INSERT INTO robots (nom_fr, nom_jp, pilote_id, type_robot, hauteur, poids, description)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nom_fr, nom_jp || null, pilote_id || null, type_robot || null, hauteur || null, poids || null, description || null]
        );

        const [newRobot] = await db.query(
            `SELECT r.*, p.nom_fr as pilote_nom_fr
             FROM robots r
             LEFT JOIN personnages p ON r.pilote_id = p.id
             WHERE r.id = ?`,
            [result.insertId]
        );
        res.status(201).json({ success: true, message: "Robot créé", data: newRobot[0] });
    } catch (error) {
        console.error('❌ Erreur POST /robots:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PATCH – Mise à jour partielle
router.patch('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const updates = nettoyerDonnees(req.body, ['nom_fr', 'nom_jp', 'pilote_id', 'type_robot', 'hauteur', 'poids', 'description']);

        const [existing] = await db.query('SELECT * FROM robots WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Robot non trouvé" });
        }

        if (updates.pilote_id) {
            await validerIdExistant(db, 'personnages', updates.pilote_id, 'Personnage');
        }

        if (updates.nom_fr || updates.nom_jp) {
            const doublons = await verifierDoublonsGenerique(
                db,
                'robots',
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

        await db.query(`UPDATE robots SET ${fieldsToUpdate.join(', ')} WHERE id = ?`, values);

        const [updated] = await db.query(
            `SELECT r.*, p.nom_fr as pilote_nom_fr
             FROM robots r
             LEFT JOIN personnages p ON r.pilote_id = p.id
             WHERE r.id = ?`,
            [id]
        );
        res.json({ success: true, message: "Robot mis à jour", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PATCH /robots:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT – Remplacement complet
router.put('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { nom_fr, nom_jp, pilote_id, type_robot, hauteur, poids, description } = req.body;

        const [existing] = await db.query('SELECT * FROM robots WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Robot non trouvé" });
        }

        validerChampsRequis(req.body, ['nom_fr']);
        if (pilote_id) {
            await validerIdExistant(db, 'personnages', pilote_id, 'Personnage');
        }

        const doublons = await verifierDoublonsGenerique(db, 'robots', ['nom_fr', 'nom_jp'], [nom_fr, nom_jp], id);
        if (doublons.length > 0) {
            return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
        }

        await db.query(
            `UPDATE robots 
             SET nom_fr = ?, nom_jp = ?, pilote_id = ?, type_robot = ?, hauteur = ?, poids = ?, description = ?
             WHERE id = ?`,
            [nom_fr, nom_jp || null, pilote_id || null, type_robot || null, hauteur || null, poids || null, description || null, id]
        );

        const [updated] = await db.query(
            `SELECT r.*, p.nom_fr as pilote_nom_fr
             FROM robots r
             LEFT JOIN personnages p ON r.pilote_id = p.id
             WHERE r.id = ?`,
            [id]
        );
        res.json({ success: true, message: "Robot remplacé", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PUT /robots:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM robots WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Robot non trouvé" });
        }

        const [armes] = await db.query('SELECT id FROM armes WHERE robot_id = ?', [id]);
        if (armes.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Impossible de supprimer ce robot (${armes.length} arme(s) associée(s))`
            });
        }

        await db.query('DELETE FROM robots WHERE id = ?', [id]);
        res.json({ success: true, message: "Robot supprimé" });
    } catch (error) {
        console.error('❌ Erreur DELETE /robots:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Export CSV
router.get('/export/csv', async (req, res) => {
    try {
        const db = req.db;
        const [rows] = await db.query(
            `SELECT r.id, r.nom_fr, r.nom_jp, r.type_robot, r.hauteur, r.poids, r.description, p.nom_fr as pilote_nom
             FROM robots r
             LEFT JOIN personnages p ON r.pilote_id = p.id
             ORDER BY r.nom_fr`
        );
        let csv = 'id,nom_fr,nom_jp,type,hauteur,poids,pilote,description\n';
        rows.forEach(row => {
            csv += `${row.id},${row.nom_fr || ''},${row.nom_jp || ''},${row.type_robot || ''},${row.hauteur || ''},${row.poids || ''},${row.pilote_nom || ''},${(row.description || '').replace(/,/g, ';')}\n`;
        });
        res.header('Content-Type', 'text/csv');
        res.attachment('robots.csv');
        res.send(csv);
    } catch (error) {
        console.error('❌ Erreur export CSV robots:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;