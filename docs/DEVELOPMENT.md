# Guía de Desarrollo - FerIOX Kick App

## Índice

1. [Entorno de Desarrollo](#entorno-de-desarrollo)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Flujo de Trabajo Git](#flujo-de-trabajo-git)
4. [Estándares de Código](#estándares-de-código)
5. [Testing](#testing)
6. [Debugging](#debugging)
7. [Mejores Prácticas](#mejores-prácticas)

---

## Entorno de Desarrollo

### Configuración del IDE

#### Visual Studio Code (Recomendado)

**Extensiones Recomendadas:**

```json
{
    "recommendations": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss",
        "dsznajder.es7-react-js-snippets",
        "christian-kohler.path-intellisense",
        "eamodio.gitlens"
    ]
}
```

**Configuración de Workspace (.vscode/settings.json):**

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.validate": ["javascript", "javascriptreact"],
    "files.eol": "\n",
    "files.insertFinalNewline": true,
    "files.trimTrailingWhitespace": true
}
```

### Scripts de Desarrollo

```bash
# Iniciar backend en modo desarrollo (con nodemon)
npm run dev:backend

# Iniciar frontend en modo desarrollo (con Vite HMR)
npm run dev:frontend

# Ejecutar linter
npm run lint

# Ejecutar linter y corregir automáticamente
npm run lint:fix

# Formatear código con Prettier
npm run format

# Verificar formato sin modificar archivos
npm run format:check
```

---

## Estructura del Proyecto

```
feriox-kickapp/
├── .eslintrc.json          # Configuración de ESLint para todo el proyecto
├── .prettierrc.json        # Configuración de Prettier
├── .prettierignore         # Archivos ignorados por Prettier
├── .gitignore              # Archivos ignorados por Git
├── package.json            # Dependencias y scripts del monorepo
├── README.md               # Documentación principal
├── LICENSE                 # Licencia MIT
│
├── backend/                # Servidor Express.js
│   ├── server.js           # Punto de entrada del servidor
│   ├── swagger.js          # Configuración de Swagger
│   ├── package.json        # Dependencias del backend
│   ├── .env.example        # Ejemplo de variables de entorno
│   └── .env                # Variables de entorno (no versionado)
│
├── frontend/               # Aplicación React + Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/        # Contextos de React
│   │   │   └── AuthContext.jsx
│   │   ├── pages/          # Páginas de la aplicación
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   ├── assets/         # Recursos estáticos (imágenes, etc.)
│   │   ├── App.jsx         # Componente principal
│   │   ├── main.jsx        # Punto de entrada
│   │   └── index.css       # Estilos globales
│   ├── public/             # Archivos públicos estáticos
│   ├── index.html          # HTML principal
│   ├── vite.config.js      # Configuración de Vite
│   ├── eslint.config.js    # Configuración de ESLint para frontend
│   └── package.json        # Dependencias del frontend
│
└── docs/                   # Documentación
    ├── TECHNICAL_DOCUMENTATION.md
    ├── INSTALLATION.md
    └── DEVELOPMENT.md      # Este archivo
```

---

## Flujo de Trabajo Git

### Branching Strategy

```
main (producción)
  └── develop (desarrollo)
      ├── feature/nueva-funcionalidad
      ├── bugfix/corregir-error
      └── hotfix/arreglo-urgente
```

### Crear una Nueva Feature

```bash
# Asegurarte de estar en develop
git checkout develop
git pull origin develop

# Crear una nueva branch para la feature
git checkout -b feature/nombre-de-la-feature

# Hacer cambios y commits
git add .
git commit -m "feat: descripción de la feature"

# Subir la branch
git push -u origin feature/nombre-de-la-feature

# Crear Pull Request en GitHub
```

### Convención de Commits

Seguimos la convención de [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature
git commit -m "feat: agregar nuevo endpoint de webhooks"

# Fix
git commit -m "fix: corregir validación de state en OAuth"

# Documentation
git commit -m "docs: actualizar README con instrucciones de instalación"

# Refactor
git commit -m "refactor: mejorar estructura de AuthContext"

# Style
git commit -m "style: aplicar formato Prettier a todos los archivos"

# Test
git commit -m "test: agregar tests para componente Dashboard"

# Chore
git commit -m "chore: actualizar dependencias"
```

---

## Estándares de Código

### JavaScript/React

#### 1. Usar ES6+ Features

```javascript
// ✅ Correcto
const handleClick = () => {
    console.log('Click');
};

// ❌ Incorrecto
var handleClick = function () {
    console.log('Click');
};
```

#### 2. Destructuring

```javascript
// ✅ Correcto
const { user, loading } = useAuth();

// ❌ Incorrecto
const user = useAuth().user;
const loading = useAuth().loading;
```

#### 3. Arrow Functions

```javascript
// ✅ Correcto
const getUser = async () => {
    const response = await fetch('/api/auth/user');
    return response.json();
};

// ❌ Incorrecto
function getUser() {
    return fetch('/api/auth/user').then((response) => response.json());
}
```

#### 4. Template Literals

```javascript
// ✅ Correcto
const message = `Bienvenido ${user.name}`;

// ❌ Incorrecto
const message = 'Bienvenido ' + user.name;
```

### JSDoc

Todos los archivos, funciones y componentes deben tener documentación JSDoc:

```javascript
/**
 * Componente de dashboard protegido
 * Muestra información del usuario autenticado
 * @component
 * @returns {JSX.Element} Componente Dashboard
 */
const Dashboard = () => {
    // ...
};

/**
 * Hook personalizado para autenticación
 * @returns {Object} Estado y métodos de autenticación
 * @throws {Error} Si se usa fuera de AuthProvider
 */
export const useAuth = () => {
    // ...
};
```

### CSS

#### 1. BEM para Nombres de Clases (opcional pero recomendado)

```css
/* Block */
.dashboard-container {
}

/* Element */
.dashboard-container__header {
}
.dashboard-container__content {
}

/* Modifier */
.dashboard-container--loading {
}
```

#### 2. Variables CSS

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --text-color: #333;
}

.button {
    background: var(--primary-color);
    color: white;
}
```

---

## Testing

### Backend Testing

```bash
cd backend
npm test
```

**Ejemplo de test con Node.js test runner:**

```javascript
import { test } from 'node:test';
import assert from 'node:assert';

test('generateCodeVerifier returns 128 character string', () => {
    const verifier = generateCodeVerifier();
    assert.strictEqual(verifier.length, 128);
});

test('generateCodeChallenge returns base64url string', () => {
    const verifier = 'test-verifier';
    const challenge = generateCodeChallenge(verifier);
    assert.match(challenge, /^[A-Za-z0-9_-]+$/);
});
```

### Frontend Testing (Futuro)

```bash
cd frontend
npm test
```

---

## Debugging

### Backend Debugging

#### 1. Usando console.log

```javascript
console.log('🔐 URL de autorización generada:', authUrl);
console.log('✅ Token obtenido exitosamente');
console.error('❌ Error en callback OAuth:', error);
```

#### 2. Usando el endpoint /api/auth/debug

```bash
curl http://localhost:3000/api/auth/debug
```

#### 3. Usando Node.js Inspector

```bash
# Iniciar con inspector
node --inspect server.js

# O con nodemon
nodemon --inspect server.js

# Conectar con Chrome DevTools
# chrome://inspect
```

### Frontend Debugging

#### 1. React DevTools

Instala la extensión React DevTools para Chrome o Firefox.

#### 2. Console Logging

```javascript
const AuthProvider = ({ children }) => {
    console.log('AuthProvider rendering');

    const checkAuth = async () => {
        console.log('Checking authentication...');
        // ...
    };

    // ...
};
```

#### 3. Vite Inspector

Vite muestra errores detallados en el navegador durante el desarrollo.

### Network Debugging

#### 1. Chrome DevTools Network Tab

- Abre DevTools (F12)
- Ve a la pestaña Network
- Filtra por "Fetch/XHR" para ver las llamadas API

#### 2. Verificar Cookies

- DevTools → Application → Cookies
- Verifica que las cookies `kick_access_token` y `kick_refresh_token` estén presentes

---

## Mejores Prácticas

### 1. Nunca Commitear Credenciales

```bash
# ❌ NUNCA hacer esto
git add backend/.env
git commit -m "Agregar configuración"

# ✅ Usar .env.example en su lugar
git add backend/.env.example
git commit -m "Actualizar ejemplo de configuración"
```

### 2. Manejar Errores Apropiadamente

```javascript
// ✅ Correcto
try {
    const response = await axios.get('/api/auth/user');
    setUser(response.data);
} catch (error) {
    console.error('Error fetching user:', error);
    setError('No se pudo obtener la información del usuario');
}

// ❌ Incorrecto
const response = await axios.get('/api/auth/user');
setUser(response.data);
```

### 3. Validar Inputs

```javascript
// ✅ Correcto
if (!code || !state) {
    return res.status(400).json({ error: 'Missing required parameters' });
}

// ❌ Incorrecto
// Asumir que los parámetros siempre existen
```

### 4. Usar Environment Variables

```javascript
// ✅ Correcto
const PORT = process.env.PORT || 3000;

// ❌ Incorrecto
const PORT = 3000;
```

### 5. Separar Lógica de Presentación

```javascript
// ✅ Correcto - Custom Hook
const useUserData = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    return { user };
};

// Componente solo se encarga de renderizar
const Dashboard = () => {
    const { user } = useUserData();
    return <div>{user?.name}</div>;
};

// ❌ Incorrecto - Todo en el componente
const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/auth/user')
            .then((res) => res.json())
            .then((data) => setUser(data));
    }, []);

    return <div>{user?.name}</div>;
};
```

### 6. Documentar Funciones Complejas

```javascript
/**
 * Genera un code challenge usando PKCE (SHA256)
 * @param {string} verifier - Code verifier original (128 caracteres)
 * @returns {string} Code challenge en formato base64url
 * @example
 * const verifier = generateCodeVerifier();
 * const challenge = generateCodeChallenge(verifier);
 * // challenge = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"
 */
function generateCodeChallenge(verifier) {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
}
```

### 7. Usar PropTypes o TypeScript (Futuro)

```javascript
// Si decides usar PropTypes
import PropTypes from 'prop-types';

Dashboard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
};
```

---

## Comandos Útiles

### Linting y Formato

```bash
# Ejecutar ESLint en todo el proyecto
npm run lint

# Ejecutar ESLint y corregir automáticamente
npm run lint:fix

# Formatear todo el código con Prettier
npm run format

# Verificar formato sin modificar
npm run format:check
```

### Dependencias

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar dependencias (con cuidado)
npm update

# Auditar vulnerabilidades
npm audit

# Corregir vulnerabilidades automáticamente
npm audit fix
```

### Git

```bash
# Ver estado
git status

# Ver diferencias
git diff

# Ver log resumido
git log --oneline --graph --all

# Revertir cambios no commiteados
git checkout -- archivo.js

# Deshacer último commit (manteniendo cambios)
git reset --soft HEAD~1
```

---

## Recursos para Desarrolladores

### Documentación Oficial

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Documentation](https://reactrouter.com/)

### OAuth y Seguridad

- [OAuth 2.1 Specification](https://oauth.net/2.1/)
- [PKCE RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Herramientas

- [Postman](https://www.postman.com/) - Testing de APIs
- [Insomnia](https://insomnia.rest/) - Cliente REST alternativo
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - API de prueba

---

## Próximos Pasos

1. **Agregar Tests:**
    - Tests unitarios para funciones helper
    - Tests de integración para endpoints
    - Tests de componentes React

2. **Mejorar Seguridad:**
    - Rate limiting
    - Input sanitization
    - CSRF tokens adicionales

3. **Performance:**
    - Caching con Redis
    - Code splitting en frontend
    - Lazy loading de componentes

4. **Features Adicionales:**
    - Refresh token rotation
    - Webhooks de KICK
    - Dashboard con estadísticas en tiempo real

---

**¡Happy Coding!** 🚀
