# Guía de Instalación - FerIOX Kick App

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** (versión 18.0.0 o superior)
   - Verifica la versión: `node --version`
   - Descarga desde: https://nodejs.org/

2. **npm** (viene con Node.js)
   - Verifica la versión: `npm --version`

3. **Git**
   - Verifica la versión: `git --version`
   - Descarga desde: https://git-scm.com/

4. **Cuenta de KICK** con 2FA habilitado
   - Regístrate en: https://kick.com
   - Habilita 2FA en Settings → Security

## Paso 1: Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/Defer1189/feriox-kickapp.git

# Navegar al directorio
cd feriox-kickapp
```

## Paso 2: Instalar Dependencias

```bash
# Instalar todas las dependencias (root, backend, y frontend)
npm run install:all
```

Este comando ejecutará:
- `npm install` en el directorio raíz (ESLint y Prettier)
- `npm install` en el directorio `backend/`
- `npm install` en el directorio `frontend/`

**Nota:** La instalación puede tomar varios minutos dependiendo de tu conexión a internet.

## Paso 3: Crear Aplicación en KICK Dev

1. Inicia sesión en https://kick.com

2. Ve a tu perfil y selecciona **Settings** → **Developer**

3. Haz clic en **Create New Application**

4. Completa el formulario:
   - **Application Name:** FerIOX Kick App (o el nombre que prefieras)
   - **Redirect URI:** `http://localhost:3000/api/auth/callback`
   - **Description:** Aplicación full-stack para integración con KICK API

5. Una vez creada, guarda:
   - **Client ID** - Lo necesitarás para el archivo .env
   - **Client Secret** - Lo necesitarás para el archivo .env (¡mantenlo seguro!)

**⚠️ IMPORTANTE:** 
- El **Client Secret** es confidencial. No lo compartas ni lo subas a repositorios públicos.
- Asegúrate de que la **Redirect URI** coincida exactamente con la que configurarás en el .env

## Paso 4: Configurar Variables de Entorno

1. En el directorio `backend/`, copia el archivo de ejemplo:

```bash
cp backend/.env.example backend/.env
```

2. Edita el archivo `backend/.env` con tus credenciales:

```bash
# Puedes usar tu editor favorito
nano backend/.env
# o
code backend/.env
# o
vim backend/.env
```

3. Actualiza las siguientes variables:

```env
# Configuración del Servidor
NODE_ENV=development
PORT=3000
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Credenciales KICK API
KICK_CLIENT_ID=tu_client_id_aqui          # ← Reemplaza con tu Client ID
KICK_CLIENT_SECRET=tu_client_secret_aqui  # ← Reemplaza con tu Client Secret
KICK_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Configuraciones de Seguridad
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=un_secreto_largo_y_aleatorio_para_firmar_cookies  # ← Genera uno aleatorio
HELMET_ENABLED=true

# Logging
LOG_LEVEL=debug
```

### Generar SESSION_SECRET aleatorio

Puedes generar un secret aleatorio usando Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y úsalo como valor de `SESSION_SECRET`.

## Paso 5: Verificar la Instalación

### Verificar Backend

```bash
# Navegar al directorio backend
cd backend

# Verificar que las dependencias estén instaladas
npm list --depth=0

# Deberías ver:
# ├── axios@1.12.2
# ├── cookie-parser@1.4.7
# ├── cors@2.8.5
# ├── dotenv@17.2.3
# ├── express@4.21.2
# ├── helmet@8.1.0
# ├── swagger-jsdoc@...
# ├── swagger-ui-express@...
# └── nodemon@3.1.10 (devDependency)
```

### Verificar Frontend

```bash
# Navegar al directorio frontend
cd frontend

# Verificar que las dependencias estén instaladas
npm list --depth=0

# Deberías ver:
# ├── axios@1.12.2
# ├── react@19.1.1
# ├── react-dom@19.1.1
# ├── react-router-dom@7.9.4
# └── vite (y otras devDependencies)
```

### Verificar Herramientas de Calidad de Código

```bash
# Navegar al directorio raíz
cd ..

# Verificar ESLint
npx eslint --version

# Verificar Prettier
npx prettier --version
```

## Paso 6: Iniciar la Aplicación

### Opción 1: Iniciar Backend y Frontend por Separado

**Terminal 1 - Backend:**
```bash
# Desde el directorio raíz
npm run dev:backend

# O directamente desde backend/
cd backend
npm run dev
```

Deberías ver:
```
🚀 Servidor FerIOX Backend inicializado correctamente
📍 Puerto: 3000
🌐 Ambiente: development
🔗 URL: http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
# Desde el directorio raíz
npm run dev:frontend

# O directamente desde frontend/
cd frontend
npm run dev
```

Deberías ver:
```
  VITE v... ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Opción 2: Usar tmux o screen (Linux/Mac)

Si estás en Linux o Mac, puedes usar `tmux`:

```bash
# Crear una nueva sesión tmux
tmux new -s feriox

# Dividir la ventana horizontalmente
Ctrl+b "

# En el panel superior, iniciar el backend
npm run dev:backend

# Cambiar al panel inferior
Ctrl+b ↓

# Iniciar el frontend
npm run dev:frontend

# Para salir de tmux sin cerrar las sesiones
Ctrl+b d

# Para volver a conectarte
tmux attach -t feriox
```

## Paso 7: Verificar que Todo Funciona

1. **Verificar el Backend:**
   - Abre tu navegador en http://localhost:3000/api/health
   - Deberías ver un JSON con `"status": "success"`

2. **Verificar la Documentación API:**
   - Abre http://localhost:3000/api/docs
   - Deberías ver la documentación Swagger

3. **Verificar el Frontend:**
   - Abre http://localhost:5173
   - Deberías ver la página de inicio de FerIOX Kick App

4. **Verificar la Configuración OAuth:**
   - Abre http://localhost:3000/api/auth/config
   - Deberías ver que `client_id` está configurado

## Problemas Comunes

### Error: "Cannot find module"

**Solución:** 
```bash
# Reinstalar dependencias
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

### Error: "Port 3000 already in use"

**Solución:**
```bash
# Encontrar el proceso usando el puerto 3000
lsof -i :3000  # En Linux/Mac
netstat -ano | findstr :3000  # En Windows

# Matar el proceso o cambiar el puerto en backend/.env
PORT=3001
```

### Error: "KICK_CLIENT_ID is not defined"

**Solución:**
- Verifica que el archivo `backend/.env` exista
- Verifica que las variables estén configuradas correctamente
- Reinicia el servidor backend

### Error: "CORS policy"

**Solución:**
- Verifica que `FRONTEND_URL` en `backend/.env` sea `http://localhost:5173`
- Verifica que `CORS_ORIGIN` en `backend/.env` sea `http://localhost:5173`
- Reinicia el servidor backend

### Error: Frontend no carga

**Solución:**
```bash
# Limpiar caché de Vite
cd frontend
rm -rf node_modules/.vite
npm run dev
```

## Siguientes Pasos

Ahora que tienes todo instalado y funcionando:

1. Lee la [Documentación Técnica](./TECHNICAL_DOCUMENTATION.md) para entender la arquitectura
2. Prueba el flujo de autenticación OAuth
3. Explora la documentación Swagger en http://localhost:3000/api/docs
4. Revisa el código fuente para entender cómo funciona

## Recursos Adicionales

- [Documentación de KICK Dev](https://dev.kick.com)
- [Documentación de React](https://react.dev)
- [Documentación de Express](https://expressjs.com)
- [Documentación de OAuth 2.1](https://oauth.net/2.1/)
- [Documentación de PKCE](https://oauth.net/2/pkce/)

## Soporte

Si encuentras problemas que no están listados aquí:

1. Revisa los logs del servidor backend y frontend
2. Verifica que todas las dependencias estén instaladas correctamente
3. Asegúrate de que las credenciales de KICK estén correctas
4. Crea un issue en el repositorio de GitHub

---

**¡Felicidades!** Ya tienes FerIOX Kick App funcionando en tu entorno local. 🎉
