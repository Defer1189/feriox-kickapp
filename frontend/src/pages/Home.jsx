import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to FerIOX KICK API Integration</h1>
        <p className="hero-subtitle">
          A full-stack application for secure integration with KICK streaming platform
        </p>
        
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure OAuth2</h3>
            <p>Industry-standard authentication with KICK API</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Complete Scopes</h3>
            <p>Access user, channel, chat, and moderation data</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Modern Stack</h3>
            <p>React + Vite frontend, Express.js backend</p>
          </div>
        </div>

        <div className="cta">
          <p>Click "Login with KICK" in the header to get started</p>
        </div>
      </div>

      <div className="info-section">
        <h2>Available Scopes</h2>
        <div className="scopes-grid">
          <div className="scope-item">
            <strong>user:read</strong>
            <span>Read user profile data</span>
          </div>
          <div className="scope-item">
            <strong>channel:read</strong>
            <span>Read channel information</span>
          </div>
          <div className="scope-item">
            <strong>channel:write</strong>
            <span>Modify channel settings</span>
          </div>
          <div className="scope-item">
            <strong>chat:write</strong>
            <span>Send chat messages</span>
          </div>
          <div className="scope-item">
            <strong>streamkey:read</strong>
            <span>Access stream key</span>
          </div>
          <div className="scope-item">
            <strong>events:subscribe</strong>
            <span>Subscribe to events</span>
          </div>
          <div className="scope-item">
            <strong>moderation:ban</strong>
            <span>Moderation capabilities</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
