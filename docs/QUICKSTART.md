# 🚀 Quick Start - FerIOX KICK App

## ⚡ Inicio Rápido en 5 Minutos

### 1. Pre-requisitos

Antes de empezar, asegúrate de tener:

- ✅ Node.js >= 18.0.0 instalado
- ✅ Cuenta de KICK con 2FA activado
- ✅ Aplicación creada en KICK Dev Portal

### 2. Instalación

```bash
# Clonar repositorio
git clone https://github.com/Defer1189/feriox-kickapp.git
cd feriox-kickapp

# Instalar dependencias
npm run install:all
```

### 3. Configuración

```bash
# Copiar archivo de ejemplo
cp backend/.env.example backend/.env
```

**Editar `backend/.env` con tus credenciales:**

```env
# Obtén estas credenciales de tu app en KICK Dev Portal
KICK_CLIENT_ID=tu_client_id
KICK_CLIENT_SECRET=tu_client_secret
KICK_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Genera un secreto aleatorio
SESSION_SECRET=tu_secreto_aleatorio_muy_largo
```

**Generar SESSION_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Ejecutar

```bash
# Opción 1: Ejecutar todo simultáneamente
npm run dev

# Opción 2: Ejecutar por separado
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### 5. Probar

Abre tu navegador en:

- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:3000/api/health
- 📚 **Documentación**: http://localhost:3000/api/docs

### 6. Autenticación

1. Haz clic en **"Iniciar Sesión con KICK"**
2. Autoriza la aplicación en KICK
3. Serás redirigido al Dashboard
4. ¡Listo! 🎉

## 📋 Verificación Rápida

### Backend funciona ✅

```bash
curl http://localhost:3000/api/health
```

Deberías ver:

```json
{
    "status": "success",
    "message": "✅ Servidor FerIOX Backend funcionando correctamente"
}
```

### Frontend funciona ✅

Abre http://localhost:5173 y deberías ver la página de inicio.

## 🔧 Troubleshooting Rápido

### Error: "Missing environment variables"

➡️ Verifica que hayas configurado todas las variables en `backend/.env`

### Error: "redirect_uri mismatch"

➡️ Asegúrate de que `KICK_REDIRECT_URI` coincida exactamente con la configurada en KICK Dev

### Error: Puerto en uso

```bash
# Matar procesos en puertos 3000 y 5173
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

## 📚 Documentación Completa

Para más detalles, consulta:

- 📖 [Guía de Instalación](./INSTALLATION.md)
- 🏗️ [Documentación Técnica](./TECHNICAL_DOCUMENTATION.md)
- 💻 [Guía de Desarrollo](./DEVELOPMENT.md)
- 🔒 [Seguridad](./SECURITY.md)

## 🆘 ¿Necesitas Ayuda?

- 📝 [Crear un Issue](https://github.com/Defer1189/feriox-kickapp/issues)
- 💬 [Discussions](https://github.com/Defer1189/feriox-kickapp/discussions)

---

**¡Feliz Desarrollo! 🚀**
