import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎮</span>
          <span className="logo-text">FerIOX KICK</span>
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Inicio</Link>
          </li>
          <li className="navbar-item">
            <Link to="/live" className="navbar-link">En Vivo</Link>
          </li>
          <li className="navbar-item">
            <Link to="/search" className="navbar-link">Buscar</Link>
          </li>
          <li className="navbar-item">
            <Link to="/categories" className="navbar-link">Categorías</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
