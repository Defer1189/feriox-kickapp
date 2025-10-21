import './Login.css';

function Login({ onLogin }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎮 Bienvenido a FerIOX KICK App</h1>
          <p>Conecta tu cuenta de KICK para comenzar</p>
        </div>
        
        <div className="login-body">
          <div className="features">
            <div className="feature">
              <span className="feature-icon">🔐</span>
              <span>Autenticación segura con OAuth2</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Acceso a datos de tu canal</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💬</span>
              <span>Gestión de chat y moderación</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔔</span>
              <span>Suscripción a eventos en tiempo real</span>
            </div>
          </div>
          
          <button onClick={onLogin} className="btn-login">
            <span className="btn-icon">🚀</span>
            Conectar con KICK
          </button>
          
          <div className="login-footer">
            <p className="scopes-info">
              Esta aplicación solicita los siguientes permisos:
            </p>
            <ul className="scopes-list">
              <li>Leer información del usuario</li>
              <li>Leer y escribir en el canal</li>
              <li>Escribir en el chat</li>
              <li>Leer stream key</li>
              <li>Suscribirse a eventos</li>
              <li>Gestionar moderación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
