# Guía de Configuración - FerIOX KICK App

## Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Cuenta de desarrollador en KICK
- Credenciales OAuth2 de KICK

## Paso 1: Obtener Credenciales de KICK

1. Ve a [KICK Developer Portal](https://kick.com/developer/applications)
2. Crea una nueva aplicación
3. Configura la URL de redirección: `http://localhost:3001/api/auth/callback`
4. Guarda tu `Client ID` y `Client Secret`
5. Configura los siguientes scopes:
   - `user:read`
   - `channel:read`
   - `channel:write`
   - `chat:write`
   - `streamkey:read`
   - `events:subscribe`
   - `moderation:ban`

## Paso 2: Configurar el Backend

1. Navega al directorio backend:
   ```bash
   cd backend
   ```

2. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Edita el archivo `.env` con tus credenciales:
   ```env
   PORT=3001
   NODE_ENV=development
   
   KICK_CLIENT_ID=tu_client_id_aqui
   KICK_CLIENT_SECRET=tu_client_secret_aqui
   KICK_REDIRECT_URI=http://localhost:3001/api/auth/callback
   
   COOKIE_SECRET=genera_una_clave_secreta_aleatoria
   
   FRONTEND_URL=http://localhost:5173
   ```

4. Instala las dependencias:
   ```bash
   npm install
   ```

5. Inicia el servidor:
   ```bash
   npm run dev
   ```

El backend debería estar corriendo en `http://localhost:3001`

## Paso 3: Configurar el Frontend

1. Abre una nueva terminal y navega al directorio frontend:
   ```bash
   cd frontend
   ```

2. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Edita el archivo `.env`:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. Instala las dependencias:
   ```bash
   npm install
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

El frontend debería estar corriendo en `http://localhost:5173`

## Paso 4: Probar la Aplicación

1. Abre tu navegador en `http://localhost:5173`
2. Haz clic en "Conectar con KICK"
3. Serás redirigido a KICK para autorizar la aplicación
4. Después de autorizar, serás redirigido de vuelta a la aplicación
5. Deberías ver el dashboard con tu información de usuario

## Instalación Rápida (desde el directorio raíz)

```bash
# Instalar todas las dependencias
npm run install:all

# En una terminal, ejecutar el backend
npm run dev:backend

# En otra terminal, ejecutar el frontend
npm run dev:frontend
```

## Producción

### Backend

1. Configura las variables de entorno de producción en `.env`:
   ```env
   NODE_ENV=production
   KICK_REDIRECT_URI=https://tu-dominio.com/api/auth/callback
   FRONTEND_URL=https://tu-dominio.com
   COOKIE_SECRET=clave_secreta_fuerte_y_aleatoria
   ```

2. Inicia el servidor:
   ```bash
   npm start
   ```

### Frontend

1. Construye la aplicación:
   ```bash
   cd frontend
   npm run build
   ```

2. Los archivos estáticos estarán en `frontend/dist`

3. Sirve los archivos con un servidor web como Nginx o Apache

## Solución de Problemas

### Error: "Missing required environment variables"

Asegúrate de que has configurado correctamente el archivo `.env` en el backend con tus credenciales de KICK.

### Error: "CORS policy"

Verifica que `FRONTEND_URL` en el backend coincida con la URL donde se ejecuta tu frontend.

### Error: "Invalid state"

Esto puede ocurrir si:
- Las cookies están bloqueadas en tu navegador
- Estás usando una ventana de incógnito
- Hay un problema con el `COOKIE_SECRET`

### No se puede conectar al backend

Verifica que:
- El backend esté corriendo en el puerto correcto
- `VITE_API_URL` en el frontend apunte al backend
- No haya firewall bloqueando las conexiones

## Notas de Seguridad

- Nunca compartas tu `Client Secret` públicamente
- Cambia `COOKIE_SECRET` a un valor aleatorio fuerte en producción
- Usa HTTPS en producción
- Mantén tus dependencias actualizadas
