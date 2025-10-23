# Documentación Técnica - FerIOX Kick App

## Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Configuración del Entorno](#configuración-del-entorno)
4. [Backend](#backend)
5. [Frontend](#frontend)
6. [Flujo de Autenticación OAuth 2.1](#flujo-de-autenticación-oauth-21)
7. [Seguridad](#seguridad)
8. [API Endpoints](#api-endpoints)
9. [Scopes de KICK](#scopes-de-kick)
10. [Despliegue](#despliegue)

---

## Descripción General

FerIOX Kick App es una aplicación full-stack que permite la integración segura con la API de KICK mediante OAuth 2.1 con PKCE (Proof Key for Code Exchange).

### Características Principales
- ✅ Autenticación OAuth 2.1 con PKCE y validación de estado
- ✅ Backend con Express.js y mejores prácticas de seguridad
- ✅ Frontend React + Vite con React Router DOM
- ✅ Gestión segura de tokens mediante cookies httpOnly
- ✅ Arquitectura de monorepo con separación clara de responsabilidades
- ✅ Documentación completa con JSDoc y Swagger

### Tecnologías Utilizadas

#### Backend
- Node.js (>= 18.0.0)
- Express.js 4.21.2
- Axios 1.12.2
- CORS 2.8.5
- Helmet 8.1.0
- Cookie-parser 1.4.7
- dotenv 17.2.3

#### Frontend
- React 19.1.1
- Vite (rolldown-vite)
- React Router DOM 7.9.4
- Axios 1.12.2

#### Herramientas de Desarrollo
- ESLint 8.57.0
- Prettier 3.2.5
- Nodemon 3.1.10

---

## Arquitectura

La aplicación sigue una arquitectura de monorepo con separación clara entre frontend y backend:

```
feriox-kickapp/
├── backend/              # Servidor Express.js
│   ├── server.js         # Punto de entrada del servidor
│   ├── package.json      # Dependencias del backend
│   └── .env.example      # Variables de entorno de ejemplo
├── frontend/             # Aplicación React + Vite
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── context/      # Contextos de React (AuthContext)
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── App.jsx       # Componente principal
│   │   └── main.jsx      # Punto de entrada
│   ├── vite.config.js    # Configuración de Vite
│   └── package.json      # Dependencias del frontend
├── docs/                 # Documentación
├── .eslintrc.json        # Configuración de ESLint
├── .prettierrc.json      # Configuración de Prettier
├── package.json          # Scripts del monorepo
└── README.md             # Documentación principal
```

### Flujo de Comunicación

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   Usuario   │  ────▶  │   Frontend   │  ────▶  │  Backend   │
│  (Browser)  │         │ (React+Vite) │         │ (Express)  │
└─────────────┘         └──────────────┘         └────────────┘
                              │                         │
                              │  Proxy /api/*           │
                              │  localhost:5173         │  OAuth
                              └────────────────────────▶│  
                                                        │
                                                        ▼
                                                  ┌──────────┐
                                                  │ KICK API │
                                                  └──────────┘
```

---

## Configuración del Entorno

### Requisitos Previos

1. **Node.js** >= 18.0.0
2. **npm** o **yarn**
3. **Cuenta de KICK** con 2FA habilitado
4. **Aplicación KICK Dev** creada en https://kick.com

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Defer1189/feriox-kickapp.git
   cd feriox-kickapp
   ```

2. **Instalar todas las dependencias**
   ```bash
   npm run install:all
   ```

3. **Configurar variables de entorno**
   
   Copiar el archivo `.env.example` en el directorio `backend/` a `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```

4. **Editar el archivo `.env` con tus credenciales de KICK**
   ```env
   NODE_ENV=development
   PORT=3000
   BACKEND_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:5173

   # Credenciales KICK API (obtener de https://kick.com/settings/developer)
   KICK_CLIENT_ID=tu_client_id_aqui
   KICK_CLIENT_SECRET=tu_client_secret_aqui
   KICK_REDIRECT_URI=http://localhost:3000/api/auth/callback

   # Seguridad
   CORS_ORIGIN=http://localhost:5173
   SESSION_SECRET=un_secreto_largo_y_aleatorio_para_firmar_cookies
   HELMET_ENABLED=true

   # Logging
   LOG_LEVEL=debug
   ```

### Crear una Aplicación en KICK Dev

1. Inicia sesión en https://kick.com
2. Activa 2FA en tu cuenta (obligatorio)
3. Ve a **Settings** → **Developer**
4. Crea una nueva aplicación
5. Configura:
   - **Name**: FerIOX Kick App
   - **Redirect URI**: `http://localhost:3000/api/auth/callback`
6. Guarda tu `client_id` y `client_secret`

---

## Backend

### Estructura

El backend está construido con Express.js y sigue el patrón de módulos ES6.

### Endpoints Principales

#### 1. GET `/api/health`
Verifica el estado del servidor.

**Respuesta:**
```json
{
  "status": "success",
  "message": "✅ Servidor FerIOX Backend funcionando correctamente",
  "timestamp": "2025-10-23T17:24:01.683Z",
  "environment": "development",
  "version": "1.0.0"
}
```

#### 2. GET `/api/auth/login`
Inicia el flujo de autenticación OAuth 2.1.

**Funcionalidad:**
- Genera un `code_verifier` y `code_challenge` (PKCE)
- Genera un `state` aleatorio para prevenir CSRF
- Almacena ambos en cookies httpOnly firmadas
- Redirige al usuario a KICK para autorización

#### 3. GET `/api/auth/callback`
Endpoint de callback OAuth.

**Parámetros Query:**
- `code`: Código de autorización de KICK
- `state`: Estado para validación CSRF

**Funcionalidad:**
- Valida el parámetro `state`
- Intercambia el `code` por un `access_token` usando el `code_verifier`
- Almacena `access_token` y `refresh_token` en cookies httpOnly
- Redirige al dashboard

#### 4. GET `/api/auth/user`
Obtiene los datos del usuario autenticado (ruta protegida).

**Headers requeridos:**
- Cookie con `kick_access_token`

**Respuesta:**
```json
{
  "status": "success",
  "data": { /* Datos del usuario de KICK */ },
  "timestamp": "2025-10-23T17:24:01.683Z"
}
```

#### 5. POST `/api/auth/logout`
Cierra la sesión del usuario (ruta protegida).

**Funcionalidad:**
- Elimina todas las cookies de autenticación
- Retorna mensaje de éxito

#### 6. GET `/api/auth/config`
Verifica la configuración OAuth (desarrollo).

#### 7. GET `/api/auth/debug`
Información de depuración del token (desarrollo).

### Seguridad

El backend implementa múltiples capas de seguridad:

1. **Helmet**: Headers de seguridad HTTP
2. **CORS**: Configurado para permitir solo el frontend autorizado
3. **Cookie-parser**: Cookies firmadas con secret
4. **PKCE**: Proof Key for Code Exchange
5. **State Parameter**: Validación CSRF
6. **httpOnly Cookies**: Los tokens no son accesibles desde JavaScript
7. **Secure Cookies**: En producción, solo HTTPS

### Middlewares

```javascript
// Helmet para headers de seguridad
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
}));

// CORS configurado
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Cookies firmadas
app.use(cookieParser(process.env.SESSION_SECRET));
```

---

## Frontend

### Estructura

El frontend está construido con React 19 y Vite, utilizando React Router DOM para el enrutamiento.

### Componentes Principales

#### 1. **AuthContext** (`src/context/AuthContext.jsx`)
Contexto de React que gestiona el estado de autenticación global.

**Estado:**
- `user`: Datos del usuario autenticado
- `loading`: Estado de carga
- `isAuthenticated`: Boolean de autenticación

**Métodos:**
- `checkAuth()`: Verifica la autenticación actual
- `logout()`: Cierra la sesión del usuario

#### 2. **ProtectedRoute** (`src/components/ProtectedRoute.jsx`)
Componente que protege rutas que requieren autenticación.

**Funcionalidad:**
- Verifica si el usuario está autenticado
- Redirige a "/" si no está autenticado
- Muestra un loading mientras verifica

#### 3. **Home** (`src/pages/Home.jsx`)
Página de inicio con botón de login.

**Características:**
- Muestra información sobre la aplicación
- Botón para iniciar sesión con KICK
- Redirige a dashboard si ya está autenticado

#### 4. **Dashboard** (`src/pages/Dashboard.jsx`)
Página protegida que muestra información del usuario.

**Características:**
- Muestra datos del usuario de KICK
- Botón de logout
- Información de scopes y seguridad

### Configuración de Vite

El archivo `vite.config.js` está configurado para hacer proxy de las peticiones `/api` al backend:

```javascript
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
```

Esto permite que el frontend haga peticiones a `/api/auth/user` y sean redirigidas a `http://localhost:3000/api/auth/user`.

---

## Flujo de Autenticación OAuth 2.1

### Diagrama de Flujo

```
1. Usuario → Clic en "Iniciar Sesión"
   ↓
2. Frontend → Redirige a /api/auth/login
   ↓
3. Backend → Genera PKCE (code_verifier, code_challenge)
          → Genera state
          → Guarda en cookies httpOnly
          → Redirige a KICK OAuth
   ↓
4. KICK → Usuario autoriza la aplicación
       → Redirige a /api/auth/callback?code=XXX&state=YYY
   ↓
5. Backend → Valida state
          → Intercambia code por access_token usando code_verifier
          → Guarda access_token en cookie httpOnly
          → Redirige a /dashboard
   ↓
6. Frontend → Dashboard carga
           → Llama a /api/auth/user
   ↓
7. Backend → Valida access_token de la cookie
          → Llama a KICK API con el token
          → Retorna datos del usuario
   ↓
8. Frontend → Muestra datos del usuario
```

### Parámetros de OAuth

**Authorization Request** (GET `https://id.kick.com/oauth/authorize`):
```
client_id: Tu client ID
redirect_uri: http://localhost:3000/api/auth/callback
response_type: code
scope: user:read channel:read channel:write chat:write streamkey:read events:subscribe moderation:ban
code_challenge: Base64URL(SHA256(code_verifier))
code_challenge_method: S256
state: Random string
```

**Token Request** (POST `https://id.kick.com/oauth/token`):
```
grant_type: authorization_code
code: Authorization code de KICK
client_id: Tu client ID
client_secret: Tu client secret
redirect_uri: http://localhost:3000/api/auth/callback
code_verifier: PKCE verifier original
```

---

## Seguridad

### Implementaciones de Seguridad

1. **PKCE (Proof Key for Code Exchange)**
   - Genera un `code_verifier` aleatorio de 128 caracteres
   - Calcula el `code_challenge` usando SHA256
   - Envía el challenge en la autorización
   - Envía el verifier en el intercambio de token

2. **State Parameter**
   - Genera un `state` aleatorio de 32 caracteres
   - Guarda en cookie firmada
   - Valida en el callback para prevenir CSRF

3. **HttpOnly Cookies**
   - Los tokens se almacenan en cookies httpOnly
   - No accesibles desde JavaScript del navegador
   - Previene ataques XSS

4. **Secure Cookies**
   - En producción, solo se envían por HTTPS
   - `sameSite: 'lax'` previene CSRF

5. **Helmet**
   - Headers de seguridad HTTP automáticos
   - Protección contra ataques comunes

6. **CORS**
   - Solo permite peticiones del frontend autorizado
   - Credentials enabled para cookies

7. **Validación de Tokens**
   - El backend valida todos los tokens antes de usarlos
   - Manejo de tokens expirados

8. **Scopes Mínimos**
   - Solo solicita los scopes necesarios
   - Principio de least privilege

### Mejores Prácticas

- ✅ Nunca exponer `client_secret` en el frontend
- ✅ Usar HTTPS en producción
- ✅ Rotar tokens regularmente
- ✅ Implementar refresh token flow
- ✅ Logging de eventos de seguridad
- ✅ Validar todas las entradas
- ✅ Manejar errores sin exponer detalles sensibles

---

## API Endpoints

### Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check del servidor |
| GET | `/api` | Información del servicio |
| GET | `/api/auth/login` | Inicia OAuth flow |
| GET | `/api/auth/callback` | Callback OAuth |
| GET | `/api/auth/config` | Verificar configuración (dev) |

### Endpoints Protegidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/auth/user` | Datos del usuario autenticado |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/auth/debug` | Debug del token (dev) |

---

## Scopes de KICK

### Scopes Solicitados

| Scope | Descripción | Riesgo |
|-------|-------------|--------|
| `user:read` | Leer información básica del usuario | Bajo |
| `channel:read` | Leer información del canal | Bajo |
| `channel:write` | Modificar metadata del canal | Medio |
| `chat:write` | Enviar mensajes en el chat | Medio |
| `streamkey:read` | Leer la stream key (muy sensible) | Alto |
| `events:subscribe` | Suscribirse a webhooks | Medio |
| `moderation:ban` | Ejecutar acciones de moderación | Alto |

### Uso Recomendado

- **Desarrollo**: Solicita todos los scopes para testing completo
- **Producción**: Solicita solo los scopes que realmente necesites
- **Documentación**: Explica al usuario por qué necesitas cada scope

---

## Despliegue

### Desarrollo Local

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### Producción

#### Variables de Entorno en Producción

```env
NODE_ENV=production
PORT=3000
BACKEND_URL=https://api.tudominio.com
FRONTEND_URL=https://tudominio.com

KICK_CLIENT_ID=tu_client_id
KICK_CLIENT_SECRET=tu_client_secret
KICK_REDIRECT_URI=https://api.tudominio.com/api/auth/callback

CORS_ORIGIN=https://tudominio.com
SESSION_SECRET=secreto_muy_largo_y_aleatorio_en_produccion
HELMET_ENABLED=true
LOG_LEVEL=info
```

#### Build del Frontend

```bash
cd frontend
npm run build
```

El build genera archivos estáticos en `frontend/dist/` que pueden servirse con:
- Nginx
- Apache
- Vercel
- Netlify
- CloudFlare Pages

#### Servidor Backend

El backend puede desplegarse en:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS
- Google Cloud

**Comando de inicio:**
```bash
cd backend
npm start
```

### Checklist de Despliegue

- [ ] Cambiar `NODE_ENV` a `production`
- [ ] Usar URLs HTTPS para BACKEND_URL y FRONTEND_URL
- [ ] Actualizar KICK_REDIRECT_URI en KICK Dev Settings
- [ ] Generar SESSION_SECRET aleatorio y largo
- [ ] Configurar SSL/TLS
- [ ] Habilitar secure cookies
- [ ] Configurar rate limiting
- [ ] Configurar logging apropiado
- [ ] Implementar monitoreo
- [ ] Configurar backups

---

## Comandos Útiles

### Instalación
```bash
npm run install:all         # Instala todas las dependencias
```

### Desarrollo
```bash
npm run dev:backend          # Inicia backend en modo desarrollo
npm run dev:frontend         # Inicia frontend en modo desarrollo
```

### Build
```bash
npm run build                # Build del frontend
```

### Linting y Formato
```bash
npm run lint                 # Ejecuta ESLint
npm run lint:fix             # Ejecuta ESLint y corrige automáticamente
npm run format               # Formatea código con Prettier
npm run format:check         # Verifica formato con Prettier
```

---

## Troubleshooting

### Error: "Token inválido o expirado"
**Solución:**
1. Limpia las cookies del navegador
2. Inicia sesión nuevamente

### Error: "State no válido"
**Solución:**
1. Verifica que SESSION_SECRET esté configurado
2. Asegúrate de que las cookies estén habilitadas

### Error: "CORS"
**Solución:**
1. Verifica que FRONTEND_URL en el backend coincida con la URL del frontend
2. Asegúrate de que el proxy de Vite esté configurado correctamente

### Error: "Redirect URI mismatch"
**Solución:**
1. Verifica que KICK_REDIRECT_URI en .env coincida con la configurada en KICK Dev
2. Asegúrate de que la URL sea exacta (incluyendo http/https)

---

## Licencia

MIT License - Ver archivo [LICENSE](../LICENSE) para más detalles.

---

## Contacto y Soporte

**Desarrollador:** FerIOX  
**Repositorio:** https://github.com/Defer1189/feriox-kickapp  
**Lema:** Escalado Horizontal, Ambición Vertical

---

## Roadmap

- [ ] Implementar refresh token flow
- [ ] Agregar tests unitarios e integración
- [ ] Implementar webhooks de KICK
- [ ] Dashboard con estadísticas en tiempo real
- [ ] Sistema de notificaciones
- [ ] Docker y Docker Compose
- [ ] CI/CD con GitHub Actions
- [ ] Documentación Swagger/OpenAPI
