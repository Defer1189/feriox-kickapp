import './Header.css';

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <h1>🚀 FerIOX KICK App</h1>
        </div>
        {user && (
          <div className="header-user">
            <span className="user-info">
              👤 {user.username || user.email || 'User'}
            </span>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
