// frontend/src/components/Login.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800/api/v1';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    const handleGitHubLogin = () => {
        window.location.href = `${API_URL}/auth/github`;
    };

    const handleGuestLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/guest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();

            if (data.success) {
                // Utiliser la fonction login du contexte pour stocker le token et l'utilisateur
                login(data.token, data.user);
                navigate('/');
            } else {
                alert('Erreur lors de la connexion en tant qu\'invité: ' + (data.error || 'Erreur inconnue'));
            }
        } catch (error) {
            console.error('Erreur réseau lors de la connexion invité:', error);
            alert('Erreur réseau lors de la connexion en tant qu\'invité');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>Bienvenue sur Goldorak DB</h1>
                    <p>Veuillez vous authentifier pour accéder à l'application</p>
                </div>

                <div className="login-buttons">
                    <button
                        className="login-button google-button"
                        onClick={handleGoogleLogin}
                    >
                        <svg className="button-icon" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                            <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                            <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                            <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                        </svg>
                        Se connecter avec Google
                    </button>

                    <button
                        className="login-button github-button"
                        onClick={handleGitHubLogin}
                    >
                        <svg className="button-icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
                        </svg>
                        Se connecter avec GitHub
                    </button>

                    <button
                        className="login-button guest-button"
                        onClick={handleGuestLogin}
                        style={{
                            background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                            borderColor: '#a0aec0',
                            color: 'white'
                        }}
                    >
                        <span role="img" aria-label="invité" style={{ fontSize: '1.5rem' }}>👤</span>
                        Continuer en tant qu'invité
                    </button>
                </div>

                <div className="login-footer">
                    <p>Sécurisé avec OAuth 2.0 &amp; mode invité</p>
                </div>
            </div>
        </div>
    );
}

export default Login;