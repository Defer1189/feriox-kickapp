# Guía de Instalación - FerIOX KICK App

Esta guía te ayudará a instalar y configurar la aplicación FerIOX KICK App en tu entorno local.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### Software Requerido

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **npm** >= 9.0.0 (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com/downloads))

### Cuenta y Configuración en KICK

1. **Cuenta de KICK**: Debes tener una cuenta activa en [KICK](https://kick.com)
2. **2FA Activado**: La autenticación de dos factores (2FA) es obligatoria para acceder a las herramientas de desarrollador
3. **Aplicación en KICK Dev**: Necesitas crear una aplicación en el portal de desarrolladores de KICK

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Defer1189/feriox-kickapp.git
cd feriox-kickapp
```

### 2. Instalar Todas las Dependencias

```bash
npm run install:all
```

Este comando instalará las dependencias de:
- Raíz del proyecto (herramientas de desarrollo)
- Backend (servidor Express.js)
- Frontend (aplicación React + Vite)

### 3. Configurar Variables de Entorno del Backend

#### Copiar el archivo de ejemplo

```bash
cp backend/.env.example backend/.env
```

#### Editar el archivo `.env`

Abre `backend/.env` y configura las siguientes variables:

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

### 4. Obtener Credenciales de KICK

#### Paso 1: Habilitar 2FA en tu cuenta de KICK

1. Ve a tu perfil en KICK
2. Accede a **Settings** (Configuración)
3. Habilita **Two-Factor Authentication (2FA)**

#### Paso 2: Crear una aplicación en KICK Dev

1. En tu cuenta de KICK, ve a **Settings** → **Developer**
2. Haz clic en **Create New App** o similar
3. Completa el formulario:
   - **Name**: FerIOX KICK App (o el nombre que prefieras)
   - **Description**: Aplicación de integración con KICK API usando OAuth 2.1
   - **OAuth Redirect URIs**: `http://localhost:3000/api/auth/callback`
   - **Scopes**: Selecciona todos los scopes que necesites:
     - `user:read`
     - `channel:read`
     - `channel:write`
     - `chat:write`
     - `streamkey:read`
     - `events:subscribe`
     - `moderation:ban`

4. Guarda la aplicación y copia:
   - **Client ID**
   - **Client Secret**

#### Paso 3: Actualizar el archivo .env

Reemplaza `tu_client_id_aqui` y `tu_client_secret_aqui` con las credenciales obtenidas.

### 5. Configurar Variables de Entorno del Frontend (Opcional)

```bash
cp frontend/.env.example frontend/.env
```

El archivo `frontend/.env` contiene:

```env
VITE_API_URL=http://localhost:3000
```

## ▶️ Ejecutar la Aplicación

### Opción 1: Ejecutar Todo Simultáneamente

```bash
npm run dev
```

Este comando inicia:
- Backend en `http://localhost:3000`
- Frontend en `http://localhost:5173`

### Opción 2: Ejecutar Backend y Frontend por Separado

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

## 🧪 Verificar la Instalación

### 1. Verificar el Backend

Abre tu navegador y visita:

- **Health Check**: `http://localhost:3000/api/health`
- **Configuración OAuth**: `http://localhost:3000/api/auth/config`
- **Documentación Swagger**: `http://localhost:3000/api/docs`

Deberías ver respuestas JSON indicando que el servidor está funcionando.

### 2. Verificar el Frontend

Abre tu navegador y visita:

- **Frontend**: `http://localhost:5173`

Deberías ver la página de inicio de la aplicación.

### 3. Probar el Flujo de Autenticación

1. En el frontend, haz clic en **"Iniciar Sesión con KICK"**
2. Serás redirigido a KICK para autorizar la aplicación
3. Después de autorizar, serás redirigido de vuelta al Dashboard

## 🔧 Solución de Problemas

### Error: "Missing environment variables"

**Problema**: El backend no puede iniciar porque faltan variables de entorno.

**Solución**:
- Verifica que el archivo `backend/.env` existe
- Asegúrate de que todas las variables requeridas están configuradas
- Verifica que no hay espacios adicionales en las variables

### Error: "redirect_uri mismatch"

**Problema**: La URI de redirección no coincide con la configurada en KICK.

**Solución**:
- Verifica que `KICK_REDIRECT_URI` en el `.env` sea exactamente `http://localhost:3000/api/auth/callback`
- Asegúrate de que esta misma URI está configurada en tu aplicación de KICK Dev
- No uses `localhost` mezclado con `127.0.0.1`

### Error: "Cannot find module"

**Problema**: Las dependencias no están instaladas correctamente.

**Solución**:
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

### Puerto ya en uso

**Problema**: Los puertos 3000 o 5173 ya están siendo utilizados.

**Solución**:
- Cambia el puerto en las variables de entorno
- O mata el proceso que está usando el puerto:
  ```bash
  # Linux/Mac
  lsof -ti:3000 | xargs kill -9
  lsof -ti:5173 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

## 🔄 Actualizar la Aplicación

Si ya tienes la aplicación instalada y quieres actualizarla:

```bash
# Obtener últimos cambios
git pull origin main

# Reinstalar dependencias
npm run install:all

# Reiniciar la aplicación
npm run dev
```

## 📚 Próximos Pasos

Una vez que la aplicación esté funcionando:

1. Lee la [Documentación Técnica](./TECHNICAL_DOCUMENTATION.md) para entender la arquitectura
2. Consulta la [Guía de Desarrollo](./DEVELOPMENT.md) si quieres contribuir
3. Revisa la [Documentación de Seguridad](./SECURITY.md) para mejores prácticas

## 💡 Consejos Adicionales

- **Modo Producción**: Para ejecutar en producción, cambia `NODE_ENV=production` en el `.env`
- **HTTPS**: En producción, usa HTTPS y actualiza todas las URLs
- **Seguridad**: Nunca compartas tu `CLIENT_SECRET` o expongas el archivo `.env`
- **Backup**: Guarda una copia de tu configuración en un lugar seguro

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los [Issues existentes](https://github.com/Defer1189/feriox-kickapp/issues)
2. Crea un [nuevo Issue](https://github.com/Defer1189/feriox-kickapp/issues/new) si es necesario
3. Consulta la [documentación de KICK Dev](https://dev.kick.com)
