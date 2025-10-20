import { useEffect, useState } from 'react';
import { kickApi } from '../services/api';
import './Home.css';

function Home() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await kickApi.healthCheck();
        setHealth(data);
        setLoading(false);
      } catch {
        setError('Error al conectar con el servidor');
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">Bienvenido a FerIOX KICK</h1>
        <p className="hero-subtitle">
          Explora canales de streaming, búsqueda en tiempo real y mucho más
        </p>
        
        {loading && <p className="status-message">Conectando...</p>}
        
        {error && <p className="status-message error">{error}</p>}
        
        {health && (
          <div className="status-card">
            <div className="status-indicator active"></div>
            <p className="status-text">Servidor activo</p>
            <p className="status-detail">Uptime: {Math.floor(health.uptime)} segundos</p>
          </div>
        )}
      </section>

      <section className="features">
        <h2 className="features-title">Características</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📺</div>
            <h3>Canales en Vivo</h3>
            <p>Explora los mejores streamers en vivo de KICK</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Búsqueda Avanzada</h3>
            <p>Encuentra tus canales favoritos al instante</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Categorías</h3>
            <p>Navega por categorías de juegos y contenido</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Información en Tiempo Real</h3>
            <p>Datos actualizados de la API de KICK</p>
          </div>
        </div>
      </section>

      <section className="getting-started">
        <h2>Comenzar</h2>
        <p>Usa el menú de navegación para explorar las diferentes secciones:</p>
        <ul className="info-list">
          <li><strong>En Vivo:</strong> Ve los canales que están transmitiendo ahora</li>
          <li><strong>Buscar:</strong> Encuentra canales específicos por nombre</li>
          <li><strong>Categorías:</strong> Explora contenido por categoría</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
