# FerIOX Kick App - Documentación Técnica

## Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Backend - Express.js](#backend)
3. [Frontend - React + Vite](#frontend)
4. [OAuth 2.1 con PKCE](#oauth-21-con-pkce)
5. [Configuración](#configuración)
6. [Despliegue](#despliegue)
7. [Seguridad](#seguridad)

## Arquitectura del Sistema

### Estructura del Proyecto

```
feriox-kickapp/
├── backend/               # Servidor Express.js
│   ├── server.js         # Archivo principal del servidor
│   ├── package.json      # Dependencias del backend
│   ├── .env.example      # Variables de entorno de ejemplo
│   ├── eslint.config.js  # Configuración de ESLint
│   └── .prettierrc       # Configuración de Prettier
├── frontend/             # Aplicación React + Vite
│   ├── src/
│   │   ├── contexts/     # Contextos de React
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── App.jsx       # Componente principal
│   │   └── main.jsx      # Punto de entrada
│   ├── vite.config.js    # Configuración de Vite
│   └── package.json      # Dependencias del frontend
├── docs/                 # Documentación del proyecto
└── package.json          # Scripts del monorepo
```

### Diagrama de Flujo

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Cliente   │◄───────►│   Backend    │◄───────►│  KICK API   │
│  (React)    │  REST   │  (Express)   │  OAuth  │             │
└─────────────┘  API    └──────────────┘  2.1    └─────────────┘
```

## Backend

### Tecnologías

- **Node.js** v18+
- **Express.js** 4.x - Framework web
- **Axios** - Cliente HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Seguridad HTTP headers
- **cookie-parser** - Manejo de cookies
- **dotenv** - Variables de entorno

### Endpoints Principales

#### Autenticación

| Método | Endpoint              | Descripción                          | Protegido |
|--------|----------------------|--------------------------------------|-----------|
| GET    | `/api/auth/login`    | Inicia el flujo OAuth                | No        |
| GET    | `/api/auth/callback` | Callback de OAuth                    | No        |
| GET    | `/api/auth/user`     | Obtiene datos del usuario            | Sí        |
| POST   | `/api/auth/logout`   | Cierra la sesión                     | Sí        |
| GET    | `/api/auth/config`   | Verifica configuración OAuth         | No        |
| GET    | `/api/auth/debug`    | Información de debug de la sesión    | No        |

#### Sistema

| Método | Endpoint      | Descripción              |
|--------|--------------|--------------------------|
| GET    | `/api/health`| Verifica estado del servidor |
| GET    | `/api`       | Información del servicio |

### Variables de Entorno

Crea un archivo `.env` en el directorio `backend/`:

```env
# Configuración del Servidor
NODE_ENV=development
PORT=3000
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Credenciales KICK API
KICK_CLIENT_ID=tu_client_id_aqui
KICK_CLIENT_SECRET=tu_client_secret_aqui
KICK_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Configuraciones de Seguridad
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=un_secreto_largo_y_aleatorio_para_firmar_cookies
HELMET_ENABLED=true

# Logging
LOG_LEVEL=debug
```

### Configuración de Seguridad

El backend implementa múltiples capas de seguridad:

1. **Helmet** - Headers de seguridad HTTP
2. **CORS** - Control de acceso entre orígenes
3. **Cookies httpOnly** - Tokens almacenados de forma segura
4. **Signed Cookies** - Cookies firmadas para prevenir manipulación
5. **PKCE** - Proof Key for Code Exchange
6. **State Parameter** - Protección contra CSRF

## Frontend

### Tecnologías

- **React** 19.x - Librería UI
- **Vite** 7.x - Build tool y dev server
- **React Router DOM** 7.x - Enrutamiento
- **Axios** - Cliente HTTP
- **ESLint** - Linter
- **Prettier** - Formateador de código

### Estructura de Componentes

```
src/
├── contexts/
│   └── AuthContext.jsx        # Contexto de autenticación
├── components/
│   └── ProtectedRoute.jsx     # Componente de ruta protegida
├── pages/
│   ├── Login.jsx              # Página de login
│   ├── Login.css              # Estilos de login
│   ├── Dashboard.jsx          # Página del dashboard
│   └── Dashboard.css          # Estilos del dashboard
├── App.jsx                    # Componente raíz
├── App.css                    # Estilos globales de App
├── main.jsx                   # Punto de entrada
└── index.css                  # Estilos globales
```

### Rutas

| Ruta          | Componente  | Protegida | Descripción                |
|--------------|-------------|-----------|----------------------------|
| `/`          | Login       | No        | Página de inicio de sesión |
| `/dashboard` | Dashboard   | Sí        | Dashboard del usuario      |

### Proxy de Vite

El frontend está configurado para hacer proxy de todas las peticiones a `/api` al backend:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

## OAuth 2.1 con PKCE

### Flujo de Autenticación

1. **Usuario inicia login** → Click en botón "Iniciar Sesión con KICK"
2. **Frontend redirige** → `GET /api/auth/login`
3. **Backend genera PKCE**:
   - `code_verifier` - String aleatorio
   - `code_challenge` - Hash SHA256 del verifier
   - `state` - Token anti-CSRF
4. **Backend guarda en cookies**:
   - `kick_code_verifier` (httpOnly, signed)
   - `kick_oauth_state` (httpOnly, signed)
5. **Backend redirige a KICK** → Usuario autoriza en KICK
6. **KICK redirige al callback** → `GET /api/auth/callback?code=...&state=...`
7. **Backend valida state** → Previene CSRF
8. **Backend intercambia código**:
   - Envía `code` + `code_verifier` a KICK
   - Recibe `access_token` y `refresh_token`
9. **Backend guarda tokens en cookies**:
   - `kick_access_token` (httpOnly, secure)
   - `kick_refresh_token` (httpOnly, secure)
10. **Backend redirige al dashboard** → `GET /dashboard?auth=success`
11. **Frontend verifica autenticación** → `GET /api/auth/user`
12. **Backend usa access_token** → Obtiene datos del usuario de KICK API

### Parámetros PKCE

```javascript
// Code Verifier: String aleatorio de 128 caracteres
const code_verifier = crypto.randomBytes(64).toString('hex');

// Code Challenge: SHA256 hash del verifier en base64url
const code_challenge = crypto
  .createHash('sha256')
  .update(code_verifier)
  .digest('base64url');

// Método de challenge
const code_challenge_method = 'S256';
```

### Scopes Solicitados

```javascript
const scopes = [
  'user:read',          // Leer información del usuario
  'channel:read',       // Leer información del canal
  'channel:write',      // Escribir en el canal
  'chat:write',         // Escribir en el chat
  'streamkey:read',     // Leer stream key
  'events:subscribe',   // Suscribirse a eventos
  'moderation:ban',     // Moderar usuarios
];
```

## Configuración

### Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/Defer1189/feriox-kickapp.git
cd feriox-kickapp
```

2. **Instalar todas las dependencias**:
```bash
npm run install:all
```

3. **Configurar variables de entorno**:
```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales de KICK Dev
```

4. **Registrar aplicación en KICK Dev**:
   - Visita https://dev.kick.com/
   - Crea una nueva aplicación
   - Configura el Redirect URI: `http://localhost:3000/api/auth/callback`
   - Copia el Client ID y Client Secret al archivo `.env`

### Desarrollo

**Terminal 1 - Backend**:
```bash
npm run dev:backend
```

**Terminal 2 - Frontend**:
```bash
npm run dev:frontend
```

El backend estará disponible en http://localhost:3000
El frontend estará disponible en http://localhost:5173

## Despliegue

### Producción

1. **Backend**:
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

2. **Frontend**:
```bash
cd frontend
npm run build
# Los archivos estarán en frontend/dist/
```

### Variables de Entorno en Producción

Asegúrate de actualizar las siguientes variables:

```env
NODE_ENV=production
BACKEND_URL=https://tu-dominio.com
FRONTEND_URL=https://tu-frontend.com
KICK_REDIRECT_URI=https://tu-dominio.com/api/auth/callback
CORS_ORIGIN=https://tu-frontend.com
```

## Seguridad

### Mejores Prácticas Implementadas

1. **Cookies httpOnly**: Los tokens no son accesibles desde JavaScript
2. **Cookies Signed**: Las cookies están firmadas para prevenir manipulación
3. **PKCE**: Protege contra ataques de intercepción de código
4. **State Parameter**: Previene ataques CSRF
5. **CORS**: Configurado para aceptar solo el origen del frontend
6. **Helmet**: Headers de seguridad HTTP configurados
7. **Timeouts**: Todas las peticiones tienen timeout
8. **Validación**: Validación de todos los parámetros en el backend

### Consideraciones de Seguridad

- **Nunca** expongas el `CLIENT_SECRET` en el frontend
- **Usa HTTPS** en producción
- **Rota** el `SESSION_SECRET` regularmente
- **Monitorea** los logs para detectar actividad sospechosa
- **Actualiza** las dependencias regularmente

### OWASP Top 10

Este proyecto implementa protecciones contra:

- A01:2021 – Broken Access Control
- A02:2021 – Cryptographic Failures
- A03:2021 – Injection
- A05:2021 – Security Misconfiguration
- A07:2021 – Identification and Authentication Failures

## Calidad de Código

### ESLint

Backend y frontend configurados con ESLint para mantener consistencia en el código.

```bash
# Verificar código
npm run lint

# Auto-fix problemas
npm run lint:fix
```

### Prettier

Formateador de código configurado para mantener estilo consistente.

```bash
npm run format
```

### JSDoc

El backend incluye documentación JSDoc en todas las funciones principales.

## Soporte

Para reportar problemas o solicitar características:
- GitHub Issues: https://github.com/Defer1189/feriox-kickapp/issues

## Licencia

MIT License - Ver [LICENSE](../LICENSE) para más detalles.

---

**Desarrollado por FerIOX** 🚀
