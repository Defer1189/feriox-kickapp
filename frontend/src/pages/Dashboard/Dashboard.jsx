/**
 * @fileoverview Página de Dashboard
 * @module pages/Dashboard
 * @author FerIOX
 */

import { useAuth } from '../../context/AuthContext.jsx';
import './Dashboard.css';

function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="dashboard-welcome">
                <h2>¡Bienvenido, {user?.username || 'Usuario'}!</h2>
                <p>Has iniciado sesión exitosamente con KICK</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>👤 Información del Usuario</h3>
                    <pre className="user-data">{JSON.stringify(user, null, 2)}</pre>
                </div>

                <div className="dashboard-card">
                    <h3>🔐 Estado de Autenticación</h3>
                    <p className="status-success">✅ Autenticado correctamente</p>
                    <p>Token de acceso almacenado de forma segura en cookies httpOnly</p>
                </div>

                <div className="dashboard-card">
                    <h3>📊 Scopes Autorizados</h3>
                    <ul className="scopes-list">
                        <li>✓ user:read</li>
                        <li>✓ channel:read</li>
                        <li>✓ channel:write</li>
                        <li>✓ chat:write</li>
                        <li>✓ streamkey:read</li>
                        <li>✓ events:subscribe</li>
                        <li>✓ moderation:ban</li>
                    </ul>
                </div>

                <div className="dashboard-card">
                    <h3>🚀 Próximos Pasos</h3>
                    <p>Explora las funcionalidades de integración con KICK API</p>
                    <a href="/api/docs" target="_blank" className="btn btn-primary">
                        Ver Documentación API
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
