import express from 'express';
import {
    validerChampsRequis,
    verifierDoublonsGenerique,
    validerIdExistant,
    validerEnum,
    nettoyerDonnees
} from '../middlewares/validation.js';

const router = express.Router();
const typesVaisseaux = [
    'Vaisseau-mère', 'Croiseur de combat', 'Vaisseau de combat',
    'Char d\'assaut', 'Submersible', 'Vaisseau de reconnaissance',
    'Vaisseau de recherche', 'Vaisseau expérimental'
];

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
            whereClause = 'WHERE v.nom_fr LIKE ? OR v.nom_jp LIKE ? OR p.nom_fr LIKE ?';
            params = [searchPattern, searchPattern, searchPattern];
            countWhere = 'WHERE v.nom_fr LIKE ? OR v.nom_jp LIKE ? OR p.nom_fr LIKE ?';
            countParams = [searchPattern, searchPattern, searchPattern];
        }

        const [rows] = await db.query(
            `SELECT v.*, p.nom_fr as pilote_nom_fr, p.nom_jp as pilote_nom_jp
             FROM vaisseaux v
             LEFT JOIN personnages p ON v.pilote_id = p.id
             ${whereClause}
             ORDER BY v.nom_fr ASC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [countResult] = await db.query(
            `SELECT COUNT(DISTINCT v.id) as total 
             FROM vaisseaux v
             LEFT JOIN personnages p ON v.pilote_id = p.id
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
        console.error('❌ Erreur GET /vaisseaux:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Par ID
router.get('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [vaisseau] = await db.query(
            `SELECT v.*, p.nom_fr as pilote_nom_fr, p.nom_jp as pilote_nom_jp
             FROM vaisseaux v
             LEFT JOIN personnages p ON v.pilote_id = p.id
             WHERE v.id = ?`,
            [id]
        );
        if (vaisseau.length === 0) {
            return res.status(404).json({ success: false, error: "Vaisseau non trouvé" });
        }
        res.json({ success: true, data: vaisseau[0] });
    } catch (error) {
        console.error('❌ Erreur GET /vaisseaux/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST – Créer
router.post('/', async (req, res) => {
    try {
        const db = req.db;
        const { nom_fr, nom_jp, type_vaisseau, pilote_id, faction, description } = req.body;
        validerChampsRequis(req.body, ['nom_fr']);

        const typeValide = validerEnum(type_vaisseau, typesVaisseaux, 'type_vaisseau');
        if (pilote_id) {
            await validerIdExistant(db, 'personnages', pilote_id, 'Personnage');
        }

        const doublons = await verifierDoublonsGenerique(db, 'vaisseaux', ['nom_fr', 'nom_jp'], [nom_fr, nom_jp]);
        if (doublons.length > 0) {
            return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
        }

        const [result] = await db.query(
            `INSERT INTO vaisseaux (nom_fr, nom_jp, type_vaisseau, pilote_id, faction, description)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nom_fr, nom_jp || null, typeValide, pilote_id || null, faction || null, description || null]
        );

        const [newVaisseau] = await db.query(
            `SELECT v.*, p.nom_fr as pilote_nom_fr
             FROM vaisseaux v
             LEFT JOIN personnages p ON v.pilote_id = p.id
             WHERE v.id = ?`,
            [result.insertId]
        );
        res.status(201).json({ success: true, message: "Vaisseau créé", data: newVaisseau[0] });
    } catch (error) {
        console.error('❌ Erreur POST /vaisseaux:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PATCH – Mise à jour partielle
router.patch('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const updates = nettoyerDonnees(req.body, ['nom_fr', 'nom_jp', 'type_vaisseau', 'pilote_id', 'faction', 'description']);

        const [existing] = await db.query('SELECT * FROM vaisseaux WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Vaisseau non trouvé" });
        }

        if (updates.type_vaisseau) {
            updates.type_vaisseau = validerEnum(updates.type_vaisseau, typesVaisseaux, 'type_vaisseau');
        }
        if (updates.pilote_id) {
            await validerIdExistant(db, 'personnages', updates.pilote_id, 'Personnage');
        }

        if (updates.nom_fr || updates.nom_jp) {
            const doublons = await verifierDoublonsGenerique(
                db,
                'vaisseaux',
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

        await db.query(`UPDATE vaisseaux SET ${fieldsToUpdate.join(', ')} WHERE id = ?`, values);

        const [updated] = await db.query(
            `SELECT v.*, p.nom_fr as pilote_nom_fr
             FROM vaisseaux v
             LEFT JOIN personnages p ON v.pilote_id = p.id
             WHERE v.id = ?`,
            [id]
        );
        res.json({ success: true, message: "Vaisseau mis à jour", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PATCH /vaisseaux:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT – Remplacement complet
router.put('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { nom_fr, nom_jp, type_vaisseau, pilote_id, faction, description } = req.body;

        const [existing] = await db.query('SELECT * FROM vaisseaux WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Vaisseau non trouvé" });
        }

        validerChampsRequis(req.body, ['nom_fr']);
        const typeValide = validerEnum(type_vaisseau, typesVaisseaux, 'type_vaisseau');
        if (pilote_id) {
            await validerIdExistant(db, 'personnages', pilote_id, 'Personnage');
        }

        const doublons = await verifierDoublonsGenerique(db, 'vaisseaux', ['nom_fr', 'nom_jp'], [nom_fr, nom_jp], id);
        if (doublons.length > 0) {
            return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
        }

        await db.query(
            `UPDATE vaisseaux 
             SET nom_fr = ?, nom_jp = ?, type_vaisseau = ?, pilote_id = ?, faction = ?, description = ?
             WHERE id = ?`,
            [nom_fr, nom_jp || null, typeValide, pilote_id || null, faction || null, description || null, id]
        );

        const [updated] = await db.query(
            `SELECT v.*, p.nom_fr as pilote_nom_fr
             FROM vaisseaux v
             LEFT JOIN personnages p ON v.pilote_id = p.id
             WHERE v.id = ?`,
            [id]
        );
        res.json({ success: true, message: "Vaisseau remplacé", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PUT /vaisseaux:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM vaisseaux WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Vaisseau non trouvé" });
        }
        await db.query('DELETE FROM vaisseaux WHERE id = ?', [id]);
        res.json({ success: true, message: "Vaisseau supprimé" });
    } catch (error) {
        console.error('❌ Erreur DELETE /vaisseaux:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Export CSV
router.get('/export/csv', async (req, res) => {
    try {
        const db = req.db;
        const [rows] = await db.query(
            `SELECT v.id, v.nom_fr, v.nom_jp, v.type_vaisseau, v.faction, v.description, p.nom_fr as pilote_nom
             FROM vaisseaux v
             LEFT JOIN personnages p ON v.pilote_id = p.id
             ORDER BY v.nom_fr`
        );
        let csv = 'id,nom_fr,nom_jp,type,faction,pilote,description\n';
        rows.forEach(row => {
            csv += `${row.id},${row.nom_fr || ''},${row.nom_jp || ''},${row.type_vaisseau || ''},${row.faction || ''},${row.pilote_nom || ''},${(row.description || '').replace(/,/g, ';')}\n`;
        });
        res.header('Content-Type', 'text/csv');
        res.attachment('vaisseaux.csv');
        res.send(csv);
    } catch (error) {
        console.error('❌ Erreur export CSV vaisseaux:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;