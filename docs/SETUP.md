# Guía de Configuración - FerIOX Kick App

Esta guía te llevará paso a paso por el proceso de configuración de la aplicación.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18.0.0 o superior
- **npm** (viene con Node.js)
- **Git** para clonar el repositorio
- Una cuenta en **KICK** (https://kick.com)
- Acceso a **KICK Dev** (https://dev.kick.com)

## 🔧 Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/Defer1189/feriox-kickapp.git
cd feriox-kickapp
```

## 📦 Paso 2: Instalar Dependencias

Este comando instalará las dependencias del proyecto raíz, backend y frontend:

```bash
npm run install:all
```

Este comando ejecutará:
1. `npm install` en la raíz
2. `cd backend && npm install`
3. `cd frontend && npm install`

### Verificar Instalación

Verifica que todo se haya instalado correctamente:

```bash
# Verificar versión de Node.js
node --version  # Debe ser v18.0.0 o superior

# Verificar que las carpetas node_modules existan
ls backend/node_modules
ls frontend/node_modules
```

## 🔐 Paso 3: Registrar Aplicación en KICK Dev

### 3.1. Acceder a KICK Dev

1. Visita https://dev.kick.com/
2. Inicia sesión con tu cuenta de KICK
3. Acepta los términos de servicio si es tu primera vez

### 3.2. Crear Nueva Aplicación OAuth

1. Haz clic en **"Create Application"** o **"Nueva Aplicación"**
2. Completa el formulario:
   - **Application Name**: `FerIOX Kick App (Dev)` o el nombre que prefieras
   - **Description**: `Aplicación de integración con KICK API para desarrollo`
   - **Application URL**: `http://localhost:5173`
   - **Redirect URIs**: `http://localhost:3000/api/auth/callback`
   - **Scopes**: Selecciona los scopes que necesitas:
     - `user:read` - Lectura de información del usuario
     - `channel:read` - Lectura de información del canal
     - `channel:write` - Escritura en el canal
     - `chat:write` - Escritura en el chat
     - `streamkey:read` - Lectura de stream key
     - `events:subscribe` - Suscripción a eventos
     - `moderation:ban` - Moderación de usuarios

3. Haz clic en **"Create"** o **"Crear"**

### 3.3. Guardar Credenciales

Una vez creada la aplicación, KICK te mostrará:
- **Client ID**: Un identificador único de tu aplicación
- **Client Secret**: Una clave secreta (¡guárdala de forma segura!)

⚠️ **IMPORTANTE**: El Client Secret solo se muestra una vez. Si lo pierdes, deberás regenerarlo.

## 🔧 Paso 4: Configurar Variables de Entorno

### 4.1. Crear archivo .env

```bash
cd backend
cp .env.example .env
```

### 4.2. Editar .env con tus credenciales

Abre `backend/.env` en tu editor favorito y completa con tus valores:

```env
# Configuración del Servidor
NODE_ENV=development
PORT=3000
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Credenciales KICK API
KICK_CLIENT_ID=tu_client_id_aqui      # ← Pega aquí tu Client ID
KICK_CLIENT_SECRET=tu_client_secret_aqui  # ← Pega aquí tu Client Secret
KICK_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Configuraciones de Seguridad
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=un_secreto_largo_y_aleatorio_para_firmar_cookies  # ← Genera un string aleatorio largo
HELMET_ENABLED=true

# Logging
LOG_LEVEL=debug
```

### 4.3. Generar SESSION_SECRET

Puedes generar un SESSION_SECRET seguro usando Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y úsalo como valor de `SESSION_SECRET`.

## ✅ Paso 5: Verificar Configuración

### 5.1. Verificar Backend

```bash
# Desde el directorio backend
npm start
```

Deberías ver algo como:

```
🚀 Servidor FerIOX Backend inicializado correctamente
📍 Puerto: 3000
🌐 Ambiente: development
🔗 URL: http://localhost:3000
🎯 Frontend: http://localhost:5173
```

Presiona `Ctrl+C` para detener el servidor.

### 5.2. Verificar Frontend

```bash
# Desde el directorio frontend
npm run dev
```

Deberías ver algo como:

```
VITE v7.1.12  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Presiona `Ctrl+C` para detener el servidor.

## 🚀 Paso 6: Ejecutar la Aplicación

### Método 1: Dos Terminales (Recomendado para desarrollo)

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### Método 2: Desde la Raíz

**Terminal 1**:
```bash
npm run dev:backend
```

**Terminal 2**:
```bash
npm run dev:frontend
```

## 🌐 Paso 7: Probar la Aplicación

1. **Abrir en el navegador**: http://localhost:5173
2. **Hacer clic en "Iniciar Sesión con KICK"**
3. Serás redirigido a KICK para autorizar la aplicación
4. Autoriza el acceso
5. Serás redirigido de vuelta al dashboard

## 🔍 Verificar Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:
```json
{
  "status": "success",
  "message": "✅ Servidor FerIOX Backend funcionando correctamente",
  "timestamp": "2025-10-23T15:52:23.176Z",
  "environment": "development",
  "version": "1.0.0"
}
```

### Verificar Configuración OAuth
```bash
curl http://localhost:3000/api/auth/config
```

Respuesta esperada:
```json
{
  "client_id": "✅ Configurado",
  "redirect_uri": "http://localhost:3000/api/auth/callback",
  "has_client_secret": true,
  "environment": "development"
}
```

### Ver Documentación Swagger

Abre en tu navegador: http://localhost:3000/api-docs

## 🐛 Solución de Problemas

### Error: "KICK_CLIENT_ID not configured"

**Causa**: No has configurado las credenciales de KICK en el archivo `.env`

**Solución**:
1. Verifica que el archivo `backend/.env` existe
2. Verifica que has copiado correctamente el Client ID y Client Secret
3. Reinicia el servidor backend

### Error: "redirect_uri mismatch"

**Causa**: El Redirect URI configurado en KICK Dev no coincide con el de tu aplicación

**Solución**:
1. Verifica que en KICK Dev el Redirect URI sea exactamente: `http://localhost:3000/api/auth/callback`
2. Verifica que en `backend/.env` el `KICK_REDIRECT_URI` sea el mismo
3. **NO** debe tener una barra final (`/`)

### Error: "Cross-Origin Request Blocked"

**Causa**: Problema de CORS entre frontend y backend

**Solución**:
1. Verifica que el backend esté ejecutándose en el puerto 3000
2. Verifica que el frontend esté ejecutándose en el puerto 5173
3. Verifica que `FRONTEND_URL` en `.env` sea `http://localhost:5173`

### Error: "Cannot find module"

**Causa**: Dependencias no instaladas

**Solución**:
```bash
# Reinstalar dependencias
npm run install:all
```

### Puerto ya en uso

**Causa**: El puerto 3000 o 5173 ya está siendo usado por otra aplicación

**Solución**:

Para Backend (cambiar puerto 3000):
```bash
# En backend/.env
PORT=3001
```

Para Frontend (cambiar puerto 5173):
```bash
# Detener el servidor con Ctrl+C
# Ejecutar con puerto personalizado
npm run dev -- --port 5174
```

## 📝 Notas Importantes

### Seguridad

- **NUNCA** compartas tu `CLIENT_SECRET` públicamente
- **NUNCA** subas el archivo `.env` a Git (ya está en `.gitignore`)
- Usa diferentes credenciales para desarrollo y producción

### Desarrollo

- El backend usa `nodemon` para reinicio automático en desarrollo
- El frontend usa Hot Module Replacement (HMR) para actualizaciones instantáneas
- Los cambios en el código se reflejan automáticamente sin necesidad de reiniciar

### Producción

Para desplegar en producción:

1. **Actualiza las variables de entorno** en `backend/.env`:
   ```env
   NODE_ENV=production
   BACKEND_URL=https://tu-dominio.com
   FRONTEND_URL=https://tu-frontend.com
   KICK_REDIRECT_URI=https://tu-dominio.com/api/auth/callback
   ```

2. **Construye el frontend**:
   ```bash
   cd frontend
   npm run build
   ```

3. **Inicia el backend**:
   ```bash
   cd backend
   npm start
   ```

## 🎯 Próximos Pasos

- Lee la [Documentación Técnica](./README.md) para entender la arquitectura
- Revisa la [Documentación de API](./API.md) para conocer todos los endpoints
- Explora el código en `backend/server.js` y `frontend/src/`
- Personaliza la UI en los componentes de React

## 🆘 Soporte

Si encuentras problemas:

1. Revisa esta guía completa
2. Consulta la sección de solución de problemas
3. Revisa los logs del backend y frontend
4. Abre un issue en GitHub: https://github.com/Defer1189/feriox-kickapp/issues

---

**¡Listo! Ya tienes la aplicación configurada y funcionando.** 🎉
