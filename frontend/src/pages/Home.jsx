/**
 * Home Page Component
 * Public landing page with login button
 * @module HomePage
 */

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Home.css';

/**
 * Home Page Component
 * Displays landing page with KICK OAuth login
 * @returns {JSX.Element} Home page component
 */
const Home = () => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, loading, navigate]);

    /**
     * Handle login button click
     * Redirects to backend OAuth login endpoint
     */
    const handleLogin = () => {
        window.location.href = '/api/auth/login';
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="hero-section">
                <div className="logo-container">
                    <h1 className="app-title">FerIOX Kick App</h1>
                    <p className="app-subtitle">Integración Full-Stack con KICK API</p>
                </div>

                <div className="features">
                    <div className="feature-card">
                        <span className="feature-icon">🔐</span>
                        <h3>OAuth 2.1 Seguro</h3>
                        <p>Autenticación con PKCE y validación de estado</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">🚀</span>
                        <h3>React + Vite</h3>
                        <p>Frontend moderno y rápido</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">⚡</span>
                        <h3>Express.js</h3>
                        <p>Backend robusto y escalable</p>
                    </div>
                </div>

                <div className="cta-section">
                    <button className="login-button" onClick={handleLogin}>
                        <span className="button-icon">🎮</span>
                        Iniciar Sesión con KICK
                    </button>
                    <p className="login-info">
                        Necesitas una cuenta de KICK con 2FA habilitado
                    </p>
                </div>

                <div className="footer">
                    <p>
                        Desarrollado por <strong>FerIOX</strong>
                    </p>
                    <p className="motto">Escalado Horizontal, Ambición Vertical</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
