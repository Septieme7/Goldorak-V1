// ============================================================
// AppWithAuth.jsx
// Application principale avec authentification OAuth2,
// lecteur musical Goldorak et Easter Egg Konami
// ============================================================
import { useState, useRef, useEffect } from 'react';
import GrendizerLogo from './assets/GrendizerLogo.png';
import './App.css';

// ── Import des hooks personnalisés ──────────────────────────
import { useFetchStats, useApiStatus } from './hooks/useFetchData';
import { useKonamiCode }               from './hooks/useKonamiCode';

// ── Import du contexte d'authentification ───────────────────
import { useAuth } from './context/AuthContext';

// ── Import des composants de l'application ──────────────────
import Personnages from './components/Personnages';
import Robots      from './components/Robots';
import Armes       from './components/Armes';
import Episodes    from './components/Episodes';
import Monstres    from './components/Monstres';
import Vaisseaux   from './components/Vaisseaux';
import Header      from './components/Header';
import MusicPlayer from './components/MusicPlayer';

// ── Import du client API centralisé ─────────────────────────
// triggerEasterEgg() utilise déjà API_BASE_URL défini dans api.js
// → plus de fetch('/api/v1/...') relatif qui tape sur Vite (port 5173)
import { api } from './api.js';

// ============================================================
function AppWithAuth() {

    // ── Onglet actif ────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('personnages');

    // ── Infos utilisateur connecté ──────────────────────────
    const { user } = useAuth();

    // ── États de l'Easter Egg ───────────────────────────────
    const [showEasterImage, setShowEasterImage] = useState(false); // affichage overlay
    const [isEasterActive,  setIsEasterActive]  = useState(false); // curseur + filtre CSS

    // ── Référence audio pour l'Easter Egg ───────────────────
    const audioRef = useRef(null);

    // ── Statistiques & statut API ───────────────────────────
    const {
        stats = {
            personnages: 0,
            robots:      0,
            armes:       0,
            episodes:    0,
            monstres:    0,
            vaisseaux:   0
        },
        loading: statsLoading,
        refetch: refetchStats
    } = useFetchStats();

    const {
        status = 'unknown',
        checkApiStatus
    } = useApiStatus();

    // ── Bouton "Actualiser" : recharge stats + statut API ───
    const handleRefreshAll = () => {
        refetchStats();
        checkApiStatus();
    };

    // ── Activation de l'Easter Egg ──────────────────────────
    // Appelé automatiquement par useKonamiCode quand la séquence est détectée
    const activateEasterEgg = () => {
        // 1. Afficher l'overlay image et activer le mode Easter Egg
        setIsEasterActive(true);
        setShowEasterImage(true);

        // 2. Lancer la musique (reprend depuis le début si déjà en cours)
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err =>
                console.warn('Lecture audio bloquée par le navigateur :', err)
            );
        }

        // 3. Appel API via le client centralisé (API_BASE_URL correctement défini)
        //    → frappe bien http://localhost:8800/api/v1/easter-egg (et non le port 5173)
        api.triggerEasterEgg().catch(err =>
            console.warn('Easter Egg API call failed :', err)
        );

        // 4. Masquer l'overlay image après 15 secondes
        setTimeout(() => setShowEasterImage(false), 15_000);

        // 5. Désactiver le curseur personnalisé et le filtre CSS après 10 secondes
        //    (la musique continue de jouer indépendamment)
        setTimeout(() => setIsEasterActive(false), 10_000);

        // 6. Arrêter la musique après 3 minutes (180 secondes)
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }, 180_000);
    };

    // ── Hook Konami Code ────────────────────────────────────
    // Écoute ↑↑↓↓←→←→BA sur window (toutes les pages)
    useKonamiCode(activateEasterEgg);

    // ── Gestion du curseur et du filtre CSS ─────────────────
    // S'applique dès que isEasterActive change
    useEffect(() => {
        if (isEasterActive) {
            document.body.classList.add('easter-egg-cursor');
            document.body.classList.add('tailwind-easter-effect');
        } else {
            document.body.classList.remove('easter-egg-cursor');
            document.body.classList.remove('tailwind-easter-effect');
            // ⚠️ Ne pas stopper l'audio ici : il est géré par le timeout dédié (180s)
        }
    }, [isEasterActive]);

    // ── Rendu du composant actif selon l'onglet ─────────────
    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'personnages': return <Personnages />;
            case 'robots':      return <Robots />;
            case 'armes':       return <Armes />;
            case 'episodes':    return <Episodes />;
            case 'monstres':    return <Monstres />;
            case 'vaisseaux':   return <Vaisseaux />;
            default:            return <Personnages />;
        }
    };

    // ── Icône associée à chaque onglet ──────────────────────
    const getTabIcon = (tab) => {
        const icons = {
            personnages: '👥',
            robots:      '🤖',
            episodes:    '📺',
            armes:       '⚔️',
            monstres:    '🐉',
            vaisseaux:   '🚀',
        };
        return icons[tab] ?? '📊';
    };

    // ============================================================
    // RENDU PRINCIPAL
    // ============================================================
    return (
        <div className="app">

            {/* ── En-tête utilisateur (photo, nom, déconnexion) ── */}
            <Header />

            {/* ── En-tête principal : logo + lecteur musical ─────── */}
            <header className="header" style={{ position: 'relative' }}>
                <div className="logo-container">
                    <img
                        src={GrendizerLogo}
                        alt="Goldorak Database"
                        className="logo-image"
                    />
                </div>
                <p>Base de données complète de l'univers Goldorak</p>

                {/* Lecteur musical positionné en haut à droite du header */}
                <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
                    <MusicPlayer />
                </div>
            </header>

            {/* ── Audio Easter Egg (préchargé, silencieux par défaut) ── */}
            <audio ref={audioRef} src="/assets/Goldorak-est-mort.mp3" preload="auto" />

            {/* ── Overlay image Easter Egg ──────────────────────────── */}
            {/* Clic sur l'overlay pour fermer manuellement */}
            {showEasterImage && (
                <div
                    className="easter-egg-overlay"
                    onClick={() => setShowEasterImage(false)}
                >
                    <img
                        src="/assets/easterEGG2.png"
                        alt="Easter Egg Goldorak"
                        className="easter-egg-image"
                    />
                </div>
            )}

            {/* ── Dashboard : status API + statistiques ─────────────── */}
            <div className="dashboard">

                {/* Panneau de statut */}
                <div className="status-panel">
                    <div className="status-info">
                        <div className="status-item">
                            <span>API Status :</span>
                            <span className={`status ${status}`}>
                                {status === 'online'  ? '✅ En ligne'       :
                                    status === 'offline' ? '❌ Hors ligne'     :
                                        '⏳ Vérification...'}
                            </span>
                        </div>
                        <div className="status-item">
                            <span>Dernier refresh :</span>
                            <span>{new Date().toLocaleTimeString('fr-FR')}</span>
                        </div>
                        <button className="btn-refresh" onClick={handleRefreshAll}>
                            🔄 Actualiser
                        </button>
                    </div>
                </div>

                {/* Grille de statistiques */}
                <div className="stats-grid">
                    {[
                        { icon: '👥', label: 'Personnages', key: 'personnages' },
                        { icon: '🤖', label: 'Robots',      key: 'robots'      },
                        { icon: '⚔️', label: 'Armes',       key: 'armes'       },
                        { icon: '📺', label: 'Épisodes',    key: 'episodes'    },
                        { icon: '🐉', label: 'Monstres',    key: 'monstres'    },
                        { icon: '🚀', label: 'Vaisseaux',   key: 'vaisseaux'   },
                    ].map(({ icon, label, key }) => (
                        <div className="stat-card" key={key}>
                            <span className="stat-icon">{icon}</span>
                            <div className="stat-info">
                                <span className="stat-label">{label}</span>
                                <span className="stat-value">
                                    {statsLoading ? '…' : stats[key]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Barre d'onglets ───────────────────────────────────── */}
            <div className="tabs">
                {['personnages', 'robots', 'vaisseaux', 'armes', 'episodes', 'monstres'].map((tab) => (
                    <button
                        key={tab}
                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        <span className="tab-icon">{getTabIcon(tab)}</span>
                        <span className="tab-label">
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Contenu de l'onglet actif ─────────────────────────── */}
            <div className="content">
                {renderActiveComponent()}
            </div>

        </div>
    );
}

export default AppWithAuth;