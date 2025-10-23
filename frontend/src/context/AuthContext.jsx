/**
 * Authentication Context for FerIOX Kick App
 * Provides authentication state and methods throughout the application
 * @module AuthContext
 */

/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} username - Username
 * @property {Object} data - Additional user data from KICK API
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user - Current authenticated user
 * @property {boolean} loading - Loading state
 * @property {boolean} isAuthenticated - Authentication status
 * @property {Function} checkAuth - Check authentication status
 * @property {Function} logout - Logout function
 */

const AuthContext = createContext(null);

/**
 * Custom hook to use the AuthContext
 * @returns {AuthContextType} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Authentication Provider Component
 * Wraps the application and provides authentication state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AuthProvider component
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * Check if user is authenticated by calling the backend
     * @returns {Promise<boolean>} Authentication status
     */
    const checkAuth = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/auth/user', {
                withCredentials: true,
            });

            if (response.data && response.data.status === 'success') {
                setUser(response.data.data);
                setIsAuthenticated(true);
                return true;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                return false;
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            setUser(null);
            setIsAuthenticated(false);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout the current user
     * Clears authentication state and redirects to home
     * @returns {Promise<void>}
     */
    const logout = async () => {
        try {
            await axios.post(
                '/api/auth/logout',
                {},
                {
                    withCredentials: true,
                }
            );
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error logging out:', error);
            // Clear state even if request fails
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Check auth status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated,
        checkAuth,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
