# Arquitectura del Proyecto

Este documento describe la arquitectura técnica de FerIOX KICK App.

## 📐 Visión General

FerIOX KICK App es una aplicación full-stack que sigue una arquitectura cliente-servidor tradicional con separación clara entre frontend y backend.

```
┌─────────────────┐
│   Frontend      │
│  React + Vite   │
│  Port: 5173     │
└────────┬────────┘
         │ HTTP/REST
         │ (Proxy durante desarrollo)
         ▼
┌─────────────────┐      ┌──────────────┐
│    Backend      │─────▶│  KICK API    │
│    Express      │      │ kick.com/api │
│  Port: 3000     │      └──────────────┘
└─────────────────┘
```

## 🎨 Frontend (React + Vite)

### Tecnologías

- **React 19**: Framework UI
- **Vite 7**: Build tool y dev server
- **React Router 7**: Client-side routing
- **Axios**: HTTP client

### Estructura de Directorios

```
frontend/src/
├── components/         # Componentes reutilizables
│   ├── Navbar.jsx
│   └── Navbar.css
├── pages/             # Páginas/Vistas principales
│   ├── Home.jsx
│   ├── LiveChannels.jsx
│   ├── Search.jsx
│   └── Categories.jsx
├── services/          # Capa de servicios/API
│   └── api.js
├── utils/             # Utilidades y helpers
├── App.jsx            # Componente raíz con routing
├── main.jsx           # Entry point
└── index.css          # Estilos globales
```

### Flujo de Datos

```
Component ──▶ API Service ──▶ Backend ──▶ KICK API
    │                                          │
    └◀─── setState ◀──── Response ◀───────────┘
```

### Patrones de Diseño

1. **Container/Presentational Pattern**: Separación de lógica y presentación
2. **Custom Hooks**: Lógica reutilizable (potencial para expansión)
3. **Service Layer**: Abstracción de llamadas API

### Routing

```javascript
/ ──────────────▶ Home
/live ──────────▶ LiveChannels
/search ────────▶ Search
/categories ────▶ Categories
```

## 🔧 Backend (Express)

### Tecnologías

- **Express 4**: Framework web
- **Axios**: Cliente HTTP para KICK API
- **dotenv**: Variables de entorno
- **cors**: Cross-Origin Resource Sharing
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting

### Estructura de Directorios

```
backend/src/
├── config/
│   └── config.js          # Configuración centralizada
├── middleware/
│   ├── security.js        # CORS, Helmet, Rate limiting
│   └── errorHandler.js    # Manejo de errores
├── routes/
│   ├── index.js           # Router principal
│   └── kickRoutes.js      # Rutas específicas de KICK
├── services/
│   └── kickService.js     # Lógica de negocio KICK API
└── server.js              # Entry point
```

### Capas de la Arquitectura

#### 1. Capa de Servidor (server.js)
- Inicialización de Express
- Configuración de middlewares globales
- Registro de rutas
- Inicio del servidor

#### 2. Capa de Middleware
- **Security**: CORS, Helmet, Rate Limiting
- **Error Handling**: Manejo centralizado de errores
- **Body Parsing**: JSON y URL-encoded

#### 3. Capa de Rutas (Routes)
- Define endpoints REST
- Validación básica de parámetros
- Delegación a servicios

#### 4. Capa de Servicios (Services)
- Lógica de negocio
- Interacción con APIs externas (KICK)
- Transformación de datos
- Manejo de errores específicos

### API Endpoints

```
GET  /                         # Info del servidor
GET  /api/health              # Health check
GET  /api/channels/:username  # Canal específico
GET  /api/channels/live       # Canales en vivo
GET  /api/search?q=query      # Búsqueda
GET  /api/categories          # Categorías
GET  /api/categories/:slug    # Categoría específica
```

## 🔐 Seguridad

### Implementaciones

1. **CORS**: Restringido al origen del frontend
2. **Helmet**: Headers de seguridad HTTP
3. **Rate Limiting**: 100 peticiones por 15 minutos por IP
4. **Environment Variables**: Configuración sensible en .env
5. **Input Validation**: Validación de parámetros en rutas

### Flujo de Seguridad

```
Request ──▶ Rate Limiter ──▶ CORS ──▶ Helmet ──▶ Routes
             (100/15min)
```

## 🔄 Flujo de Petición Completa

```
1. Usuario interactúa con UI (Frontend)
         ↓
2. Componente llama a api.js service
         ↓
3. Axios hace petición HTTP a Backend
         ↓
4. Vite Proxy redirige a localhost:3000 (dev only)
         ↓
5. Express recibe petición
         ↓
6. Middlewares de seguridad procesan
         ↓
7. Router identifica la ruta correcta
         ↓
8. Controlador valida parámetros
         ↓
9. Service hace petición a KICK API
         ↓
10. Response procesada y enviada al cliente
         ↓
11. Frontend actualiza estado y UI
```

## 📦 Gestión de Estado

### Frontend
- **Local Component State**: useState para estado local
- **API State**: Manejo manual con loading/error/data pattern
- **Router State**: React Router para navegación

### Backend
- **Stateless**: Cada petición es independiente
- **No sesiones**: API pública sin autenticación (por ahora)

## 🚀 Deployment

### Desarrollo
```
Frontend: localhost:5173 (Vite dev server)
Backend:  localhost:3000 (Node server con --watch)
Proxy:    Vite proxy redirige /api a backend
```

### Producción
```
Frontend: Build estático → CDN/Static hosting
Backend:  Node server → Cloud platform
API:      Comunicación directa sin proxy
```

## 🔮 Posibles Mejoras

### Arquitectura
- [ ] Agregar capa de caché (Redis)
- [ ] Implementar WebSockets para chat en tiempo real
- [ ] Agregar sistema de autenticación
- [ ] Implementar GraphQL como alternativa a REST

### Frontend
- [ ] Agregar state management (Zustand/Redux)
- [ ] Implementar código splitting
- [ ] Agregar PWA capabilities
- [ ] Implementar testing (Vitest + React Testing Library)

### Backend
- [ ] Agregar base de datos (MongoDB/PostgreSQL)
- [ ] Implementar sistema de logs (Winston)
- [ ] Agregar monitoreo (Prometheus/Grafana)
- [ ] Implementar testing (Jest + Supertest)
- [ ] Agregar documentación de API (Swagger/OpenAPI)

### DevOps
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Kubernetes orchestration
- [ ] Monitoring y alertas

## 📚 Decisiones de Diseño

### ¿Por qué separar frontend y backend?

1. **Escalabilidad**: Cada parte puede escalar independientemente
2. **Desarrollo**: Equipos pueden trabajar en paralelo
3. **Deployment**: Flexibilidad para hospedar en diferentes plataformas
4. **Reutilización**: Backend puede servir múltiples clientes

### ¿Por qué no Next.js?

- Prioridad en aprendizaje de conceptos fundamentales
- Control total sobre la arquitectura
- Separación clara cliente-servidor
- Posibilidad futura de migrar a Next.js si se requiere SSR

### ¿Por qué Vite sobre Create React App?

- Build más rápido
- HMR más eficiente
- Configuración más simple
- Mejor soporte ES modules
- Herramienta moderna y activamente mantenida

## 🔍 Monitoreo y Debugging

### Development
- React DevTools para componentes
- Network tab para peticiones API
- Vite dev server logs
- Express logs en consola

### Production (Recomendado)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Log aggregation (Datadog, ELK)
- Uptime monitoring (Pingdom, UptimeRobot)

---

Este documento es una guía viva y debe actualizarse a medida que la arquitectura evoluciona.
