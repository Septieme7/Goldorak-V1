// frontend/src/hooks/useFormFields.js
import { useMemo } from 'react';

export const useFormFields = (endpoint) => {
    const fieldConfigs = useMemo(() => {
        const configs = {
            personnages: [
                { name: 'nom_fr', label: 'Nom Français', type: 'text', required: true },
                { name: 'nom_jp', label: 'Nom Japonais', type: 'text' },
                {
                    name: 'faction',
                    label: 'Faction',
                    type: 'select',
                    options: ['Terre', 'Véga', 'Neutre'],
                    allowNone: true
                },
                {
                    name: 'role',
                    label: 'Rôle',
                    type: 'select',
                    options: ['Héros', 'Allié', 'Antagoniste', 'Scientifique', 'Pilote', 'Mécanicien', 'Commandant', 'Autre'],
                    allowNone: true
                },
                {
                    name: 'planete_origine',
                    label: 'Planète d\'origine',
                    type: 'select',
                    options: ['Euphor', 'Terre', 'Véga', 'Fleed', 'Rigel', 'Floga', 'Inconnue'],
                    allowNone: true
                },
                { name: 'age', label: 'Âge', type: 'number', min: 0 },
                { name: 'description', label: 'Description', type: 'textarea' }
            ],
            robots: [
                { name: 'nom_fr', label: 'Nom Français', type: 'text', required: true },
                { name: 'nom_jp', label: 'Nom Japonais', type: 'text' },
                {
                    name: 'pilote_id',
                    label: 'Pilote',
                    type: 'select',
                    reference: 'personnages',
                    displayField: 'nom_fr',
                    valueField: 'id',
                    allowNone: true
                },
                {
                    name: 'type_robot',
                    label: 'Type de Robot',
                    type: 'select',
                    options: [
                        'Robot de combat',
                        'Robot transformable',
                        'Robot de transport',
                        'Robot de reconnaissance',
                        'Robot de sauvetage'
                    ],
                    allowNone: true
                },
                { name: 'hauteur', label: 'Hauteur (m)', type: 'number', step: 0.1 },
                { name: 'poids', label: 'Poids (t)', type: 'number', step: 0.1 },
                { name: 'description', label: 'Description', type: 'textarea' }
            ],
            vaisseaux: [
                { name: 'nom_fr', label: 'Nom Français', type: 'text', required: true },
                { name: 'nom_jp', label: 'Nom Japonais', type: 'text' },
                {
                    name: 'type_vaisseau',
                    label: 'Type de Vaisseau',
                    type: 'select',
                    options: [
                        'Vaisseau-mère',
                        'Croiseur de combat',
                        'Vaisseau de combat',
                        'Char d\'assaut',
                        'Submersible',
                        'Vaisseau de reconnaissance',
                        'Vaisseau de recherche',
                        'Vaisseau expérimental'
                    ],
                    allowNone: true
                },
                {
                    name: 'pilote_id',
                    label: 'Pilote',
                    type: 'select',
                    reference: 'personnages',
                    displayField: 'nom_fr',
                    valueField: 'id',
                    allowNone: true
                },
                {
                    name: 'faction',
                    label: 'Faction',
                    type: 'select',
                    options: ['Terre', 'Véga', 'Neutre'],
                    allowNone: true
                },
                { name: 'description', label: 'Description', type: 'textarea' }
            ],
            episodes: [
                { name: 'titre_fr', label: 'Titre Français', type: 'text', required: true },
                { name: 'titre_jp', label: 'Titre Japonais', type: 'text' },
                { name: 'numero_fr', label: 'Numéro FR', type: 'number', min: 1 },
                { name: 'numero_jp', label: 'Numéro JP', type: 'number', min: 1 },
                { name: 'diffuse_jp', label: 'Diffusion JP', type: 'date' },
                { name: 'diffuse_fr', label: 'Diffusion FR', type: 'date' },
                { name: 'resume', label: 'Résumé', type: 'textarea' },
                // { name: 'description', label: 'Description', type: 'textarea' }
            ],
            armes: [
                { name: 'nom_fr', label: 'Nom Français', type: 'text', required: true },
                { name: 'nom_jp', label: 'Nom Japonais', type: 'text' },
                {
                    name: 'robot_id',
                    label: 'Robot',
                    type: 'select',
                    reference: 'robots',
                    displayField: 'nom_fr',
                    valueField: 'id',
                    allowNone: true
                },
                { name: 'puissance', label: 'Puissance', type: 'text' },
                {
                    name: 'frequence_utilisation',
                    label: 'Fréquence',
                    type: 'select',
                    options: [
                        'Très Fréquente',
                        'Fréquente',
                        'Occasionnelle',
                        'Assez Rare',
                        'Rare',
                        'Très Rare'
                    ],
                    allowNone: true
                },
                { name: 'description', label: 'Description', type: 'textarea' }
            ],
            monstres: [
                { name: 'nom_fr', label: 'Nom Français', type: 'text', required: true },
                { name: 'nom_jp', label: 'Nom Japonais', type: 'text' },
                {
                    name: 'episode_id',
                    label: 'Épisode',
                    type: 'select',
                    reference: 'episodes',
                    displayField: 'titre_fr',
                    valueField: 'id',
                    allowNone: true
                },
                {
                    name: 'type_monstre',
                    label: 'Type',
                    type: 'select',
                    options: ['Monstre', 'Robot', 'Vaisseau'],
                    allowNone: true
                },
                { name: 'taille', label: 'Taille (m)', type: 'number', step: 0.1 },
                { name: 'puissance', label: 'Puissance', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' }
            ]
        };

        return configs[endpoint] || [];
    }, [endpoint]);

    return fieldConfigs;
};

// Fonction utilitaire pour obtenir les données par défaut (tous les nombres à null)
export const getDefaultData = (endpoint) => {
    const defaultData = {
        personnages: {
            nom_fr: '',
            nom_jp: '',
            faction: null,
            role: null,
            age: null,
            description: '',
            planete_origine: null
        },
        robots: {
            nom_fr: '',
            nom_jp: '',
            pilote_id: null,
            type_robot: null,
            hauteur: null,
            poids: null,
            description: ''
        },
        vaisseaux: {
            nom_fr: '',
            nom_jp: '',
            type_vaisseau: null,
            pilote_id: null,
            faction: null,
            description: ''
        },
        episodes: {
            titre_fr: '',
            titre_jp: '',
            numero_fr: null,
            numero_jp: null,
            diffuse_jp: '',
            diffuse_fr: '',
            resume: '',
            // description: ''
        },
        armes: {
            nom_fr: '',
            nom_jp: '',
            robot_id: null,
            puissance: '',
            frequence_utilisation: null,
            description: ''
        },
        monstres: {
            nom_fr: '',
            nom_jp: '',
            episode_id: null,
            description: '',
            type_monstre: null,
            taille: null,
            puissance: ''
        }
    };

    return defaultData[endpoint] || {};
};