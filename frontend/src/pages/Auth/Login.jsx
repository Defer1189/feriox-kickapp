/**
 * @fileoverview Página de Login
 * @module pages/Auth/Login
 * @author FerIOX
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './Login.css';

function Login() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = () => {
        login();
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Iniciar Sesión</h1>
                <p>Conecta con tu cuenta de KICK para acceder a todas las funcionalidades</p>
                <button onClick={handleLogin} className="btn btn-login-kick">
                    🚀 Iniciar Sesión con KICK
                </button>
                <div className="login-info">
                    <p>
                        <strong>Nota:</strong> Serás redirigido a KICK para autorizar esta aplicación
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
