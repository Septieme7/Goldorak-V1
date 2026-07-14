// Fonction pour valider les champs requis
function validerChampsRequis(body, champsRequis) {
    const champsManquants = [];

    champsRequis.forEach(champ => {
        if (!body[champ] || body[champ].toString().trim() === '') {
            champsManquants.push(champ);
        }
    });

    if (champsManquants.length > 0) {
        throw new Error(`Les champs suivants sont requis : ${champsManquants.join(', ')}`);
    }
}

// Fonction pour vérifier les doublons générique
async function verifierDoublonsGenerique(db, table, champs, valeurs, idExclu = null) {
    const doublons = [];

    for (let i = 0; i < champs.length; i++) {
        const champ = champs[i];
        const valeur = valeurs[i];

        if (valeur) {
            let query = `SELECT id, ${champ} FROM ${table} WHERE ${champ} = ?`;
            const params = [valeur];

            if (idExclu) {
                query += ' AND id != ?';
                params.push(idExclu);
            }

            const [result] = await db.query(query, params);
            if (result.length > 0) {
                doublons.push(`${champ}: "${valeur}" (ID: ${result[0].id})`);
            }
        }
    }

    return doublons;
}

// Fonction pour valider un ID existant dans une table
async function validerIdExistant(db, table, id, nomTable) {
    const [result] = await db.query(`SELECT id FROM ${table} WHERE id = ?`, [id]);
    if (result.length === 0) {
        throw new Error(`${nomTable} avec ID ${id} n'existe pas`);
    }
    return true;
}

// Fonction pour valider les dates
function validerDate(dateStr) {
    if (!dateStr) return null;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        throw new Error(`Date invalide: ${dateStr}. Format attendu: YYYY-MM-DD`);
    }

    return date.toISOString().split('T')[0]; // Retourne YYYY-MM-DD
}

// Fonction pour valider les énumérations
function validerEnum(valeur, valeursAutorisees, nomChamp) {
    if (valeur && !valeursAutorisees.includes(valeur)) {
        throw new Error(`${nomChamp} doit être l'une de ces valeurs: ${valeursAutorisees.join(', ')}`);
    }
    return valeur || null;
}

// Fonction pour nettoyer les données
function nettoyerDonnees(body, champsAutorises) {
    const donneesNettoyees = {};

    Object.keys(body).forEach(champ => {
        if (champsAutorises.includes(champ)) {
            // Convertir les chaînes vides en null
            if (body[champ] === '') {
                donneesNettoyees[champ] = null;
            } else {
                donneesNettoyees[champ] = body[champ];
            }
        }
    });

    return donneesNettoyees;
}

export {
    validerChampsRequis,
    verifierDoublonsGenerique,
    validerIdExistant,
    validerDate,
    validerEnum,
    nettoyerDonnees
};