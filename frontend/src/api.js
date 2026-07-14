// frontend/src/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800/api/v1';

const getAuthToken = () => localStorage.getItem('auth_token');

const getHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    if (includeAuth) {
        const token = getAuthToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expirée');
    }
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
    }
    const result = await response.json();
    if (result.success !== undefined) {
        if (!result.success) throw new Error(result.error || 'Requête échouée');
        // Si la réponse contient une pagination, retourner l'objet complet
        if (result.pagination) {
            return result; // { success: true, data: [...], pagination: {...} }
        }
        // Sinon, retourner seulement les données
        return result.data;
    }
    return result;
};

const buildUrl = (base, params) => {
    if (!params) return base;
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${base}?${queryString}` : base;
};

export const api = {
    getPersonnages: (params) => fetch(buildUrl(`${API_BASE_URL}/personnages`, params), { headers: getHeaders() }).then(handleResponse),
    getPersonnage: (id) => fetch(`${API_BASE_URL}/personnages/${id}`, { headers: getHeaders() }).then(handleResponse),
    createPersonnage: (data) => fetch(`${API_BASE_URL}/personnages`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updatePersonnage: (id, data) => fetch(`${API_BASE_URL}/personnages/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    deletePersonnage: (id) => fetch(`${API_BASE_URL}/personnages/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),

    getRobots: (params) => fetch(buildUrl(`${API_BASE_URL}/robots`, params), { headers: getHeaders() }).then(handleResponse),
    getRobot: (id) => fetch(`${API_BASE_URL}/robots/${id}`, { headers: getHeaders() }).then(handleResponse),
    createRobot: (data) => fetch(`${API_BASE_URL}/robots`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updateRobot: (id, data) => fetch(`${API_BASE_URL}/robots/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    deleteRobot: (id) => fetch(`${API_BASE_URL}/robots/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),

    getVaisseaux: (params) => fetch(buildUrl(`${API_BASE_URL}/vaisseaux`, params), { headers: getHeaders() }).then(handleResponse),
    getVaisseau: (id) => fetch(`${API_BASE_URL}/vaisseaux/${id}`, { headers: getHeaders() }).then(handleResponse),
    createVaisseau: (data) => fetch(`${API_BASE_URL}/vaisseaux`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updateVaisseau: (id, data) => fetch(`${API_BASE_URL}/vaisseaux/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    deleteVaisseau: (id) => fetch(`${API_BASE_URL}/vaisseaux/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),

    getArmes: (params) => fetch(buildUrl(`${API_BASE_URL}/armes`, params), { headers: getHeaders() }).then(handleResponse),
    getArme: (id) => fetch(`${API_BASE_URL}/armes/${id}`, { headers: getHeaders() }).then(handleResponse),
    createArme: (data) => fetch(`${API_BASE_URL}/armes`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updateArme: (id, data) => fetch(`${API_BASE_URL}/armes/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    deleteArme: (id) => fetch(`${API_BASE_URL}/armes/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),

    getEpisodes: (params) => fetch(buildUrl(`${API_BASE_URL}/episodes`, params), { headers: getHeaders() }).then(handleResponse),
    getEpisode: (id) => fetch(`${API_BASE_URL}/episodes/${id}`, { headers: getHeaders() }).then(handleResponse),
    createEpisode: (data) => fetch(`${API_BASE_URL}/episodes`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updateEpisode: (id, data) => fetch(`${API_BASE_URL}/episodes/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    deleteEpisode: (id) => fetch(`${API_BASE_URL}/episodes/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),

    getMonstres: (params) => fetch(buildUrl(`${API_BASE_URL}/monstres`, params), { headers: getHeaders() }).then(handleResponse),
    getMonstre: (id) => fetch(`${API_BASE_URL}/monstres/${id}`, { headers: getHeaders() }).then(handleResponse),
    createMonstre: (data) => fetch(`${API_BASE_URL}/monstres`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updateMonstre: (id, data) => fetch(`${API_BASE_URL}/monstres/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    deleteMonstre: (id) => fetch(`${API_BASE_URL}/monstres/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),

    getStats: () => fetch(`${API_BASE_URL}/stats`, { headers: getHeaders() }).then(handleResponse),
    getHealth: () => fetch(`${API_BASE_URL}/health`, { headers: getHeaders(false) }).then(handleResponse),
    triggerEasterEgg: () => fetch(`${API_BASE_URL}/easter-egg`, { method: 'POST', headers: getHeaders(false) }).then(handleResponse),
};