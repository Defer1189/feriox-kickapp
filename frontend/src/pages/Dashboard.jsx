/**
 * Dashboard Page Component
 * Protected page that displays user information after authentication
 * @module DashboardPage
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

/**
 * Dashboard Page Component
 * Displays authenticated user's KICK data and session information
 * @returns {JSX.Element} Dashboard page component
 */
const Dashboard = () => {
    const { user, loading, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [showData, setShowData] = useState(false);

    // Redirect to home if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, loading, navigate]);

    /**
     * Handle logout button click
     * Logs out user and redirects to home
     */
    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <h1>🎮 Dashboard de FerIOX</h1>
                    <button className="logout-button" onClick={handleLogout}>
                        🚪 Cerrar Sesión
                    </button>
                </header>

                <div className="welcome-section">
                    <h2>¡Bienvenido!</h2>
                    <p className="success-message">
                        ✅ Has iniciado sesión exitosamente con KICK OAuth 2.1
                    </p>
                </div>

                <div className="info-cards">
                    <div className="info-card">
                        <h3>📊 Estado de Sesión</h3>
                        <div className="info-content">
                            <div className="info-row">
                                <span className="info-label">Estado:</span>
                                <span className="status-badge authenticated">
                                    ✓ Autenticado
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Método:</span>
                                <span className="info-value">OAuth 2.1 con PKCE</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Proveedor:</span>
                                <span className="info-value">KICK API</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3>👤 Datos del Usuario</h3>
                        <div className="info-content">
                            {user ? (
                                <>
                                    <button 
                                        className="toggle-button"
                                        onClick={() => setShowData(!showData)}
                                    >
                                        {showData ? '👁️ Ocultar Datos' : '👁️‍🗨️ Mostrar Datos'}
                                    </button>
                                    {showData && (
                                        <pre className="user-data">
                                            {JSON.stringify(user, null, 2)}
                                        </pre>
                                    )}
                                </>
                            ) : (
                                <p>No hay datos de usuario disponibles</p>
                            )}
                        </div>
                    </div>

                    <div className="info-card">
                        <h3>🔐 Seguridad</h3>
                        <div className="info-content">
                            <ul className="security-list">
                                <li>✅ PKCE (Proof Key for Code Exchange)</li>
                                <li>✅ State Parameter (CSRF Protection)</li>
                                <li>✅ HttpOnly Cookies</li>
                                <li>✅ Secure Token Storage</li>
                                <li>✅ CORS Configurado</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="scopes-section">
                    <h3>🔑 Scopes Solicitados</h3>
                    <div className="scopes-grid">
                        <div className="scope-item">
                            <span className="scope-icon">👤</span>
                            <span className="scope-name">user:read</span>
                        </div>
                        <div className="scope-item">
                            <span className="scope-icon">📺</span>
                            <span className="scope-name">channel:read</span>
                        </div>
                        <div className="scope-item">
                            <span className="scope-icon">✏️</span>
                            <span className="scope-name">channel:write</span>
                        </div>
                        <div className="scope-item">
                            <span className="scope-icon">💬</span>
                            <span className="scope-name">chat:write</span>
                        </div>
                        <div className="scope-item">
                            <span className="scope-icon">🔑</span>
                            <span className="scope-name">streamkey:read</span>
                        </div>
                        <div className="scope-item">
                            <span className="scope-icon">📡</span>
                            <span className="scope-name">events:subscribe</span>
                        </div>
                        <div className="scope-item">
                            <span className="scope-icon">🛡️</span>
                            <span className="scope-name">moderation:ban</span>
                        </div>
                    </div>
                </div>

                <footer className="dashboard-footer">
                    <p>FerIOX Kick App - Integración Full-Stack con KICK API</p>
                    <p className="motto">Escalado Horizontal, Ambición Vertical</p>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;
