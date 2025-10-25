/**
 * @fileoverview Página de inicio
 * @module pages/Home
 * @author FerIOX
 * @description Página de inicio de la aplicación
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './Home.css';

/**
 * Componente Home
 * @component
 * @returns {JSX.Element} Página de inicio
 * @description Muestra la página de inicio con información de la aplicación
 * @example
 * <Home />
 */
function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home">
            <div className="hero">
                <h1 className="hero-title">FerIOX KICK App</h1>
                <p className="hero-subtitle">Integración segura con KICK API mediante OAuth 2.1 + PKCE</p>
                <div className="hero-actions">
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="btn btn-primary">
                            Ir al Dashboard
                        </Link>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Iniciar Sesión con KICK
                        </Link>
                    )}
                    <a href="https://github.com/Defer1189/feriox-kickapp" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        Ver en GitHub
                    </a>
                </div>
            </div>

            <div className="features">
                <h2 className="features-title">Características Principales</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔐</div>
                        <h3>OAuth 2.1 Seguro</h3>
                        <p>Implementación completa con PKCE y validación de estado para máxima seguridad</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Stack Moderno</h3>
                        <p>React + Vite para el frontend, Express.js para el backend</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h3>Seguridad</h3>
                        <p>Cookies httpOnly, Helmet, CORS configurado, protección CSRF</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📚</div>
                        <h3>Documentación</h3>
                        <p>JSDoc completo y documentación Swagger para la API</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Código Limpio</h3>
                        <p>ESLint y Prettier configurados para mantener la calidad</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🏗️</div>
                        <h3>Arquitectura</h3>
                        <p>Monorepo con separación clara de responsabilidades</p>
                    </div>
                </div>
            </div>

            <div className="scopes-section">
                <h2 className="section-title">Scopes de KICK API</h2>
                <p className="section-description">
                    Esta aplicación solicita los siguientes permisos para interactuar con KICK:
                </p>
                <div className="scopes-grid">
                    <div className="scope-item">
                        <span className="scope-name">user:read</span>
                        <span className="scope-desc">Leer información del usuario</span>
                    </div>
                    <div className="scope-item">
                        <span className="scope-name">channel:read</span>
                        <span className="scope-desc">Leer información del canal</span>
                    </div>
                    <div className="scope-item">
                        <span className="scope-name">channel:write</span>
                        <span className="scope-desc">Modificar metadata del livestream</span>
                    </div>
                    <div className="scope-item">
                        <span className="scope-name">chat:write</span>
                        <span className="scope-desc">Enviar mensajes en chat</span>
                    </div>
                    <div className="scope-item">
                        <span className="scope-name">streamkey:read</span>
                        <span className="scope-desc">Leer stream key (sensible)</span>
                    </div>
                    <div className="scope-item">
                        <span className="scope-name">events:subscribe</span>
                        <span className="scope-desc">Suscribirse a webhooks</span>
                    </div>
                    <div className="scope-item">
                        <span className="scope-name">moderation:ban</span>
                        <span className="scope-desc">Acciones de moderación</span>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <h2>¿Listo para comenzar?</h2>
                <p>Inicia sesión con tu cuenta de KICK para acceder a todas las funcionalidades</p>
                {!isAuthenticated && (
                    <Link to="/login" className="btn btn-primary btn-large">
                        Comenzar Ahora
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Home;
