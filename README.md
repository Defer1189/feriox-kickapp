# FerIOX Kick App 🚀

Aplicación Full-Stack para integración con KICK API desarrollada por FerIOX.

Una aplicación moderna y segura que implementa autenticación OAuth2 con KICK, permitiendo a los desarrolladores acceder a la API de KICK de manera segura y eficiente.

## ✨ Características

- 🔐 **Autenticación OAuth2 segura** con KICK API
- 🛡️ **Protección CSRF** mediante validación de state
- 🍪 **Sesiones firmadas** con cookies HttpOnly
- 🎨 **Interfaz moderna** construida con React 18
- ⚡ **Desarrollo rápido** con Vite y Hot Module Replacement
- 🔒 **Headers de seguridad** implementados con Helmet
- 📱 **Diseño responsive** para todos los dispositivos
- 📚 **Documentación completa** de API y arquitectura

## 🏗️ Estructura del Proyecto

```
feriox-kickapp/
├── backend/                 # API Express.js
│   ├── src/
│   │   ├── config/         # Configuración y variables de entorno
│   │   ├── middleware/     # Middlewares de autenticación
│   │   ├── routes/         # Definición de rutas
│   │   ├── utils/          # Funciones utilitarias
│   │   └── server.js       # Punto de entrada del servidor
│   └── package.json
├── frontend/               # Aplicación React + Vite
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Servicios API
│   │   ├── App.jsx        # Componente principal
│   │   └── main.jsx       # Punto de entrada
│   └── package.json
├── docs/                   # Documentación
│   ├── API.md             # Documentación de API
│   ├── ARCHITECTURE.md    # Arquitectura del sistema
│   ├── SECURITY.md        # Mejores prácticas de seguridad
│   └── SETUP.md           # Guía de configuración
└── package.json           # Scripts principales
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn
- Cuenta de desarrollador en KICK
- Credenciales OAuth2 de KICK

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

3. **Configurar el backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edita .env con tus credenciales de KICK
   ```

4. **Configurar el frontend**
   ```bash
   cd ../frontend
   cp .env.example .env
   # Edita .env si es necesario
   ```

### Desarrollo

**Opción 1: Ejecutar ambos servicios (requiere dos terminales)**

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

**Opción 2: Scripts desde el directorio raíz**

```bash
# Backend en puerto 3001
npm run dev:backend

# Frontend en puerto 5173
npm run dev:frontend
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📖 Documentación

- **[Guía de Configuración](docs/SETUP.md)** - Instrucciones detalladas de configuración
- **[Documentación de API](docs/API.md)** - Endpoints y ejemplos de uso
- **[Arquitectura](docs/ARCHITECTURE.md)** - Diseño del sistema y flujo de datos
- **[Seguridad](docs/SECURITY.md)** - Mejores prácticas y consideraciones de seguridad

## 🔒 Permisos OAuth (Scopes)

La aplicación solicita los siguientes permisos de KICK:

- `user:read` - Leer información del usuario
- `channel:read` - Leer información del canal
- `channel:write` - Modificar configuración del canal
- `chat:write` - Enviar mensajes en el chat
- `streamkey:read` - Leer stream key
- `events:subscribe` - Suscribirse a eventos en tiempo real
- `moderation:ban` - Gestionar moderación y baneos

## 🛠️ Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Helmet** - Headers de seguridad
- **CORS** - Control de acceso cross-origin
- **Axios** - Cliente HTTP
- **cookie-parser** - Manejo de cookies
- **dotenv** - Variables de entorno

### Frontend
- **React 18** - Biblioteca UI
- **Vite 5** - Build tool y dev server
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos modulares

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

### Build de Producción
```bash
# Frontend
cd frontend
npm run build

# Preview
npm run preview
```

## 📦 Despliegue

### Backend

1. Configurar variables de entorno de producción
2. Ejecutar con Node.js:
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

### Frontend

1. Construir la aplicación:
   ```bash
   cd frontend
   npm run build
   ```

2. Servir archivos estáticos desde `frontend/dist`

## 🔧 Configuración

### Variables de Entorno Backend

```env
PORT=3001
NODE_ENV=production
KICK_CLIENT_ID=tu_client_id
KICK_CLIENT_SECRET=tu_client_secret
KICK_REDIRECT_URI=https://tudominio.com/api/auth/callback
COOKIE_SECRET=tu_secreto_aleatorio
FRONTEND_URL=https://tudominio.com
```

### Variables de Entorno Frontend

```env
VITE_API_URL=https://tudominio.com
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - Ver archivo [LICENSE](LICENSE) para más detalles.

Copyright (c) 2025 FerIOX

## 👨‍💻 Autor

**FerIOX**
- GitHub: [@Defer1189](https://github.com/Defer1189)

## 🙏 Agradecimientos

- KICK por proporcionar su API
- La comunidad de código abierto

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la [documentación](docs/)
2. Busca en [issues existentes](https://github.com/Defer1189/feriox-kickapp/issues)
3. Crea un nuevo issue si es necesario

---

⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub!