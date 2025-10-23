import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Cargando...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🚀 FerIOX Kick App</h1>
          <p className="subtitle">Aplicación Full-Stack para integración con KICK API</p>
        </div>
        
        <div className="login-content">
          <p className="welcome-text">
            Bienvenido a FerIOX Kick App. Esta aplicación te permite conectarte de forma segura
            con la API de KICK Dev utilizando OAuth 2.1 con PKCE.
          </p>
          
          <div className="features">
            <div className="feature">
              <span className="feature-icon">🔐</span>
              <span>Autenticación segura con OAuth 2.1</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🛡️</span>
              <span>Implementación PKCE para mayor seguridad</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🍪</span>
              <span>Cookies httpOnly seguras</span>
            </div>
          </div>

          <button 
            className="login-button"
            onClick={login}
            type="button"
          >
            <span className="button-icon">🚀</span>
            Iniciar Sesión con KICK
          </button>
          
          <p className="info-text">
            Al hacer clic en "Iniciar Sesión", serás redirigido a KICK para autorizar
            el acceso a tu cuenta de forma segura.
          </p>
        </div>
        
        <div className="login-footer">
          <p>Desarrollado por FerIOX</p>
          <p className="tech-stack">React + Vite | Express.js | OAuth 2.1</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
