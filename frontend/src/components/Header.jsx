import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './Header.css';

function Header({ isAuthenticated, onLogout }) {
  const [apiInfo, setApiInfo] = useState(null);

  useEffect(() => {
    const fetchApiInfo = async () => {
      try {
        const data = await apiService.info();
        setApiInfo(data);
      } catch (error) {
        console.error('Failed to fetch API info:', error);
      }
    };

    fetchApiInfo();
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>🎮 {apiInfo?.name || 'FerIOX KICK API'}</h1>
          <p className="header-subtitle">{apiInfo?.description}</p>
        </div>
        <div className="header-actions">
          {isAuthenticated ? (
            <button onClick={onLogout} className="btn btn-secondary">
              Logout
            </button>
          ) : (
            <button onClick={apiService.auth.login} className="btn btn-primary">
              Login with KICK
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
