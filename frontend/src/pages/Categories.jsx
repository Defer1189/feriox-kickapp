import { useEffect, useState } from 'react';
import { kickApi } from '../services/api';
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await kickApi.getCategories();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las categorías');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="categories-page">
      <h1 className="page-title">Categorías</h1>
      
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadCategories} className="retry-button">
            Reintentar
          </button>
        </div>
      )}
      
      {!loading && !error && categories.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron categorías</p>
        </div>
      )}
      
      {!loading && !error && categories.length > 0 && (
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={category.id || index} className="category-card">
              <div className="category-thumbnail">
                {category.thumbnail ? (
                  <img src={category.thumbnail} alt={category.name} />
                ) : (
                  <div className="placeholder-thumbnail">
                    <span>🎮</span>
                  </div>
                )}
              </div>
              <div className="category-info">
                <h3 className="category-name">{category.name || 'Categoría'}</h3>
                {category.viewers && (
                  <p className="category-viewers">
                    👥 {category.viewers.toLocaleString()} espectadores
                  </p>
                )}
                {category.channels && (
                  <p className="category-channels">
                    📺 {category.channels} canales
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;
