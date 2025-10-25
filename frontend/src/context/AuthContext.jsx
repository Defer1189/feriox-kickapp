/**
 * @fileoverview Contexto de autenticación
 * @module context/AuthContext
 * @author FerIOX
 * @description Contexto de React para gestionar el estado de autenticación global
 */

import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as authService from '../services/auth.service.js';

/**
 * Contexto de autenticación
 * @constant {React.Context}
 */
const AuthContext = createContext(null);

/**
 * Provider del contexto de autenticación
 * @component
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Provider de autenticación
 * @description Proveedor del contexto que maneja el estado de autenticación
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Verifica si el usuario está autenticado al cargar la aplicación
     */
    useEffect(() => {
        checkAuthStatus();
    }, []);

    /**
     * Verifica el estado de autenticación
     * @async
     * @function checkAuthStatus
     */
    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            const userData = await authService.getUser();
            setUser(userData.data);
            setIsAuthenticated(true);
            setError(null);
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
            setError(null); // No mostrar error si no está autenticado
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Inicia el flujo de login
     * @async
     * @function login
     */
    const login = async () => {
        try {
            setError(null);
            await authService.login();
        } catch (err) {
            setError('Error al iniciar sesión');
            console.error('Error en login:', err);
        }
    };

    /**
     * Cierra la sesión del usuario
     * @async
     * @function logout
     */
    const logout = async () => {
        try {
            setError(null);
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (err) {
            setError('Error al cerrar sesión');
            console.error('Error en logout:', err);
        }
    };

    /**
     * Refresca los datos del usuario
     * @async
     * @function refreshUser
     */
    const refreshUser = async () => {
        try {
            setError(null);
            const userData = await authService.getUser();
            setUser(userData.data);
            setIsAuthenticated(true);
        } catch (err) {
            setError('Error al actualizar datos del usuario');
            console.error('Error en refreshUser:', err);
        }
    };

    /**
     * Valor del contexto
     */
    const value = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        refreshUser,
        checkAuthStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * @function useAuth
 * @returns {Object} Valor del contexto de autenticación
 * @throws {Error} Si se usa fuera del AuthProvider
 * @description Hook para acceder al contexto de autenticación
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}

export default AuthContext;
