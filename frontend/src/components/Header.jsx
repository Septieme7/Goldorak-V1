// components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <header className="app-header">
            <div className="header-content">
                <div className="header-logo">
                    <h1>Goldorak DB</h1>
                </div>

                <div className="header-user">
                    <div className="user-info">
                        {user.avatar_url && (
                            <img
                                src={user.avatar_url}
                                alt={user.displayName}
                                className="user-avatar"
                            />
                        )}
                        <div className="user-details">
                            <span className="user-name">{user.displayName}</span>
                            <span className="user-provider">
                                via {user.provider}
                            </span>
                        </div>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                        title="Se déconnecter"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Déconnexion
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
