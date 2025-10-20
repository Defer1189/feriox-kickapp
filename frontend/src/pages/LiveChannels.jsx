import { useEffect, useState, useCallback } from 'react';
import { kickApi } from '../services/api';
import './LiveChannels.css';

function LiveChannels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const loadChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await kickApi.getLiveChannels(page, 25);
      setChannels(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los canales en vivo');
      setLoading(false);
      console.error(err);
    }
  }, [page]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  return (
    <div className="live-channels">
      <h1 className="page-title">Canales en Vivo</h1>
      
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando canales...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadChannels} className="retry-button">
            Reintentar
          </button>
        </div>
      )}
      
      {!loading && !error && channels.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron canales en vivo</p>
        </div>
      )}
      
      {!loading && !error && channels.length > 0 && (
        <>
          <div className="channels-grid">
            {channels.map((channel, index) => (
              <div key={channel.id || index} className="channel-card">
                <div className="channel-thumbnail">
                  {channel.thumbnail ? (
                    <img src={channel.thumbnail} alt={channel.username} />
                  ) : (
                    <div className="placeholder-thumbnail">
                      <span>📺</span>
                    </div>
                  )}
                  <div className="live-badge">🔴 EN VIVO</div>
                </div>
                <div className="channel-info">
                  <h3 className="channel-username">{channel.username || 'Canal'}</h3>
                  <p className="channel-title">{channel.title || 'Sin título'}</p>
                  <div className="channel-meta">
                    <span className="viewers">
                      👥 {channel.viewers || 0} espectadores
                    </span>
                    {channel.category && (
                      <span className="category">{channel.category}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pagination">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="pagination-button"
            >
              ← Anterior
            </button>
            <span className="page-info">Página {page}</span>
            <button 
              onClick={() => setPage(p => p + 1)}
              className="pagination-button"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LiveChannels;
