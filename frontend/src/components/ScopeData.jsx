import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './ScopeData.css';

function ScopeData({ scope, title, icon }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let result;
      switch (scope) {
        case 'user:read':
          result = await apiService.user.getProfile();
          break;
        case 'channel:read':
          result = await apiService.user.getChannel();
          break;
        case 'streamkey:read':
          result = await apiService.user.getStreamKey();
          break;
        default:
          result = { message: 'Scope data endpoint not yet implemented' };
      }
      setData(result);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded && !data && !loading) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  return (
    <div className="scope-card">
      <div className="scope-header" onClick={() => setExpanded(!expanded)}>
        <div className="scope-title">
          <span className="scope-icon">{icon}</span>
          <h3>{title}</h3>
          <span className="scope-badge">{scope}</span>
        </div>
        <button className="expand-btn">
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {expanded && (
        <div className="scope-content">
          {loading && <div className="loading">Loading...</div>}
          
          {error && (
            <div className="error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {data && !loading && (
            <div className="data-display">
              <button onClick={fetchData} className="refresh-btn">
                🔄 Refresh
              </button>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScopeData;
