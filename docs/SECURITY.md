# Seguridad - FerIOX KICK App

## 🔒 Resumen de Seguridad

Esta aplicación implementa las mejores prácticas de seguridad para OAuth 2.1 y aplicaciones web modernas.

## 🛡️ Implementaciones de Seguridad

### 1. OAuth 2.1 con PKCE

**PKCE (Proof Key for Code Exchange)** protege contra ataques de intercepción de código de autorización.

#### Implementación:

```javascript
// Generación de code_verifier
const verifier = crypto.randomBytes(64).toString('hex'); // 128 caracteres

// Generación de code_challenge
const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
```

#### Beneficios:

- Protección contra ataques man-in-the-middle
- Seguridad sin necesidad de client_secret en cliente público
- Validación criptográfica del flujo OAuth

### 2. State Parameter (Protección CSRF)

El parámetro `state` previene ataques Cross-Site Request Forgery.

#### Implementación:

```javascript
// Backend genera state aleatorio
const state = crypto.randomBytes(16).toString('hex');

// Almacenado en cookie firmada
res.cookie('kick_oauth_state', state, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
});

// Validación en callback
if (req.query.state !== req.signedCookies.kick_oauth_state) {
    throw new Error('State inválido - posible ataque CSRF');
}
```

### 3. Cookies Seguras (httpOnly)

Los tokens se almacenan en cookies httpOnly que no son accesibles desde JavaScript.

#### Configuración:

```javascript
res.cookie('kick_access_token', accessToken, {
    httpOnly: true, // No accesible desde JavaScript
    secure: true, // Solo HTTPS en producción
    sameSite: 'lax', // Protección CSRF adicional
    maxAge: 3600000, // Expiración en milisegundos
});
```

#### Beneficios:

- Protección contra XSS (Cross-Site Scripting)
- Los tokens no pueden ser robados por JavaScript malicioso
- Transmisión automática en requests

### 4. Headers de Seguridad HTTP (Helmet)

Helmet configura headers HTTP seguros automáticamente.

#### Headers Configurados:

```javascript
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: false, // Personalizable según necesidades
    }),
);
```

#### Headers Implementados:

- `Strict-Transport-Security`: Fuerza HTTPS
- `X-Content-Type-Options`: Previene MIME sniffing
- `X-Frame-Options`: Protección contra clickjacking
- `X-XSS-Protection`: Protección XSS básica

### 5. CORS Configurado

Control estricto de orígenes permitidos.

#### Configuración:

```javascript
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);
```

#### Beneficios:

- Solo el frontend autorizado puede hacer requests
- Previene requests no autorizados desde otros dominios
- Permite envío de cookies (credentials: true)

### 6. Validación y Sanitización de Input

Todo input del usuario es validado y sanitizado.

#### Ejemplo:

```javascript
// Validación de parámetros requeridos
export function validateQueryParams(requiredParams) {
    return (req, res, next) => {
        const missing = requiredParams.filter((p) => !req.query[p]);
        if (missing.length > 0) {
            return res.status(400).json({
                error: 'Parámetros faltantes',
                missingParams: missing,
            });
        }
        next();
    };
}

// Sanitización automática
export function sanitizeInput(req, res, next) {
    Object.keys(req.query).forEach((key) => {
        if (typeof req.query[key] === 'string') {
            req.query[key] = req.query[key].trim();
        }
    });
    next();
}
```

### 7. Manejo Seguro de Errores

No se exponen detalles sensibles en producción.

#### Implementación:

```javascript
app.use((err, req, res, next) => {
    logger.error('Error:', err);

    res.status(err.status || 500).json({
        status: 'error',
        message: 'Error interno del servidor',
        // Detalles solo en desarrollo
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});
```

## 🔑 Gestión de Secretos

### Variables Sensibles

#### ⚠️ NUNCA exponer:

1. **`KICK_CLIENT_SECRET`**: Clave secreta de la aplicación
2. **`SESSION_SECRET`**: Usado para firmar cookies
3. **Access Tokens**: Tokens de acceso de usuarios
4. **Refresh Tokens**: Tokens de refresco

#### ✅ Buenas prácticas:

1. **Usar variables de entorno**:

    ```env
    # Guardar en .env (NUNCA commitear)
    KICK_CLIENT_SECRET=tu_secret_aqui
    SESSION_SECRET=secret_largo_y_aleatorio
    ```

2. **Archivo `.env` en `.gitignore`**:

    ```gitignore
    # Variables de entorno
    .env
    .env.local
    .env.development.local
    .env.production.local
    ```

3. **Usar gestores de secretos en producción**:
    - AWS Secrets Manager
    - Azure Key Vault
    - HashiCorp Vault
    - Google Secret Manager

### Generación de Secretos Seguros

```bash
# Generar SESSION_SECRET aleatorio
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generar con OpenSSL
openssl rand -hex 32
```

## 🚨 Scopes Sensibles de KICK API

### Clasificación por Nivel de Riesgo

#### 🟢 Riesgo Bajo:

- `user:read`: Leer información básica del usuario
- `channel:read`: Leer información del canal

#### 🟡 Riesgo Medio:

- `channel:write`: Modificar metadata del canal
- `chat:write`: Enviar mensajes en chat
- `events:subscribe`: Suscribirse a webhooks

#### 🔴 Riesgo Alto:

- `streamkey:read`: **MUY SENSIBLE** - Leer stream key
- `moderation:ban`: **POTENTE** - Banear usuarios

### Consideraciones de Seguridad por Scope

#### `streamkey:read` 🔴

**Riesgo**: Si alguien obtiene el stream key, puede transmitir en el canal.

**Mitigaciones**:

- Solo solicitar si es absolutamente necesario
- Nunca mostrar en UI
- No enviar al frontend
- Guardar encriptado si se almacena
- Auditar todo acceso

#### `moderation:ban` 🔴

**Riesgo**: Acciones de moderación muy potentes.

**Mitigaciones**:

- Auditar todas las acciones
- Implementar confirmación doble
- Logs detallados de quién ejecuta qué
- Rate limiting estricto

#### `chat:write` 🟡

**Riesgo**: Spam, abuso, violación de TOS.

**Mitigaciones**:

- Rate limiting agresivo
- Validación de contenido
- Filtros anti-spam
- Monitoreo de comportamiento

## 🔐 Cifrado y Transporte

### HTTPS Obligatorio en Producción

```javascript
// Forzar HTTPS
if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
}
```

### TLS/SSL

- **Mínimo TLS 1.2**
- Usar certificados válidos de Let's Encrypt o similar
- Habilitar HSTS (Strict-Transport-Security)

## 🛡️ Protección contra Ataques Comunes

### 1. XSS (Cross-Site Scripting)

**Protecciones**:

- Cookies httpOnly (tokens no accesibles)
- Sanitización de input
- Content Security Policy headers
- React escapa output automáticamente

### 2. CSRF (Cross-Site Request Forgery)

**Protecciones**:

- State parameter en OAuth
- SameSite cookies
- CORS configurado

### 3. Injection Attacks

**Protecciones**:

- Validación de todos los inputs
- Sanitización de queries
- Uso de librerías seguras (Axios, etc.)

### 4. Man-in-the-Middle

**Protecciones**:

- HTTPS obligatorio
- PKCE en OAuth
- Certificate pinning (opcional, avanzado)

### 5. Brute Force

**Protecciones Recomendadas**:

- Rate limiting
- Account lockout después de X intentos fallidos
- CAPTCHA para operaciones sensibles

## 📊 Monitoreo y Auditoría

### Logs de Seguridad

```javascript
// Registrar eventos importantes
logger.warn('Intento de acceso no autorizado', {
    ip: req.ip,
    path: req.path,
    user: req.user?.id,
});

logger.error('State de OAuth no coincide - posible CSRF', {
    receivedState: req.query.state,
    expectedState: req.signedCookies.kick_oauth_state,
});
```

### Eventos a Monitorear

1. **Intentos de autenticación fallidos**
2. **State inválido en OAuth**
3. **Tokens expirados o inválidos**
4. **Acceso a endpoints sensibles**
5. **Uso de scopes sensibles (streamkey:read, moderation:ban)**
6. **Errores 401/403 repetidos**

## 🚀 Checklist de Seguridad para Producción

### Backend

- [ ] `NODE_ENV=production`
- [ ] HTTPS configurado con certificado válido
- [ ] `SESSION_SECRET` seguro y aleatorio
- [ ] Cookies con `secure: true`
- [ ] CORS configurado para dominio de producción
- [ ] Rate limiting implementado
- [ ] Logs de seguridad activos
- [ ] Error handling sin exponer detalles sensibles
- [ ] Variables de entorno en gestor de secretos

### Frontend

- [ ] Build de producción (`npm run build`)
- [ ] Assets servidos desde CDN
- [ ] HTTPS en todas las URLs
- [ ] No hay console.logs con datos sensibles
- [ ] Validación de input en cliente

### Infraestructura

- [ ] Firewall configurado
- [ ] Solo puertos necesarios abiertos
- [ ] Backups automáticos
- [ ] Monitoreo de seguridad activo
- [ ] Plan de respuesta a incidentes

## 📚 Recursos y Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OAuth 2.1 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [PKCE RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js](https://helmetjs.github.io/)

## 🆘 Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO** abras un issue público
2. Envía un email a: [security@feriox.com](mailto:security@feriox.com) (placeholder)
3. Incluye:
    - Descripción detallada
    - Pasos para reproducir
    - Impacto potencial
    - Sugerencias de mitigación (si las tienes)

## 📝 Actualizaciones de Seguridad

- Revisar dependencias regularmente: `npm audit`
- Actualizar dependencias con vulnerabilidades conocidas
- Seguir el changelog de KICK Dev para cambios de seguridad
- Implementar parches de seguridad rápidamente

## ⚖️ Cumplimiento y Políticas

### KICK Terms of Service

Asegúrate de cumplir con:

- [KICK Terms of Service](https://kick.com/terms-of-service)
- [KICK Developer Terms](https://dev.kick.com/terms-of-service)
- Políticas de uso de API
- Límites de rate limiting

### GDPR / Privacidad

- No almacenar datos personales sin necesidad
- Implementar right to be forgotten
- Política de privacidad clara
- Consentimiento explícito para datos sensibles
