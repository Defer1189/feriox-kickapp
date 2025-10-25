/**
 * @fileoverview Componente de Footer
 * @module components/layout/Footer
 * @author FerIOX
 * @description Footer de la aplicación
 */

import './Footer.css';

/**
 * Componente Footer
 * @component
 * @returns {JSX.Element} Footer de la aplicación
 * @description Muestra el footer con información y enlaces
 * @example
 * <Footer />
 */
function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>FerIOX KICK App</h3>
                        <p>Integración segura con KICK API mediante OAuth 2.1</p>
                    </div>

                    <div className="footer-section">
                        <h4>Enlaces</h4>
                        <ul>
                            <li>
                                <a href="https://github.com/Defer1189/feriox-kickapp" target="_blank" rel="noopener noreferrer">
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a href="https://kick.com/feriox" target="_blank" rel="noopener noreferrer">
                                    KICK Channel
                                </a>
                            </li>
                            <li>
                                <a href="https://dev.kick.com" target="_blank" rel="noopener noreferrer">
                                    KICK Dev
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Recursos</h4>
                        <ul>
                            <li>
                                <a href="/api/docs" target="_blank" rel="noopener noreferrer">
                                    API Docs
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/Defer1189/feriox-kickapp/blob/main/README.md" target="_blank" rel="noopener noreferrer">
                                    Documentación
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} FerIOX. Todos los derechos reservados.</p>
                    <p className="footer-tagline">Escalado Horizontal, Ambición Vertical</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
