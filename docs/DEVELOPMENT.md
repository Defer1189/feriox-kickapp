# Guía de Desarrollo - FerIOX KICK App

## 🎯 Filosofía de Desarrollo

Este proyecto sigue principios de código limpio, arquitectura modular y seguridad por diseño.

### Principios Clave

1. **Modularidad**: Código organizado por responsabilidad y dominio
2. **Documentación**: JSDoc completo y comentarios significativos
3. **Seguridad**: Implementación de mejores prácticas desde el inicio
4. **Calidad**: ESLint y Prettier mantienen estándares consistentes
5. **Simplicidad**: Soluciones directas sobre abstracciones innecesarias

## 🛠️ Configuración del Entorno de Desarrollo

### Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Editor con soporte para ESLint y Prettier (VS Code recomendado)

### Instalación Inicial

```bash
# Clonar repositorio
git clone https://github.com/Defer1189/feriox-kickapp.git
cd feriox-kickapp

# Instalar dependencias
npm run install:all

# Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con tus credenciales
```

### Extensiones de VS Code Recomendadas

```json
{
    "recommendations": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "dsznajder.es7-react-js-snippets",
        "formulahendry.auto-rename-tag",
        "ritwickdey.liveserver"
    ]
}
```

## 📂 Estructura y Organización

### Backend (Express.js)

```
backend/
├── config/          # Configuración centralizada
├── controllers/     # Lógica de negocio
├── middlewares/     # Middlewares de Express
├── routes/          # Definición de rutas
├── services/        # Servicios (OAuth, API de KICK)
├── utils/           # Utilidades (PKCE, logging)
└── server.js        # Punto de entrada
```

**Convenciones**:
- Archivos terminan en `.js`
- Nombres descriptivos: `auth.controller.js`, `oauth.service.js`
- Un export por módulo (o export nombrado múltiple si relacionados)

### Frontend (React + Vite)

```
frontend/src/
├── components/      # Componentes reutilizables
│   └── layout/     # Layout components
├── context/         # Contextos de React
├── core/            # Configuración central
│   ├── api/        # Cliente HTTP
│   └── config/     # Config de la app
├── pages/           # Páginas de la aplicación
├── services/        # Servicios HTTP
├── App.jsx          # Componente principal
└── main.jsx         # Punto de entrada
```

**Convenciones**:
- Componentes en PascalCase: `Header.jsx`
- Hooks en camelCase con prefijo `use`: `useAuth.js`
- CSS junto al componente: `Header.jsx` + `Header.css`

## 🎨 Estándares de Código

### ESLint

Configuración en `.eslintrc.json`:

```json
{
    "rules": {
        "indent": ["error", 4],
        "quotes": ["error", "single"],
        "semi": ["error", "always"]
    }
}
```

**Comandos**:
```bash
# Ejecutar linter
npm run lint

# Corregir automáticamente
npm run lint:fix
```

### Prettier

Configuración en `.prettierrc.json`:

```json
{
    "semi": true,
    "singleQuote": true,
    "printWidth": 120,
    "tabWidth": 4
}
```

**Comandos**:
```bash
# Formatear todo el código
npm run format

# Verificar formato sin modificar
npm run format:check
```

### Git Hooks (Husky)

Pre-commit hook automático:
- Ejecuta `npm run lint:fix`
- Ejecuta `npm run format`
- Solo commitea si no hay errores

## 📝 Documentación de Código

### JSDoc para JavaScript

**Backend (servicios y controladores)**:

```javascript
/**
 * Intercambia el código de autorización por tokens de acceso
 * @async
 * @function exchangeCodeForTokens
 * @param {string} code - Código de autorización recibido del callback
 * @param {string} codeVerifier - Code verifier original usado en la autorización
 * @returns {Promise<Object>} Tokens de acceso y refresh
 * @throws {Error} Si falla el intercambio de tokens
 * @description Realiza la petición POST al endpoint de tokens de KICK
 * @example
 * const tokens = await exchangeCodeForTokens(code, verifier);
 * console.log(tokens.access_token);
 */
export async function exchangeCodeForTokens(code, codeVerifier) {
    // Implementación
}
```

**Frontend (componentes React)**:

```javascript
/**
 * @fileoverview Componente de Header
 * @module components/layout/Header
 * @author FerIOX
 */

/**
 * Componente Header
 * @component
 * @returns {JSX.Element} Header de la aplicación
 * @description Muestra el header con navegación y botones de auth
 * @example
 * <Header />
 */
function Header() {
    // Implementación
}
```

## 🔄 Flujo de Trabajo Git

### Branching Strategy

```
main            # Rama principal de producción
  ├── develop   # Rama de desarrollo
  │   ├── feature/nueva-funcionalidad
  │   ├── bugfix/corregir-error
  │   └── hotfix/parche-urgente
```

### Convención de Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato
<tipo>(<scope>): <descripción corta>

# Tipos
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Documentación
style:    Formato (sin cambios de código)
refactor: Refactorización
test:     Añadir o modificar tests
chore:    Tareas de mantenimiento
```

**Ejemplos**:
```bash
git commit -m "feat(auth): implementar refresh token rotation"
git commit -m "fix(oauth): corregir validación de state en callback"
git commit -m "docs: actualizar guía de instalación"
git commit -m "refactor(backend): modularizar rutas de autenticación"
```

### Pull Requests

**Checklist antes de crear PR**:
- [ ] Código linted (`npm run lint`)
- [ ] Código formateado (`npm run format`)
- [ ] Tests pasan (si existen)
- [ ] Documentación actualizada
- [ ] Commits siguiendo convención
- [ ] PR describe cambios claramente

**Template de PR**:
```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Nueva funcionalidad
- [ ] Corrección de bug
- [ ] Refactorización
- [ ] Documentación

## Testing
Cómo se probaron los cambios

## Screenshots (si aplica)
```

## 🧪 Testing (Futuro)

### Backend

```bash
# Tests unitarios con Jest
npm test

# Coverage
npm run test:coverage

# Tests de integración
npm run test:integration
```

**Estructura de tests**:
```javascript
describe('OAuth Service', () => {
    describe('prepareOAuthFlow', () => {
        it('debe generar code_verifier de 128 caracteres', () => {
            const { codeVerifier } = prepareOAuthFlow();
            expect(codeVerifier).toHaveLength(128);
        });

        it('debe generar code_challenge válido', () => {
            const { codeChallenge } = prepareOAuthFlow();
            expect(codeChallenge).toMatch(/^[A-Za-z0-9_-]+$/);
        });
    });
});
```

### Frontend

```bash
# Tests con React Testing Library
npm test

# Tests E2E con Playwright
npm run test:e2e
```

## 🚀 Despliegue

### Build de Producción

```bash
# Backend (no requiere build)
cd backend
NODE_ENV=production node server.js

# Frontend
cd frontend
npm run build
# Archivos en /dist
```

### Variables de Entorno

**Desarrollo**:
```env
NODE_ENV=development
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

**Producción**:
```env
NODE_ENV=production
BACKEND_URL=https://api.tudominio.com
FRONTEND_URL=https://tudominio.com
KICK_REDIRECT_URI=https://api.tudominio.com/api/auth/callback
```

## 📊 Debugging

### Backend

**VS Code launch.json**:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug Backend",
            "program": "${workspaceFolder}/backend/server.js",
            "envFile": "${workspaceFolder}/backend/.env",
            "console": "integratedTerminal"
        }
    ]
}
```

**Logs de debug**:
```javascript
import * as logger from './utils/logger.js';

logger.debug('Mensaje de debug');
logger.info('Mensaje informativo');
logger.warn('Advertencia');
logger.error('Error', error);
```

### Frontend

**React DevTools**:
- Inspeccionar componentes
- Ver props y state
- Analizar performance

**Network Tab**:
- Ver peticiones HTTP
- Verificar headers y cookies
- Debug de errores de API

## 🔧 Solución de Problemas Comunes

### "Cannot find module"

```bash
# Limpiar e instalar
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

### ESLint reporta errores después de pull

```bash
# Reinstalar dependencias de ESLint
npm install eslint eslint-plugin-react --save-dev
```

### Puerto en uso

```bash
# Buscar proceso
lsof -ti:3000
# Matar proceso
kill -9 <PID>
```

### CORS errors

Verificar que `FRONTEND_URL` en backend/.env coincida con la URL del frontend.

## 📚 Recursos para Contribuidores

### Documentación Interna

- [Documentación Técnica](./TECHNICAL_DOCUMENTATION.md)
- [Guía de Instalación](./INSTALLATION.md)
- [Seguridad](./SECURITY.md)
- [API Documentation](./API_DOCUMENTATION.md)

### Recursos Externos

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [KICK Dev Docs](https://dev.kick.com)
- [OAuth 2.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1)

## 🤝 Contribuir

### Proceso

1. **Fork** el repositorio
2. **Crea** una branch para tu feature
3. **Commit** tus cambios
4. **Push** a tu fork
5. **Abre** un Pull Request

### Código de Conducta

- Ser respetuoso y profesional
- Aceptar críticas constructivas
- Enfocarse en lo mejor para el proyecto
- Ayudar a otros contribuidores

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/Defer1189/feriox-kickapp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Defer1189/feriox-kickapp/discussions)
- **Email**: contact@feriox.com (placeholder)

## 📅 Roadmap

### Próximas Funcionalidades

- [ ] Tests unitarios e integración
- [ ] Implementación de webhooks de KICK
- [ ] Dashboard con estadísticas en tiempo real
- [ ] Sistema de notificaciones
- [ ] Refresh token rotation
- [ ] Docker y Docker Compose
- [ ] CI/CD con GitHub Actions
- [ ] Soporte para TypeScript

## ⚡ Tips de Productividad

### Scripts Útiles

```bash
# Desarrollo de ambos (backend + frontend)
npm run dev

# Solo backend
npm run dev:backend

# Solo frontend
npm run dev:frontend

# Instalar todo
npm run install:all

# Build frontend
npm run build
```

### Shortcuts de VS Code

- `Ctrl+Shift+F`: Buscar en todos los archivos
- `Ctrl+P`: Quick open de archivos
- `F12`: Ir a definición
- `Alt+Shift+F`: Formatear documento
- `Ctrl+.`: Quick fix de ESLint

### Alias de Git (opcional)

```bash
# Añadir a ~/.gitconfig
[alias]
    st = status
    co = checkout
    br = branch
    cm = commit -m
    pl = pull
    ps = push
```

## 🎓 Aprendizaje Continuo

- Lee el código existente para entender patrones
- Revisa PRs de otros para aprender diferentes enfoques
- Mantente actualizado con las últimas versiones de dependencias
- Experimenta con nuevas features en branches separadas

¡Gracias por contribuir a FerIOX KICK App! 🚀
