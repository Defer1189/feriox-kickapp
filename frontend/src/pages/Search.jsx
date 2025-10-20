import { useState } from 'react';
import { kickApi } from '../services/api';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await kickApi.searchChannels(query);
      setResults(data);
      setLoading(false);
    } catch (err) {
      setError('Error al buscar canales');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="search-page">
      <h1 className="page-title">Buscar Canales</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar canales por nombre..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? '⏳' : '🔍'} Buscar
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Buscando...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {searched && !loading && !error && results.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron resultados para "{query}"</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="results">
          <h2 className="results-title">
            Resultados ({results.length})
          </h2>
          <div className="results-grid">
            {results.map((channel, index) => (
              <div key={channel.id || index} className="result-card">
                <div className="result-avatar">
                  {channel.avatar ? (
                    <img src={channel.avatar} alt={channel.username} />
                  ) : (
                    <div className="placeholder-avatar">
                      <span>👤</span>
                    </div>
                  )}
                </div>
                <div className="result-info">
                  <h3 className="result-username">{channel.username || 'Canal'}</h3>
                  <p className="result-description">
                    {channel.description || 'Sin descripción'}
                  </p>
                  <div className="result-meta">
                    {channel.followers && (
                      <span className="followers">
                        ❤️ {channel.followers} seguidores
                      </span>
                    )}
                    {channel.is_live && (
                      <span className="live-indicator">🔴 En vivo</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searched && (
        <div className="search-tips">
          <h3>Consejos de búsqueda:</h3>
          <ul>
            <li>Escribe el nombre del canal que buscas</li>
            <li>Usa palabras clave relacionadas con el contenido</li>
            <li>La búsqueda no distingue mayúsculas y minúsculas</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Search;
