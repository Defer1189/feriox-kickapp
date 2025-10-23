/**
 * Protected Route Component
 * Wrapper component for routes that require authentication
 * @module ProtectedRoute
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protected Route Component
 * Redirects to home if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        border: '4px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '4px solid white',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }}></div>
                    <p>Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
