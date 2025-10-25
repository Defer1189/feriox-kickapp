/**
 * @fileoverview Componente de Header
 * @module components/layout/Header
 * @author FerIOX
 * @description Header de la aplicación con navegación y estado de autenticación
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './Header.css';

/**
 * Componente Header
 * @component
 * @returns {JSX.Element} Header de la aplicación
 * @description Muestra el header con navegación y botones de auth
 * @example
 * <Header />
 */
function Header() {
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = '/';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-brand">
                    <Link to="/" className="header-logo">
                        <span className="header-logo-text">FerIOX</span>
                        <span className="header-logo-subtitle">KICK App</span>
                    </Link>
                </div>

                <nav className="header-nav">
                    <Link to="/" className="nav-link">
                        Inicio
                    </Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/dashboard" className="nav-link">
                                Dashboard
                            </Link>
                            <Link to="/profile" className="nav-link">
                                Perfil
                            </Link>
                        </>
                    )}
                </nav>

                <div className="header-actions">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <span className="user-welcome">¡Hola, {user?.username || 'Usuario'}!</span>
                            <button onClick={handleLogout} className="btn btn-logout">
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-login">
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
