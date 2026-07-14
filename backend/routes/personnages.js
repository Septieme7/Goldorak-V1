// backend/routes/personnages.js
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
            whereClause = 'WHERE p.nom_fr LIKE ? OR p.nom_jp LIKE ? OR p.role LIKE ? OR p.planete_origine LIKE ?';
            params = [searchPattern, searchPattern, searchPattern, searchPattern];
            countWhere = 'WHERE p.nom_fr LIKE ? OR p.nom_jp LIKE ? OR p.role LIKE ? OR p.planete_origine LIKE ?';
            countParams = [searchPattern, searchPattern, searchPattern, searchPattern];
        }

        const [rows] = await db.query(
            `SELECT p.*, 
                    COUNT(DISTINCT r.id) as nb_robots,
                    COUNT(DISTINCT v.id) as nb_vaisseaux
             FROM personnages p
             LEFT JOIN robots r ON p.id = r.pilote_id
             LEFT JOIN vaisseaux v ON p.id = v.pilote_id
             ${whereClause}
             GROUP BY p.id
             ORDER BY p.nom_fr ASC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM personnages p ${countWhere}`,
            countParams
        );
        const total = countResult[0].total;

        res.json({
            success: true,
            data: rows,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ Erreur GET /personnages:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Par ID
router.get('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [personnage] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);
        if (personnage.length === 0) {
            return res.status(404).json({ success: false, error: "Personnage non trouvé" });
        }
        const [robots] = await db.query('SELECT id, nom_fr, nom_jp FROM robots WHERE pilote_id = ?', [id]);
        const [vaisseaux] = await db.query('SELECT id, nom_fr, nom_jp, type_vaisseau FROM vaisseaux WHERE pilote_id = ?', [id]);
        res.json({ success: true, data: { ...personnage[0], robots, vaisseaux } });
    } catch (error) {
        console.error('❌ Erreur GET /personnages/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST – Créer
router.post('/', async (req, res) => {
    try {
        const db = req.db;
        const { nom_fr, nom_jp, role, faction, age, description, planete_origine } = req.body;
        validerChampsRequis(req.body, ['nom_fr']);

        const [existing] = await db.query('SELECT id FROM personnages WHERE nom_fr = ?', [nom_fr]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, error: 'Un personnage avec ce nom existe déjà' });
        }

        const [result] = await db.query(
            `INSERT INTO personnages (nom_fr, nom_jp, role, faction, age, description, planete_origine)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nom_fr, nom_jp || null, role || null, faction || null, age || null, description || null, planete_origine || null]
        );

        const [newPersonnage] = await db.query('SELECT * FROM personnages WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, message: "Personnage créé", data: newPersonnage[0] });
    } catch (error) {
        console.error('❌ Erreur POST /personnages:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PATCH – Mise à jour partielle
router.patch('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const updates = nettoyerDonnees(req.body, ['nom_fr', 'nom_jp', 'role', 'faction', 'age', 'description', 'planete_origine']);

        const [existing] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Personnage non trouvé" });
        }

        if (updates.nom_fr || updates.nom_jp) {
            const doublons = await verifierDoublonsGenerique(
                db,
                'personnages',
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

        await db.query(`UPDATE personnages SET ${fieldsToUpdate.join(', ')} WHERE id = ?`, values);

        const [updated] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);
        res.json({ success: true, message: "Personnage mis à jour", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PATCH /personnages:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT – Remplacement complet
router.put('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { nom_fr, nom_jp, role, faction, age, description, planete_origine } = req.body;

        const [existing] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Personnage non trouvé" });
        }

        validerChampsRequis(req.body, ['nom_fr']);

        const doublons = await verifierDoublonsGenerique(
            db,
            'personnages',
            ['nom_fr', 'nom_jp'],
            [nom_fr, nom_jp],
            id
        );
        if (doublons.length > 0) {
            return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
        }

        await db.query(
            `UPDATE personnages 
             SET nom_fr = ?, nom_jp = ?, role = ?, faction = ?, age = ?, description = ?, planete_origine = ?
             WHERE id = ?`,
            [nom_fr, nom_jp || null, role || null, faction || null, age || null, description || null, planete_origine || null, id]
        );

        const [updated] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);
        res.json({ success: true, message: "Personnage remplacé", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PUT /personnages:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM personnages WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Personnage non trouvé" });
        }

        const [robots] = await db.query('SELECT id FROM robots WHERE pilote_id = ?', [id]);
        const [vaisseaux] = await db.query('SELECT id FROM vaisseaux WHERE pilote_id = ?', [id]);

        if (robots.length > 0 || vaisseaux.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Impossible de supprimer ce personnage car il est lié à des robots ou vaisseaux."
            });
        }

        await db.query('DELETE FROM personnages WHERE id = ?', [id]);
        res.json({ success: true, message: "Personnage supprimé" });
    } catch (error) {
        console.error('❌ Erreur DELETE /personnages:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Export CSV
router.get('/export/csv', async (req, res) => {
    try {
        const db = req.db;
        const [rows] = await db.query('SELECT * FROM personnages ORDER BY nom_fr');
        let csv = 'id,nom_fr,nom_jp,faction,role,age,description,planete_origine\n';
        rows.forEach(row => {
            csv += `${row.id},${row.nom_fr || ''},${row.nom_jp || ''},${row.faction || ''},${row.role || ''},${row.age || ''},${(row.description || '').replace(/,/g, ';')},${row.planete_origine || ''}\n`;
        });
        res.header('Content-Type', 'text/csv');
        res.attachment('personnages.csv');
        res.send(csv);
    } catch (error) {
        console.error('❌ Erreur export CSV:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;