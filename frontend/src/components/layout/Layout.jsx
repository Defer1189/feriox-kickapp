/**
 * @fileoverview Componente de Layout principal
 * @module components/layout/Layout
 * @author FerIOX
 * @description Layout principal de la aplicación con Header y Footer
 */

import PropTypes from 'prop-types';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './Layout.css';

/**
 * Componente Layout
 * @component
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Layout de la aplicación
 * @description Envuelve el contenido con Header y Footer
 * @example
 * <Layout>
 *   <YourPage />
 * </Layout>
 */
function Layout({ children }) {
    return (
        <div className="layout">
            <Header />
            <main className="main-content">{children}</main>
            <Footer />
        </div>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
