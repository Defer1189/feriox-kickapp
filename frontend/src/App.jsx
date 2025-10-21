import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const { user, loading, error, isAuthenticated, login, logout, checkAuth } = useAuth();

  useEffect(() => {
    // Check for error in URL params (from OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      console.error('Authentication error:', errorParam);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check authentication status after OAuth callback
    if (urlParams.toString() === '' && !isAuthenticated && !loading) {
      checkAuth();
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error && error !== 'Request failed with status code 401') {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {isAuthenticated ? (
        <>
          <Header user={user} onLogout={logout} />
          <Dashboard user={user} />
        </>
      ) : (
        <Login onLogin={login} />
      )}
    </div>
  );
}

export default App;
