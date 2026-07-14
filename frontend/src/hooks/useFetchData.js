// frontend/src/hooks/useFetchData.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

const ENDPOINT_CONFIG = {
    personnages: {
        fetch: api.getPersonnages,
        create: api.createPersonnage,
        update: api.updatePersonnage,
        delete: api.deletePersonnage,
        defaultData: {
            nom_fr: '',
            nom_jp: '',
            faction: null,
            role: null,
            age: null,
            description: '',
            planete_origine: null
        }
    },
    robots: {
        fetch: api.getRobots,
        create: api.createRobot,
        update: api.updateRobot,
        delete: api.deleteRobot,
        defaultData: {
            nom_fr: '',
            nom_jp: '',
            pilote_id: null,
            type_robot: null,
            hauteur: null,
            poids: null,
            description: ''
        }
    },
    vaisseaux: {
        fetch: api.getVaisseaux,
        create: api.createVaisseau,
        update: api.updateVaisseau,
        delete: api.deleteVaisseau,
        defaultData: {
            nom_fr: '',
            nom_jp: '',
            type_vaisseau: null,
            pilote_id: null,
            faction: null,
            description: ''
        }
    },
    episodes: {
        fetch: api.getEpisodes,
        create: api.createEpisode,
        update: api.updateEpisode,
        delete: api.deleteEpisode,
        defaultData: {
            titre_fr: '',
            titre_jp: '',
            numero_fr: null,
            numero_jp: null,
            diffuse_jp: '',
            diffuse_fr: '',
            resume: '',
            description: ''
        }
    },
    armes: {
        fetch: api.getArmes,
        create: api.createArme,
        update: api.updateArme,
        delete: api.deleteArme,
        defaultData: {
            nom_fr: '',
            nom_jp: '',
            robot_id: null,
            puissance: '',
            frequence_utilisation: null,
            description: ''
        }
    },
    monstres: {
        fetch: api.getMonstres,
        create: api.createMonstre,
        update: api.updateMonstre,
        delete: api.deleteMonstre,
        defaultData: {
            nom_fr: '',
            nom_jp: '',
            episode_id: null,
            description: '',
            type_monstre: null,
            taille: null,
            puissance: ''
        }
    }
};

export function useFetchData(endpoint, initialLimit = 100) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(initialLimit);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const config = ENDPOINT_CONFIG[endpoint];

    // Calcul du nombre total de pages
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const fetchData = useCallback(async () => {
        if (!config) {
            setError(`Endpoint inconnu: ${endpoint}`);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: page,
                limit: limit,
                search: searchTerm
            }).toString();

            const result = await config.fetch(params);
            console.log(`📦 Données reçues pour ${endpoint}:`, result);

            // Le résultat peut être un tableau (si handleResponse a extrait data) ou un objet avec data et pagination
            if (Array.isArray(result)) {
                setData(result);
                setTotal(result.length);
            } else if (result && result.data) {
                setData(result.data);
                if (result.pagination) {
                    setTotal(result.pagination.total);
                    setPage(result.pagination.page);
                    setLimit(result.pagination.limit);
                    console.log(`📊 Pagination : page ${result.pagination.page}/${result.pagination.totalPages}, total ${result.pagination.total}`);
                } else {
                    setTotal(result.data.length);
                }
            } else {
                setData(result || []);
                setTotal(0);
            }
        } catch (err) {
            setError(err.message);
            console.error(`❌ Erreur fetch ${endpoint}:`, err);
        } finally {
            setLoading(false);
        }
    }, [endpoint, config, page, limit, searchTerm]);

    // Déclencher le fetch à chaque changement de page, limite ou recherche
    useEffect(() => {
        fetchData();
    }, [fetchData]); // fetchData change quand page, limit ou searchTerm changent

    const handleView = (item) => {
        setSelectedItem(item);
        setModalType('view');
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setModalType('edit');
        setShowModal(true);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) return;
        try {
            await config.delete(id);
            await fetchData();
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleCreate = () => {
        const defaultItem = config?.defaultData || {};
        setSelectedItem(defaultItem);
        setModalType('create');
        setShowModal(true);
    };

    const handleSave = async (itemData) => {
        try {
            const cleanedData = { ...itemData };
            Object.keys(cleanedData).forEach(key => {
                if (cleanedData[key] === '' || cleanedData[key] === undefined) cleanedData[key] = null;
                if (typeof cleanedData[key] === 'string' && !isNaN(cleanedData[key]) && cleanedData[key] !== '') {
                    if (['age', 'numero', 'taille', 'poids'].some(f => key.includes(f))) {
                        cleanedData[key] = parseFloat(cleanedData[key]);
                    }
                }
            });

            if (modalType === 'create') {
                await config.create(cleanedData);
            } else {
                await config.update(cleanedData.id, cleanedData);
            }
            setShowModal(false);
            setPage(1);
            await fetchData();
        } catch (err) {
            alert(`Erreur: ${err.message}`);
        }
    };

    const goToPage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            console.log(`➡️ Aller à la page ${newPage}`);
            setPage(newPage);
        } else {
            console.warn(`⚠️ Page ${newPage} invalide (totalPages = ${totalPages})`);
        }
    };

    const setSearch = (term) => {
        setSearchTerm(term);
        setPage(1);
    };

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        handleView,
        handleEdit,
        handleDelete,
        handleCreate,
        handleSave,
        selectedItem,
        modalType,
        showModal,
        setShowModal,
        closeModal: () => setShowModal(false),
        page,
        limit,
        total,
        totalPages,
        goToPage,
        searchTerm,
        setSearch,
        setLimit
    };
}

// Hooks stats et api status (inchangés)
export function useFetchStats() {
    const [stats, setStats] = useState({
        personnages: 0,
        robots: 0,
        armes: 0,
        episodes: 0,
        monstres: 0,
        vaisseaux: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await api.getStats();
            if (result && result.data) {
                setStats(result.data);
            } else {
                setStats(result || {});
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}

export function useApiStatus() {
    const [status, setStatus] = useState('unknown');
    const [loading, setLoading] = useState(true);

    const checkApiStatus = useCallback(async () => {
        setLoading(true);
        try {
            await api.getHealth();
            setStatus('online');
        } catch {
            setStatus('offline');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkApiStatus();
        const interval = setInterval(checkApiStatus, 30000);
        return () => clearInterval(interval);
    }, [checkApiStatus]);

    return { status, loading, checkApiStatus };
}