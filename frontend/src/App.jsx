import { useState, useEffect } from 'react';
import { apiService } from './services/api';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  // Check authentication status on mount and after navigation
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const data = await apiService.auth.status();
        setIsAuthenticated(data.authenticated);
        
        // If authenticated and on home page, show dashboard
        if (data.authenticated && currentPage === 'home') {
          setCurrentPage('dashboard');
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndNavigate();
    
    // Parse URL for page parameter
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      alert('Authentication failed. Please try again.');
      window.history.replaceState({}, '', '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.auth.logout();
      setIsAuthenticated(false);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Detect when we're on dashboard route
  useEffect(() => {
    const checkAuthOnDashboard = async () => {
      if (window.location.pathname.includes('dashboard')) {
        setCurrentPage('dashboard');
        try {
          const data = await apiService.auth.status();
          setIsAuthenticated(data.authenticated);
        } catch (error) {
          console.error('Failed to check auth status:', error);
        }
      }
    };
    
    checkAuthOnDashboard();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main className="main-content">
        {currentPage === 'dashboard' && isAuthenticated ? (
          <Dashboard />
        ) : (
          <Home />
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2025 FerIOX - MIT License</p>
        <p>
          <a href="https://github.com/Defer1189/feriox-kickapp" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
