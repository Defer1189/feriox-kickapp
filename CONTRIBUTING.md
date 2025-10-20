# Guía de Contribución

¡Gracias por tu interés en contribuir a FerIOX KICK App! Este documento proporciona pautas para contribuir al proyecto.

## 🚀 Comenzando

1. Fork el repositorio
2. Clona tu fork: `git clone https://github.com/tu-usuario/feriox-kickapp.git`
3. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
4. Instala las dependencias: `npm run install:all`

## 📋 Antes de Contribuir

- Revisa los issues existentes para evitar duplicados
- Discute cambios mayores creando un issue primero
- Asegúrate de que tu código sigue las convenciones del proyecto
- Escribe mensajes de commit claros y descriptivos

## 🔧 Desarrollo

### Estructura del Proyecto

```
feriox-kickapp/
├── frontend/     # React + Vite
├── backend/      # Express Server
└── docs/         # Documentación adicional
```

### Ejecutar en Desarrollo

```bash
# Todo junto
npm run dev

# Solo frontend
cd frontend && npm run dev

# Solo backend
cd backend && npm run dev
```

### Estándares de Código

#### Frontend
- Usa componentes funcionales con Hooks
- Mantén los componentes pequeños y reutilizables
- Usa CSS modules o archivos CSS separados por componente
- Nombres de archivos en PascalCase para componentes (ej: `Navbar.jsx`)

#### Backend
- Usa ES6 modules (`import/export`)
- Maneja errores apropiadamente con try/catch
- Documenta funciones públicas con JSDoc
- Organiza rutas por dominio/recurso

## 🧪 Testing

Antes de enviar tu PR, asegúrate de:

- [ ] El código se ejecuta sin errores
- [ ] Todos los lints pasan: `npm run lint --prefix frontend`
- [ ] El build funciona: `npm run build`
- [ ] Probaste manualmente los cambios

## 📝 Commits

Usa mensajes de commit descriptivos siguiendo el formato:

```
tipo(alcance): descripción breve

Descripción más detallada si es necesario.
```

Tipos:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan el código)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

Ejemplos:
```
feat(frontend): agregar página de perfil de usuario
fix(backend): corregir error en validación de API
docs(readme): actualizar instrucciones de instalación
```

## 🔄 Pull Requests

1. Actualiza tu rama con main: `git pull origin main`
2. Haz push de tu rama: `git push origin feature/nueva-funcionalidad`
3. Abre un Pull Request en GitHub
4. Describe claramente qué cambios hiciste y por qué
5. Enlaza issues relacionados si los hay

### Checklist de PR

- [ ] El código compila sin errores
- [ ] Agregaste/actualizaste tests si es necesario
- [ ] Actualizaste la documentación si es necesario
- [ ] Los commits tienen mensajes claros
- [ ] No hay conflictos con la rama main

## 🐛 Reportar Bugs

Cuando reportes un bug, incluye:

- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si es relevante
- Información del entorno (OS, versiones de Node/npm)

## 💡 Sugerir Features

Para sugerir nuevas funcionalidades:

- Describe claramente la funcionalidad
- Explica el caso de uso
- Considera alternativas si las hay
- Discute el impacto en el proyecto existente

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express Documentation](https://expressjs.com/)
- [KICK API Documentation](https://kick.com/api)

## ❓ Preguntas

Si tienes preguntas sobre cómo contribuir, puedes:

- Abrir un issue con la etiqueta "question"
- Contactar a los mantenedores del proyecto

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia del proyecto (MIT).

---

¡Gracias por contribuir a FerIOX KICK App! 🎉
