# Mejores Prácticas de Seguridad - FerIOX KICK App

## 1. Gestión de Credenciales

### ✅ Hacer

- **Usar variables de entorno**: Todas las credenciales deben estar en archivos `.env` que NO se suben a Git
- **Rotar secretos regularmente**: Cambia `COOKIE_SECRET` y otras claves periódicamente
- **Usar secretos fuertes**: Genera claves aleatorias de al menos 32 caracteres
- **Permisos mínimos**: Solo solicita los scopes de OAuth que realmente necesites

### ❌ No Hacer

- **Hardcodear credenciales**: Nunca pongas credenciales directamente en el código
- **Compartir .env**: No compartas archivos `.env` con credenciales reales
- **Usar valores por defecto**: Cambia todos los valores de ejemplo antes de producción
- **Commitear secretos**: Asegúrate de que `.env` está en `.gitignore`

---

## 2. Protección CSRF

### Implementación

El backend implementa protección CSRF usando el parámetro `state` en OAuth2:

```javascript
// Generar state aleatorio
const state = generateState();

// Firmar y guardar en cookie
const signedState = signCookie(state, COOKIE_SECRET);
res.cookie('oauth_state', signedState, {
  httpOnly: true,
  secure: NODE_ENV === 'production',
  sameSite: 'lax'
});

// Incluir en URL de autorización
const authUrl = `${AUTHORIZE_URL}?state=${state}&...`;
```

### Validación

```javascript
// Recuperar state de cookie y query
const storedState = req.cookies.oauth_state.split('.')[0];
const receivedState = req.query.state;

// Validar que coincidan
if (storedState !== receivedState) {
  return res.redirect(`${FRONTEND_URL}?error=invalid_state`);
}
```

---

## 3. Manejo de Cookies

### Configuración Segura

```javascript
res.cookie('kick_session', signedData, {
  httpOnly: true,        // No accesible desde JavaScript
  secure: true,          // Solo HTTPS en producción
  sameSite: 'lax',       // Protección CSRF
  maxAge: 24 * 60 * 60 * 1000  // 24 horas
});
```

### Flags Importantes

- **httpOnly**: Previene ataques XSS impidiendo acceso desde JavaScript
- **secure**: Asegura que la cookie solo se envíe por HTTPS
- **sameSite**: Previene envío de cookies en peticiones cross-site
- **signed**: Usa firmas HMAC para detectar manipulación

---

## 4. CORS (Cross-Origin Resource Sharing)

### Configuración Restrictiva

```javascript
app.use(cors({
  origin: FRONTEND_URL,           // Solo desde frontend configurado
  credentials: true,              // Permitir cookies
  methods: ['GET', 'POST', ...],  // Solo métodos necesarios
  allowedHeaders: [...]           // Solo headers necesarios
}));
```

### Mejores Prácticas

- Especifica el origen exacto, no uses `*` con `credentials: true`
- Lista solo los métodos HTTP que tu API usa
- En producción, usa dominios específicos

---

## 5. Headers de Seguridad (Helmet)

### Implementación

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://kick.com", "https://id.kick.com"]
    }
  }
}));
```

### Headers Configurados

- **Content-Security-Policy**: Previene ataques XSS
- **X-Frame-Options**: Previene clickjacking
- **X-Content-Type-Options**: Previene MIME sniffing
- **Strict-Transport-Security**: Fuerza HTTPS
- **X-XSS-Protection**: Protección XSS del navegador

---

## 6. Validación de Input

### En Backend

```javascript
// Validar state en callback
if (!code || !state) {
  return res.status(400).json({ error: 'missing_parameters' });
}

// Validar formato de cookies
const sessionData = unsignCookie(signedCookie, SECRET);
if (!sessionData) {
  return res.status(401).json({ error: 'invalid_session' });
}
```

### En Frontend

```javascript
// Validar respuesta antes de usar
if (response.data && response.data.user) {
  setUser(response.data.user);
} else {
  setError('Invalid response');
}
```

---

## 7. Manejo de Errores

### No Exponer Información Sensible

```javascript
// ✅ Correcto
app.use((err, req, res, next) => {
  console.error('Error:', err);  // Log interno
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
    // NO incluir stack trace en producción
  });
});

// ❌ Incorrecto
res.status(500).json({
  error: err,  // Puede exponer información sensible
  stack: err.stack  // Nunca en producción
});
```

---

## 8. Producción

### Checklist

- [ ] `NODE_ENV=production`
- [ ] HTTPS habilitado
- [ ] Certificados SSL válidos
- [ ] `COOKIE_SECRET` fuerte y único
- [ ] Dominios de producción configurados
- [ ] Logs configurados apropiadamente
- [ ] Rate limiting implementado
- [ ] Monitoreo de errores activo
- [ ] Backups configurados
- [ ] Firewall configurado
- [ ] Dependencias actualizadas

### Variables de Entorno

```env
# Producción
NODE_ENV=production
PORT=3001

KICK_CLIENT_ID=tu_client_id
KICK_CLIENT_SECRET=tu_client_secret
KICK_REDIRECT_URI=https://tudominio.com/api/auth/callback

COOKIE_SECRET=clave_secreta_muy_fuerte_y_aleatoria_de_64_caracteres
FRONTEND_URL=https://tudominio.com
```

---

## 9. Auditoría y Monitoreo

### Logs Importantes

```javascript
// Login attempts
console.log(`Login attempt from ${req.ip}`);

// Failed authentications
console.error(`Failed auth: ${error.message}`);

// OAuth errors
console.error(`OAuth error: ${error}, ${error_description}`);
```

### Métricas a Monitorear

- Intentos de login exitosos/fallidos
- Errores de validación de state
- Tiempo de respuesta de API
- Uso de recursos del servidor
- Peticiones rechazadas por CORS

---

## 10. Actualización de Dependencias

### Comandos Útiles

```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencias
npm update

# Verificar versiones obsoletas
npm outdated
```

### Frecuencia Recomendada

- **Seguridad**: Inmediatamente cuando hay vulnerabilidades críticas
- **Minor updates**: Mensualmente
- **Major updates**: Cada 3-6 meses con testing extensivo

---

## 11. OAuth2 Security

### Mejores Prácticas

- Usa PKCE (Proof Key for Code Exchange) cuando sea posible
- Valida siempre el `state` parameter
- Usa tokens de corta duración
- Implementa refresh token rotation
- Valida la fuente del callback
- Revoca tokens cuando el usuario hace logout

### Scopes Mínimos

Solo solicita los scopes que realmente necesitas:

```javascript
// ✅ Bueno - solo lo necesario
const scopes = ['user:read', 'channel:read'];

// ❌ Malo - todos los permisos
const scopes = ['*'];
```

---

## 12. Testing de Seguridad

### Pruebas a Realizar

1. **CSRF**: Intenta hacer login sin state válido
2. **XSS**: Intenta inyectar scripts en inputs
3. **Cookie tampering**: Modifica cookies y verifica rechazo
4. **CORS**: Prueba peticiones desde orígenes no autorizados
5. **Session hijacking**: Verifica que cookies estén protegidas

---

## Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OAuth 2.0 Security Best Practices](https://oauth.net/2/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
