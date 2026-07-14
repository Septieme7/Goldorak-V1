import { useState } from 'react';
import GrendizerLogo from './assets/GrendizerLogo.png';
import './App.css';

// Import des hooks depuis le fichier corrigé
import { useFetchStats, useApiStatus } from './hooks/useFetchData';

// Import des composants
import Personnages from './components/Personnages';
import Robots from './components/Robots';
import Armes from './components/Armes';
import Episodes from './components/Episodes';
import Monstres from './components/Monstres';
import Vaisseaux from './components/Vaisseaux';

function App() {
    const [activeTab, setActiveTab] = useState('personnages');

    // Utilisation des hooks - avec gestion des valeurs par défaut
    const {
        stats = {
            personnages: 0,
            robots: 0,
            armes: 0,
            episodes: 0,
            monstres: 0,
            vaisseaux: 0
        },
        loading: statsLoading,
        refetch: refetchStats
    } = useFetchStats();

    const {
        status = 'unknown',
        checkApiStatus
    } = useApiStatus();

    const handleRefreshAll = () => {
        refetchStats();
        checkApiStatus();
    };

    const renderActiveComponent = () => {
        switch(activeTab) {
            case 'personnages':
                return <Personnages />;
            case 'robots':
                return <Robots />;
            case 'armes':
                return <Armes />;
            case 'episodes':
                return <Episodes />;
            case 'monstres':
                return <Monstres />;
            case 'vaisseaux':
                return <Vaisseaux />;
            default:
                return <Personnages />;
        }
    };

    const getTabIcon = (tab) => {
        switch(tab) {
            case 'personnages': return '👥';
            case 'robots': return '🤖';
            case 'episodes': return '📺';
            case 'armes': return '⚔️';
            case 'monstres': return '🐉';
            case 'vaisseaux': return '🚀';
            default: return '📊';
        }
    };

    return (
        <div className="app">
            <header className="header">
                <div className="logo-container">
                    <img
                        src={GrendizerLogo}
                        alt="Goldorak Database"
                        className="logo-image"
                    />
                </div>
                <p>Base de données complète de l'univers Goldorak</p>
            </header>

            <div className="dashboard">
                <div className="status-panel">
                    <div className="status-info">
                        <div className="status-item">
                            <span>API Status:</span>
                            <span className={`status ${status}`}>
                                {status === 'online' ? '✅ En ligne' :
                                    status === 'offline' ? '❌ Hors ligne' : '⏳ Vérification...'}
                            </span>
                        </div>
                        <div className="status-item">
                            <span>Dernier refresh:</span>
                            <span>{new Date().toLocaleTimeString('fr-FR')}</span>
                        </div>
                        <button onClick={handleRefreshAll} className="btn-refresh">
                            🔄 Actualiser tout
                        </button>
                    </div>

                    {!statsLoading && (
                        <div className="stats-grid">
                            <div className="stat-card" onClick={() => setActiveTab('personnages')} style={{cursor: 'pointer'}}>
                                <div className="stat-icon">👥</div>
                                <div className="stat-content">
                                    <div className="stat-value">{stats.personnages || 0}</div>
                                    <div className="stat-label">Personnages</div>
                                </div>
                            </div>
                            <div className="stat-card" onClick={() => setActiveTab('robots')} style={{cursor: 'pointer'}}>
                                <div className="stat-icon">🤖</div>
                                <div className="stat-content">
                                    <div className="stat-value">{stats.robots || 0}</div>
                                    <div className="stat-label">Robots</div>
                                </div>
                            </div>
                            <div className="stat-card" onClick={() => setActiveTab('episodes')} style={{cursor: 'pointer'}}>
                                <div className="stat-icon">📺</div>
                                <div className="stat-content">
                                    <div className="stat-value">{stats.episodes || 0}</div>
                                    <div className="stat-label">Épisodes</div>
                                </div>
                            </div>
                            <div className="stat-card" onClick={() => setActiveTab('armes')} style={{cursor: 'pointer'}}>
                                <div className="stat-icon">⚔️</div>
                                <div className="stat-content">
                                    <div className="stat-value">{stats.armes || 0}</div>
                                    <div className="stat-label">Armes</div>
                                </div>
                            </div>
                            <div className="stat-card" onClick={() => setActiveTab('monstres')} style={{cursor: 'pointer'}}>
                                <div className="stat-icon">🐉</div>
                                <div className="stat-content">
                                    <div className="stat-value">{stats.monstres || 0}</div>
                                    <div className="stat-label">Monstres</div>
                                </div>
                            </div>
                            <div className="stat-card" onClick={() => setActiveTab('vaisseaux')} style={{cursor: 'pointer'}}>
                                <div className="stat-icon">🚀</div>
                                <div className="stat-content">
                                    <div className="stat-value">{stats.vaisseaux || 0}</div>
                                    <div className="stat-label">Vaisseaux</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {statsLoading && (
                        <div className="stats-loading">
                            <p>Chargement des statistiques...</p>
                        </div>
                    )}
                </div>

                <div className="main-content">
                    <div className="tabs">
                        {['personnages', 'robots', 'episodes', 'armes', 'monstres', 'vaisseaux'].map(tab => (
                            <button
                                key={tab}
                                className={`tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {getTabIcon(tab)} {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="content-area">
                        {renderActiveComponent()}
                    </div>
                </div>
            </div>

            <footer className="footer">
                <p>Goldorak DB Interface &copy; 2026 | API REST avec Express & MySQL et sa grand-mére pour la CONFIG</p>
                <p className="footer-links">
                    <span>Backend: <a href="http://localhost:8800" target="_blank" rel="noreferrer">localhost:8800</a></span>
                    <span>Frontend: <a href="http://localhost:5173" target="_blank" rel="noreferrer">localhost:5173</a></span>
                    <span>Base de données: MySQL goldorak_db</span>
                </p>
            </footer>
        </div>
    );
}

export default App;