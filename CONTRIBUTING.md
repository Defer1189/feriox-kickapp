# Contributing to FerIOX KICK App

¡Gracias por tu interés en contribuir! Este documento proporciona pautas para contribuir al proyecto.

## 🤝 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug:

1. Verifica que no exista un issue similar
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es aplicable
   - Información del entorno (OS, Node version, etc.)

### Sugerir Mejoras

Para sugerir nuevas características:

1. Verifica que no exista una sugerencia similar
2. Crea un issue describiendo:
   - La funcionalidad propuesta
   - Por qué sería útil
   - Ejemplos de uso
   - Posible implementación

### Pull Requests

1. **Fork el repositorio**
   ```bash
   git clone https://github.com/TU_USUARIO/feriox-kickapp.git
   ```

2. **Crea una rama para tu feature**
   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```

3. **Realiza tus cambios**
   - Sigue el estilo de código existente
   - Añade tests si es aplicable
   - Actualiza la documentación

4. **Commit tus cambios**
   ```bash
   git commit -m "feat: descripción clara del cambio"
   ```

5. **Push a tu fork**
   ```bash
   git push origin feature/mi-nueva-caracteristica
   ```

6. **Abre un Pull Request**
   - Describe claramente los cambios
   - Referencias issues relacionados
   - Incluye screenshots si hay cambios visuales

## 📝 Guía de Estilo

### Código JavaScript

- Usar ES6+ modules
- Usar `const` y `let`, evitar `var`
- Nombres descriptivos de variables y funciones
- Comentarios JSDoc para funciones públicas
- Indentación de 2 espacios

### Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` formato, sin cambios de código
- `refactor:` refactorización de código
- `test:` añadir o modificar tests
- `chore:` tareas de mantenimiento

Ejemplos:
```
feat: add user profile component
fix: resolve CORS issue in auth endpoint
docs: update setup instructions
```

### Estructura de Archivos

**Backend:**
- Rutas en `backend/src/routes/`
- Middlewares en `backend/src/middleware/`
- Utilidades en `backend/src/utils/`
- Configuración en `backend/src/config/`

**Frontend:**
- Componentes en `frontend/src/components/`
- Hooks en `frontend/src/hooks/`
- Servicios en `frontend/src/services/`
- Utilidades en `frontend/src/utils/`

## 🧪 Testing

Antes de hacer un PR:

1. **Instalar dependencias**
   ```bash
   npm run install:all
   ```

2. **Verificar que el backend funciona**
   ```bash
   cd backend
   npm run dev
   ```

3. **Verificar que el frontend build**
   ```bash
   cd frontend
   npm run build
   ```

4. **Ejecutar tests** (cuando estén disponibles)
   ```bash
   npm test
   ```

## 📋 Checklist para PR

- [ ] El código sigue el estilo del proyecto
- [ ] Los commits siguen Conventional Commits
- [ ] He actualizado la documentación si es necesario
- [ ] He añadido tests para nuevas funcionalidades
- [ ] Todos los tests pasan
- [ ] El código build sin errores
- [ ] He probado los cambios localmente

## 🔒 Seguridad

Si encuentras una vulnerabilidad de seguridad:

1. **NO** abras un issue público
2. Contacta directamente al mantenedor
3. Proporciona detalles del problema
4. Espera a que se emita un parche antes de divulgar

## 💡 Ideas para Contribuir

### Backend
- [ ] Implementar refresh token flow
- [ ] Añadir rate limiting
- [ ] Crear tests unitarios
- [ ] Implementar logging estructurado
- [ ] Añadir más endpoints de KICK API

### Frontend
- [ ] Añadir más componentes
- [ ] Implementar routing (React Router)
- [ ] Mejorar manejo de errores
- [ ] Añadir internacionalización (i18n)
- [ ] Crear tests de componentes

### Documentación
- [ ] Añadir más ejemplos
- [ ] Crear tutoriales en video
- [ ] Traducir documentación
- [ ] Mejorar diagramas de arquitectura

### DevOps
- [ ] Configurar CI/CD
- [ ] Añadir Docker support
- [ ] Crear scripts de deployment
- [ ] Configurar monitoring

## 📚 Recursos

- [Documentación de React](https://react.dev/)
- [Documentación de Express](https://expressjs.com/)
- [OAuth 2.0 RFC](https://oauth.net/2/)
- [KICK Developer Docs](https://kick.com/developer)

## ❓ Preguntas

Si tienes preguntas sobre cómo contribuir:

1. Revisa la documentación en `docs/`
2. Busca en issues existentes
3. Abre un issue con tu pregunta

## 🙏 Reconocimientos

Todos los contribuidores serán añadidos a la sección de agradecimientos del proyecto.

---

¡Gracias por contribuir a FerIOX KICK App! 🚀
