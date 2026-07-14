// hooks/useReferenceData.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export const useReferenceData = () => {
    const [references, setReferences] = useState({
        personnages: [],
        robots: [],
        episodes: [],
        vaisseaux: [],
        loading: true,
        error: null
    });

    const fetchReferences = useCallback(async () => {
        setReferences(prev => ({ ...prev, loading: true, error: null }));
        try {
            const [personnages, robots, episodes, vaisseaux] = await Promise.all([
                api.getPersonnages({ limit: 1000 }).catch(() => []),
                api.getRobots({ limit: 1000 }).catch(() => []),
                api.getEpisodes({ limit: 1000 }).catch(() => []),
                api.getVaisseaux({ limit: 1000 }).catch(() => [])
            ]);

            // Fonction pour extraire les données (gère tableau direct ou objet avec data)
            const extractData = (result) => {
                if (Array.isArray(result)) return result;
                if (result && result.data && Array.isArray(result.data)) return result.data;
                return [];
            };

            const personnagesData = extractData(personnages);
            const robotsData = extractData(robots);
            const episodesData = extractData(episodes);
            const vaisseauxData = extractData(vaisseaux);

            console.log('✅ Références chargées:', {
                personnages: personnagesData.length,
                robots: robotsData.length,
                episodes: episodesData.length,
                vaisseaux: vaisseauxData.length
            });

            setReferences({
                personnages: personnagesData,
                robots: robotsData,
                episodes: episodesData,
                vaisseaux: vaisseauxData,
                loading: false,
                error: null
            });
        } catch (err) {
            console.error('❌ Erreur chargement références:', err);
            setReferences({
                personnages: [],
                robots: [],
                episodes: [],
                vaisseaux: [],
                loading: false,
                error: err.message
            });
        }
    }, []);

    useEffect(() => {
        fetchReferences();
    }, [fetchReferences]);

    return { ...references, refetch: fetchReferences };
};