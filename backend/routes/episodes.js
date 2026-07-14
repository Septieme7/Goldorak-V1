import express from 'express';
import {
    validerChampsRequis,
    verifierDoublonsGenerique,
    validerDate,
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
        if (search && search.length > 0) {
            const searchPattern = `%${search}%`;
            // Pas de jointure, donc pas d'ambiguïté
            whereClause = 'WHERE titre_fr LIKE ? OR titre_jp LIKE ? OR resume LIKE ?';
            params = [searchPattern, searchPattern, searchPattern];
        }

        const [rows] = await db.query(
            `SELECT * FROM episodes
             ${whereClause}
             ORDER BY numero_jp ASC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM episodes ${whereClause}`,
            params
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
        console.error('❌ Erreur GET /episodes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Par ID
router.get('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [episode] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
        if (episode.length === 0) {
            return res.status(404).json({ success: false, error: "Épisode non trouvé" });
        }
        res.json({ success: true, data: episode[0] });
    } catch (error) {
        console.error('❌ Erreur GET /episodes/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST – Créer
router.post('/', async (req, res) => {
    try {
        const db = req.db;
        const { numero_jp, numero_fr, titre_fr, titre_jp, diffuse_jp, diffuse_fr, resume } = req.body;
        validerChampsRequis(req.body, ['numero_jp', 'titre_fr']);

        const dateDiffuseJp = validerDate(diffuse_jp);
        const dateDiffuseFr = validerDate(diffuse_fr);

        const doublons = await verifierDoublonsGenerique(db, 'episodes', ['numero_jp', 'numero_fr'], [numero_jp, numero_fr]);
        if (doublons.length > 0) {
            return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
        }

        const [result] = await db.query(
            `INSERT INTO episodes (numero_jp, numero_fr, titre_fr, titre_jp, diffuse_jp, diffuse_fr, resume)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [numero_jp, numero_fr || null, titre_fr, titre_jp || null, dateDiffuseJp, dateDiffuseFr, resume || null]
        );

        const [newEpisode] = await db.query('SELECT * FROM episodes WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, message: "Épisode créé", data: newEpisode[0] });
    } catch (error) {
        console.error('❌ Erreur POST /episodes:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PATCH – Mise à jour partielle
router.patch('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const updates = nettoyerDonnees(req.body, ['numero_jp', 'numero_fr', 'titre_fr', 'titre_jp', 'diffuse_jp', 'diffuse_fr', 'resume']);

        const [existing] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Épisode non trouvé" });
        }

        if (updates.diffuse_jp) updates.diffuse_jp = validerDate(updates.diffuse_jp);
        if (updates.diffuse_fr) updates.diffuse_fr = validerDate(updates.diffuse_fr);

        if (updates.numero_jp || updates.numero_fr) {
            const doublons = await verifierDoublonsGenerique(
                db,
                'episodes',
                updates.numero_jp ? ['numero_jp'] : updates.numero_fr ? ['numero_fr'] : [],
                updates.numero_jp ? [updates.numero_jp] : updates.numero_fr ? [updates.numero_fr] : [],
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

        await db.query(`UPDATE episodes SET ${fieldsToUpdate.join(', ')} WHERE id = ?`, values);

        const [updated] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
        res.json({ success: true, message: "Épisode mis à jour", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PATCH /episodes:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT – Remplacement complet
router.put('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { numero_jp, numero_fr, titre_fr, titre_jp, diffuse_jp, diffuse_fr, resume } = req.body;

        const [existing] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Épisode non trouvé" });
        }

        validerChampsRequis(req.body, ['numero_jp', 'titre_fr']);
        const dateDiffuseJp = validerDate(diffuse_jp);
        const dateDiffuseFr = validerDate(diffuse_fr);

        const doublons = await verifierDoublonsGenerique(db, 'episodes', ['numero_jp', 'numero_fr'], [numero_jp, numero_fr], id);
        if (doublons.length > 0) {
            return res.status(409).json({ success: false, error: "Doublon détecté", details: doublons });
        }

        await db.query(
            `UPDATE episodes 
             SET numero_jp = ?, numero_fr = ?, titre_fr = ?, titre_jp = ?, diffuse_jp = ?, diffuse_fr = ?, resume = ?
             WHERE id = ?`,
            [numero_jp, numero_fr || null, titre_fr, titre_jp || null, dateDiffuseJp, dateDiffuseFr, resume || null, id]
        );

        const [updated] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
        res.json({ success: true, message: "Épisode remplacé", data: updated[0] });
    } catch (error) {
        console.error('❌ Erreur PUT /episodes:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: "Épisode non trouvé" });
        }

        const [monstres] = await db.query('SELECT id FROM monstres WHERE episode_id = ?', [id]);
        if (monstres.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Impossible de supprimer cet épisode (${monstres.length} monstre(s) lié(s))`
            });
        }

        await db.query('DELETE FROM episodes WHERE id = ?', [id]);
        res.json({ success: true, message: "Épisode supprimé" });
    } catch (error) {
        console.error('❌ Erreur DELETE /episodes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET – Export CSV
router.get('/export/csv', async (req, res) => {
    try {
        const db = req.db;
        const [rows] = await db.query('SELECT * FROM episodes ORDER BY numero_jp');
        let csv = 'id,numero_jp,numero_fr,titre_fr,titre_jp,diffuse_jp,diffuse_fr,resume\n';
        rows.forEach(row => {
            csv += `${row.id},${row.numero_jp || ''},${row.numero_fr || ''},${row.titre_fr || ''},${row.titre_jp || ''},${row.diffuse_jp || ''},${row.diffuse_fr || ''},${(row.resume || '').replace(/,/g, ';')}\n`;
        });
        res.header('Content-Type', 'text/csv');
        res.attachment('episodes.csv');
        res.send(csv);
    } catch (error) {
        console.error('❌ Erreur export CSV episodes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;