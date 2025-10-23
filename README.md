# FerIOX Kick App 🚀

Aplicación Full-Stack para acceder de forma segura a las API de Kick Dev a través de OAuth 2.1 con PKCE, cumpliendo con las políticas de acceso establecidas por KICK.

## 📋 Características

- ✅ **OAuth 2.1 con PKCE** - Autenticación segura con KICK Dev
- 🔐 **Cookies httpOnly** - Almacenamiento seguro de tokens
- 🛡️ **Protección CSRF** - Usando state parameter
- 🎨 **UI Moderna** - React con diseño responsivo
- 📚 **Documentación Completa** - Swagger UI y documentación técnica
- 🔧 **Calidad de Código** - ESLint y Prettier configurados
- 🚀 **Monorepo** - Backend y Frontend en un mismo repositorio

## 🏗️ Estructura del Proyecto

```
feriox-kickapp/
├── backend/              # Servidor Express.js
│   ├── server.js        # Punto de entrada del servidor
│   ├── swagger.yaml     # Documentación OpenAPI
│   ├── .env.example     # Variables de entorno ejemplo
│   └── package.json
├── frontend/            # Aplicación React + Vite
│   ├── src/
│   │   ├── contexts/    # Contextos (AuthContext)
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Páginas (Login, Dashboard)
│   │   └── App.jsx      # Componente principal
│   └── package.json
├── docs/                # Documentación técnica
│   ├── README.md        # Guía técnica completa
│   └── API.md           # Documentación de API
└── package.json         # Scripts del monorepo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18.0.0
- npm
- Cuenta y aplicación registrada en [KICK Dev](https://dev.kick.com/)

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

4. **Configurar credenciales de KICK**:
   - Visita https://dev.kick.com/
   - Crea una nueva aplicación OAuth
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

## 🔧 Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Axios** - Cliente HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Seguridad HTTP headers
- **cookie-parser** - Manejo de cookies
- **dotenv** - Variables de entorno
- **Swagger UI** - Documentación interactiva de API
- **ESLint & Prettier** - Calidad de código

### Frontend
- **React** 19.x - Librería UI
- **Vite** 7.x - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **ESLint & Prettier** - Calidad de código

## 📚 Documentación

### Documentación Interactiva
- **Swagger UI**: http://localhost:3000/api-docs (cuando el servidor esté ejecutándose)

### Documentación Técnica
- [Guía Técnica Completa](./docs/README.md) - Arquitectura, configuración y despliegue
- [Documentación de API](./docs/API.md) - Especificación completa de endpoints

## 🔒 Seguridad

Este proyecto implementa múltiples capas de seguridad:

- ✅ **OAuth 2.1** - Protocolo de autorización estándar
- ✅ **PKCE** - Proof Key for Code Exchange
- ✅ **Cookies httpOnly** - Protección contra XSS
- ✅ **Signed Cookies** - Prevención de manipulación
- ✅ **State Parameter** - Protección contra CSRF
- ✅ **Helmet** - Headers de seguridad HTTP
- ✅ **CORS** - Control de acceso entre orígenes
- ✅ **Timeouts** - Todas las peticiones tienen timeout

## 🧪 Testing

### Linting

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

### Build

```bash
# Construir frontend para producción
npm run build
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev:backend     # Ejecutar backend en modo desarrollo
npm run dev:frontend    # Ejecutar frontend en modo desarrollo

# Instalación
npm run install:all     # Instalar todas las dependencias

# Build
npm run build           # Construir frontend para producción
```

## 🌐 Endpoints Principales

### Sistema
- `GET /api/health` - Health check del servidor
- `GET /api` - Información del servicio
- `GET /api-docs` - Documentación Swagger

### Autenticación
- `GET /api/auth/login` - Iniciar flujo OAuth
- `GET /api/auth/callback` - Callback de OAuth
- `GET /api/auth/user` - Obtener datos del usuario (protegido)
- `POST /api/auth/logout` - Cerrar sesión (protegido)
- `GET /api/auth/config` - Verificar configuración OAuth
- `GET /api/auth/debug` - Debug de sesión

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**FerIOX**
- GitHub: [@Defer1189](https://github.com/Defer1189)

## 🙏 Agradecimientos

- KICK Dev por proporcionar la API
- Comunidad de código abierto por las herramientas y bibliotecas

---

**Desarrollado con ❤️ por FerIOX** | Escalado Horizontal, Ambición Vertical 🚀