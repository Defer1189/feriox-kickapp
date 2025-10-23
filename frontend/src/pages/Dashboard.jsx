import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated, loading, logout, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/');
    }
  }, [loading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="loading-spinner"></div>
          <p>Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card error">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>🎉 ¡Bienvenido al Dashboard!</h1>
          <p className="subtitle">Autenticación exitosa con KICK Dev</p>
        </div>

        <div className="dashboard-content">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Autenticación OAuth Exitosa</h2>
            <p>Has iniciado sesión correctamente utilizando OAuth 2.1 con PKCE</p>
          </div>

          <div className="user-info-section">
            <h3>📊 Información del Usuario</h3>
            <div className="info-box">
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>

          <div className="security-features">
            <h3>🔒 Características de Seguridad Implementadas</h3>
            <div className="features-grid">
              <div className="security-feature">
                <span className="feature-badge">🛡️</span>
                <div>
                  <h4>OAuth 2.1</h4>
                  <p>Protocolo de autorización estándar</p>
                </div>
              </div>
              <div className="security-feature">
                <span className="feature-badge">🔐</span>
                <div>
                  <h4>PKCE</h4>
                  <p>Proof Key for Code Exchange</p>
                </div>
              </div>
              <div className="security-feature">
                <span className="feature-badge">🍪</span>
                <div>
                  <h4>Cookies httpOnly</h4>
                  <p>Almacenamiento seguro de tokens</p>
                </div>
              </div>
              <div className="security-feature">
                <span className="feature-badge">🔄</span>
                <div>
                  <h4>State Parameter</h4>
                  <p>Protección contra CSRF</p>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={handleLogout} className="btn-logout">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="dashboard-footer">
          <p>🚀 FerIOX Kick App</p>
          <p className="tech-info">Desarrollado con React + Vite & Express.js</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
