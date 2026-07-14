// components/AuthCallback.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthCallback() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const hasRun = useRef(false);

    useEffect(() => {
        // Éviter le double traitement avec useRef
        if (hasRun.current) return;
        hasRun.current = true;

        // Récupérer le token depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        console.log('AuthCallback - Token reçu:', token ? 'Oui' : 'Non');

        if (error) {
            console.error('Erreur d\'authentification:', error);
            alert('Erreur lors de l\'authentification. Veuillez réessayer.');
            navigate('/login', { replace: true });
            return;
        }

        if (token) {
            setIsProcessing(true);
            // Vérifier le token
            verifyToken(token);
        } else {
            navigate('/login', { replace: true });
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800/api/v1';
            console.log('Vérification du token...');

            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Utilisateur authentifié:', data.user);

                // Utiliser la fonction login du contexte pour stocker tout
                login(token, data.user);

                // Rediriger vers la page principale avec replace pour éviter le back
                console.log('Redirection vers /');
                navigate('/', { replace: true });
            } else {
                throw new Error('Token invalide');
            }
        } catch (error) {
            console.error('Erreur de vérification du token:', error);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setIsProcessing(false);
            navigate('/login', { replace: true });
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                textAlign: 'center'
            }}>
                <div className="loading-spinner"></div>
                <h2 style={{ marginTop: '20px', color: '#2d3748' }}>
                    Authentification en cours...
                </h2>
                <p style={{ color: '#718096' }}>
                    Veuillez patienter
                </p>
            </div>
        </div>
    );
}

export default AuthCallback;
