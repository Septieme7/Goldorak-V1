// frontend/src/components/Monstres.jsx
import { useAuth } from '../context/AuthContext';
import { useFetchData } from '../hooks/useFetchData';
import Modal from './Modal';
import DescriptionCell from './DescriptionCell';
import './Components.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800/api/v1';

function Monstres() {
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
    } = useFetchData('monstres', 100);

    const getTypeClass = (type) => {
        const classes = {
            'Monstre': 'badge-danger',
            'Robot': 'badge-warning',
            'Vaisseau': 'badge-info'
        };
        return classes[type] || 'badge-light';
    };

    const exportCSV = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/monstres/export/csv`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Export échoué');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'monstres.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Erreur lors de l\'export : ' + err.message);
        }
    };

    if (loading) return <div className="loading">Chargement des monstres...</div>;
    if (error) return <div className="error">❌ Erreur: {error}</div>;

    return (
        <div className="component-container">
            <div className="component-header">
                <h2>🐉 Monstres & Ennemis</h2>
                <div className="header-actions">
                    {!isGuest && (
                        <button onClick={handleCreate} className="btn-create">
                            ➕ Nouveau monstre
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
                            <th>ID</th>
                            <th>Nom FR</th>
                            <th>Nom JP</th>
                            <th>Épisode</th>
                            <th>Type</th>
                            <th>Taille</th>
                            <th>Puissance</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(monstre => (
                            <tr key={monstre.id}>
                                <td>{monstre.id}</td>
                                <td><strong>{monstre.nom_fr || 'Sans nom'}</strong></td>
                                <td>{monstre.nom_jp || '-'}</td>
                                <td>
                                    {monstre.episode_titre_fr ? (
                                        <span className="episode-link">
                                            {monstre.episode_numero_fr || monstre.episode_numero_jp}: {monstre.episode_titre_fr.substring(0, 30)}...
                                        </span>
                                    ) : '-'}
                                </td>
                                <td>
                                    <span className={`badge ${getTypeClass(monstre.type_monstre)}`}>
                                        {monstre.type_monstre || 'Inconnu'}
                                    </span>
                                </td>
                                <td>{monstre.taille ? `${monstre.taille}m` : '-'}</td>
                                <td>{monstre.puissance || '-'}</td>
                                <td>
                                    <DescriptionCell description={monstre.description} maxLength={60} />
                                </td>
                                <td className="actions">
                                    {!isGuest && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(monstre)}
                                                className="btn-action btn-edit"
                                                title="Modifier"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(monstre.id, monstre.nom_fr)}
                                                className="btn-action btn-delete"
                                                title="Supprimer"
                                            >
                                                🗑️
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleView(monstre)}
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
                    <span className="stat-item"><strong>Total:</strong> {total} monstres</span>
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
                    endpoint="monstres"
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Monstres;