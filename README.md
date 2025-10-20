# 🎮 FerIOX KICK App

Aplicación Full-Stack para integración con KICK API desarrollada por FerIOX.

Una aplicación moderna construida con React + Vite en el frontend y Express en el backend, diseñada para interactuar con la plataforma de streaming KICK.

## ✨ Características

- 📺 **Visualización de Canales en Vivo**: Explora streamers activos en tiempo real
- 🔍 **Búsqueda Avanzada**: Encuentra canales por nombre o palabra clave
- 🎯 **Exploración por Categorías**: Navega contenido organizado por categorías
- 🛡️ **Seguridad**: Implementa CORS, Helmet, y rate limiting
- ⚡ **Performance**: Proxy API optimizado y caché de respuestas
- 🎨 **UI Moderna**: Interfaz responsive con diseño gradient y animaciones

## 🏗️ Arquitectura

```
feriox-kickapp/
├── frontend/          # Aplicación React + Vite
│   ├── src/
│   │   ├── components/  # Componentes reutilizables (Navbar)
│   │   ├── pages/       # Páginas de la app (Home, LiveChannels, Search, Categories)
│   │   ├── services/    # Cliente API y servicios
│   │   └── App.jsx      # Componente principal con routing
│   └── vite.config.js   # Configuración de Vite con proxy
│
├── backend/           # Servidor Express
│   └── src/
│       ├── config/      # Configuración (variables de entorno)
│       ├── middleware/  # Seguridad, manejo de errores
│       ├── routes/      # Rutas de la API
│       ├── services/    # Lógica de negocio (KICK API)
│       └── server.js    # Punto de entrada del servidor
│
└── package.json       # Scripts principales del proyecto
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone https://github.com/Defer1189/feriox-kickapp.git
cd feriox-kickapp
```

### 2. Instalar dependencias

```bash
# Instalar todas las dependencias (frontend y backend)
npm run install:all
```

### 3. Configurar variables de entorno

#### Backend (.env en /backend)

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` con tu configuración:

```env
PORT=3000
NODE_ENV=development
KICK_API_BASE_URL=https://kick.com/api/v2
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env en /frontend)

```bash
cp frontend/.env.example frontend/.env
```

Edita `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Iniciar la aplicación

#### Modo Desarrollo (Frontend y Backend simultáneamente)

```bash
npm run dev
```

Esto iniciará:
- Frontend en `http://localhost:5173`
- Backend en `http://localhost:3000`

#### Iniciar servicios por separado

```bash
# Backend (en una terminal)
cd backend
npm run dev

# Frontend (en otra terminal)
cd frontend
npm run dev
```

#### Modo Producción

```bash
# Build del frontend
npm run build

# Iniciar servidor backend
npm start
```

## 📡 API Endpoints

### Backend Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check del servidor |
| GET | `/api/channels/:username` | Información de un canal específico |
| GET | `/api/channels/live` | Lista de canales en vivo |
| GET | `/api/search?q=query` | Buscar canales |
| GET | `/api/categories` | Lista de categorías |
| GET | `/api/categories/:slug` | Información de una categoría |

### Ejemplos de uso

```bash
# Health check
curl http://localhost:3000/api/health

# Obtener canales en vivo
curl http://localhost:3000/api/channels/live?page=1&limit=25

# Buscar canales
curl http://localhost:3000/api/search?q=gaming

# Obtener categorías
curl http://localhost:3000/api/categories
```

## 🛡️ Seguridad

### Implementaciones de Seguridad

1. **CORS**: Configurado para permitir solo el origen del frontend
2. **Helmet**: Headers de seguridad HTTP
3. **Rate Limiting**: Límite de peticiones por IP (100 req/15min por defecto)
4. **Variables de Entorno**: Configuración sensible en archivos .env
5. **Validación de Input**: Validación de parámetros en las rutas

### Mejores Prácticas Implementadas

- ✅ Separación de frontend y backend
- ✅ Proxy API para evitar CORS en producción
- ✅ Manejo centralizado de errores
- ✅ Logging de errores en el servidor
- ✅ Timeouts en peticiones HTTP
- ✅ Configuración por ambiente (dev/prod)

## 🎨 Frontend

### Tecnologías

- **React 19**: Biblioteca UI
- **Vite**: Build tool y dev server
- **React Router**: Routing del lado del cliente
- **Axios**: Cliente HTTP
- **CSS Modules**: Estilos modulares

### Estructura de Componentes

```
src/
├── components/
│   └── Navbar.jsx          # Barra de navegación
├── pages/
│   ├── Home.jsx            # Página principal
│   ├── LiveChannels.jsx    # Canales en vivo
│   ├── Search.jsx          # Búsqueda de canales
│   └── Categories.jsx      # Exploración de categorías
└── services/
    └── api.js              # Cliente API y métodos
```

### Rutas del Frontend

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Home | Página de inicio con información |
| `/live` | LiveChannels | Canales transmitiendo en vivo |
| `/search` | Search | Búsqueda de canales |
| `/categories` | Categories | Exploración de categorías |

## 🔧 Backend

### Tecnologías

- **Express**: Framework web
- **ES6 Modules**: Sintaxis moderna de JavaScript
- **Axios**: Cliente HTTP para KICK API
- **dotenv**: Gestión de variables de entorno
- **cors**: Manejo de CORS
- **helmet**: Seguridad HTTP
- **express-rate-limit**: Rate limiting

### Estructura del Backend

```
backend/src/
├── config/
│   └── config.js           # Configuración centralizada
├── middleware/
│   ├── security.js         # CORS, Helmet, Rate Limiting
│   └── errorHandler.js     # Manejo de errores
├── routes/
│   ├── index.js            # Router principal
│   └── kickRoutes.js       # Rutas de KICK API
├── services/
│   └── kickService.js      # Lógica de integración con KICK
└── server.js               # Servidor Express
```

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run start  # Verificar que el servidor inicia correctamente
```

## 📦 Scripts Disponibles

### Root

- `npm run dev` - Inicia frontend y backend en modo desarrollo
- `npm run build` - Build del frontend
- `npm start` - Inicia backend en modo producción
- `npm run install:all` - Instala todas las dependencias

### Frontend

- `npm run dev` - Inicia dev server
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Ejecuta ESLint

### Backend

- `npm run dev` - Inicia servidor con watch mode
- `npm start` - Inicia servidor

## 🐛 Troubleshooting

### El frontend no se conecta al backend

1. Verifica que el backend esté corriendo en el puerto 3000
2. Revisa la configuración de proxy en `frontend/vite.config.js`
3. Verifica las variables de entorno en `.env`

### Errores de CORS

1. Verifica que `FRONTEND_URL` en el backend coincida con la URL del frontend
2. Asegúrate de que CORS está configurado correctamente en `backend/src/middleware/security.js`

### Rate Limit alcanzado

1. Ajusta los valores en `.env`: `RATE_LIMIT_WINDOW_MS` y `RATE_LIMIT_MAX_REQUESTS`
2. En desarrollo, puedes aumentar el límite temporalmente

## 🚀 Deployment

### Frontend (Vercel, Netlify, etc.)

1. Build del frontend: `npm run build` en `/frontend`
2. Deploy la carpeta `frontend/dist`
3. Configura la variable `VITE_API_URL` con la URL de tu backend

### Backend (Heroku, Railway, etc.)

1. Deploy la carpeta `/backend`
2. Configura las variables de entorno
3. Asegúrate de configurar `FRONTEND_URL` con la URL de tu frontend

## 📄 Licencia

MIT

## 👤 Autor

**FerIOX**

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
