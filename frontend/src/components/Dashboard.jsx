import './Dashboard.css';

function Dashboard({ user }) {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="welcome-section">
          <h2>¡Bienvenido de nuevo! 👋</h2>
          <p>Conectado exitosamente con tu cuenta de KICK</p>
        </div>

        <div className="cards-grid">
          <div className="info-card">
            <div className="card-header">
              <h3>👤 Información del Usuario</h3>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">{user.username || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">User ID:</span>
                <span className="info-value">{user.id || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header">
              <h3>✅ Permisos Otorgados</h3>
            </div>
            <div className="card-body">
              <ul className="permissions-list">
                <li>🔍 Leer información del usuario</li>
                <li>📺 Leer información del canal</li>
                <li>✏️ Escribir en el canal</li>
                <li>💬 Escribir en el chat</li>
                <li>🔑 Leer stream key</li>
                <li>🔔 Suscribirse a eventos</li>
                <li>🛡️ Gestionar moderación</li>
              </ul>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header">
              <h3>🎯 Acciones Disponibles</h3>
            </div>
            <div className="card-body">
              <p className="card-description">
                Tu aplicación ahora tiene acceso completo a la API de KICK con los permisos solicitados.
              </p>
              <div className="actions-grid">
                <button className="action-btn" disabled>
                  <span>📊</span> Ver Estadísticas
                </button>
                <button className="action-btn" disabled>
                  <span>💬</span> Gestionar Chat
                </button>
                <button className="action-btn" disabled>
                  <span>🔔</span> Ver Eventos
                </button>
                <button className="action-btn" disabled>
                  <span>⚙️</span> Configuración
                </button>
              </div>
              <p className="note">
                * Las acciones específicas se implementarán según tus necesidades
              </p>
            </div>
          </div>

          <div className="info-card success-card">
            <div className="card-header">
              <h3>🎉 ¡Integración Exitosa!</h3>
            </div>
            <div className="card-body">
              <p className="success-message">
                Tu aplicación está correctamente configurada y autenticada con la API de KICK.
                Ahora puedes comenzar a desarrollar funcionalidades personalizadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
