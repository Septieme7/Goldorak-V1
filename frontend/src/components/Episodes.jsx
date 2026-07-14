// frontend/src/components/Episodes.jsx
import { useAuth } from '../context/AuthContext';
import { useFetchData } from '../hooks/useFetchData';
import Modal from './Modal';
import DescriptionCell from './DescriptionCell';
import './Components.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800/api/v1';

function Episodes() {
    const { user } = useAuth();
    const isGuest = user?.isGuest || false;

    const {
        data,
        loading,
        error,
        refetch,
        handleView,
        handleEdit,
        handleDelete,
        handleCreate,
        handleSave,
        selectedItem,
        modalType,
        showModal,
        setShowModal,
        page,
        total,
        totalPages,
        goToPage,
        searchTerm,
        setSearch,
        setLimit,
        limit
    } = useFetchData('episodes', 100);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return '-';
        }
    };

    const getSaison = (numero_jp) => {
        if (!numero_jp) return 'Inconnu';
        if (numero_jp <= 26) return 'Saison 1';
        if (numero_jp <= 52) return 'Saison 2';
        return 'Saison 3';
    };

    const exportCSV = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/episodes/export/csv`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Export échoué');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'episodes.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Erreur lors de l\'export : ' + err.message);
        }
    };

    if (loading) return <div className="loading">Chargement des épisodes...</div>;
    if (error) return <div className="error">❌ Erreur: {error}</div>;

    return (
        <div className="component-container">
            <div className="component-header">
                <h2>📺 Épisodes de Goldorak</h2>
                <div className="header-actions">
                    {!isGuest && (
                        <button onClick={handleCreate} className="btn-create">
                            ➕ Nouvel épisode
                        </button>
                    )}
                    <button onClick={refetch} className="btn-refresh">
                        🔄 Actualiser
                    </button>
                    <button onClick={exportCSV} className="btn-export">
                        ⬇️ Export CSV
                    </button>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                            minLength={2}
                        />
                    </div>
                </div>
            </div>

            <div className="table-scroll">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Saison</th>
                            <th>JP</th>
                            <th>FR</th>
                            <th>Titre FR</th>
                            <th>Titre JP</th>
                            <th>Diffusion JP</th>
                            <th>Diffusion FR</th>
                            <th>Statut</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(episode => (
                            <tr key={episode.id}>
                                <td>
                                    <span className="badge-saison">
                                        {getSaison(episode.numero_jp)}
                                    </span>
                                </td>
                                <td>{episode.numero_jp || '-'}</td>
                                <td>{episode.numero_fr || '-'}</td>
                                <td><strong>{episode.titre_fr || 'Sans titre'}</strong></td>
                                <td>{episode.titre_jp || '-'}</td>
                                <td>{formatDate(episode.diffuse_jp)}</td>
                                <td>{formatDate(episode.diffuse_fr)}</td>
                                <td>
                                    <span className={`badge ${episode.numero_fr ? 'badge-success' : 'badge-warning'}`}>
                                        {episode.numero_fr ? 'Diffusé FR' : 'Non diffusé'}
                                    </span>
                                </td>
                                <td>
                                    <DescriptionCell description={episode.resume} maxLength={60} />
                                </td>
                                <td className="actions">
                                    {!isGuest && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(episode)}
                                                className="btn-action btn-edit"
                                                title="Modifier"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(episode.id, episode.titre_fr)}
                                                className="btn-action btn-delete"
                                                title="Supprimer"
                                            >
                                                🗑️
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleView(episode)}
                                        className="btn-action btn-info"
                                        title="Détails"
                                    >
                                        ℹ️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="component-footer">
                <div className="stats">
                    <span className="stat-item"><strong>Total:</strong> {total} épisodes</span>
                </div>
                <div className="pagination">
                    <button
                        className="btn-pagination"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                        aria-label="Page précédente"
                    >
                        ◀
                    </button>
                    <span className="page-info">Page {page} / {totalPages || 1}</span>
                    <button
                        className="btn-pagination"
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages || totalPages === 0}
                        aria-label="Page suivante"
                    >
                        ▶
                    </button>
                    <select
                        className="limit-select"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            {showModal && (
                <Modal
                    item={selectedItem}
                    type={modalType}
                    endpoint="episodes"
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Episodes;