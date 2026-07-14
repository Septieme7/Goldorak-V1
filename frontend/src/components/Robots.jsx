// frontend/src/components/Robots.jsx
import { useAuth } from '../context/AuthContext';
import { useFetchData } from '../hooks/useFetchData';
import Modal from './Modal';
import DescriptionCell from './DescriptionCell';
import './Components.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800/api/v1';

function Robots() {
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
    } = useFetchData('robots', 100);

    const getTypeClass = (type) => {
        const classes = {
            'Robot de combat': 'badge-danger',
            'Robot transformable': 'badge-warning',
            'Robot de transport': 'badge-info',
            'Robot de reconnaissance': 'badge-secondary',
            'Robot de sauvetage': 'badge-success'
        };
        return classes[type] || 'badge-light';
    };

    const exportCSV = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/robots/export/csv`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Export échoué');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'robots.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Erreur lors de l\'export : ' + err.message);
        }
    };

    if (loading) return <div className="loading">Chargement des robots...</div>;
    if (error) return <div className="error">❌ Erreur: {error}</div>;

    return (
        <div className="component-container">
            <div className="component-header">
                <h2>🤖 Robots & Méchas</h2>
                <div className="header-actions">
                    {!isGuest && (
                        <button onClick={handleCreate} className="btn-create">
                            ➕ Nouveau robot
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
                            <th>Type</th>
                            <th>Hauteur</th>
                            <th>Poids</th>
                            <th>Pilote</th>
                            <th>Armes</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(robot => (
                            <tr key={robot.id}>
                                <td>{robot.id}</td>
                                <td><strong>{robot.nom_fr}</strong></td>
                                <td>{robot.nom_jp || '-'}</td>
                                <td>
                                    {robot.type_robot && (
                                        <span className={`badge ${getTypeClass(robot.type_robot)}`}>
                                            {robot.type_robot}
                                        </span>
                                    )}
                                </td>
                                <td>{robot.hauteur ? `${robot.hauteur}m` : '-'}</td>
                                <td>{robot.poids ? `${robot.poids}t` : '-'}</td>
                                <td>{robot.pilote_nom_fr || 'Automatique'}</td>
                                <td>{robot.nombre_armes || 0}</td>
                                <td>
                                    <DescriptionCell description={robot.description} maxLength={60} />
                                </td>
                                <td className="actions">
                                    {!isGuest && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(robot)}
                                                className="btn-action btn-edit"
                                                title="Modifier"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(robot.id, robot.nom_fr)}
                                                className="btn-action btn-delete"
                                                title="Supprimer"
                                            >
                                                🗑️
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleView(robot)}
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
                    <span className="stat-item"><strong>Total:</strong> {total} robots</span>
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
                    endpoint="robots"
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Robots;