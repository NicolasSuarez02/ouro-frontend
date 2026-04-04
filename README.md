# Ouro Frontend - React App

Frontend de la plataforma de terapia Ouro desarrollado con React y Tailwind CSS.

## 🚀 Características

- ✅ **Landing Page completa** con diseño profesional
- ✅ **Registro de usuarios** con validaciones
- ✅ **Verificación de email** obligatoria
- ✅ **Registro de cliente** con datos adicionales
- ✅ **Diseño responsive** mobile-first
- ✅ **Integración completa** con el backend

## 🛠 Tecnologías

- React 18
- React Router v6
- Tailwind CSS
- Axios
- Google Fonts (Inter)

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

### 3. Ejecutar la aplicación

```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
ouro-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Barra de navegación
│   │   └── Footer.js          # Pie de página
│   ├── pages/
│   │   ├── Home.js            # Landing page
│   │   ├── Register.js        # Registro de usuario
│   │   ├── VerificationSent.js # Email enviado
│   │   ├── VerifyEmail.js     # Verificación de email
│   │   ├── RegisterClient.js  # Registro de cliente
│   │   └── Success.js         # Página de éxito
│   ├── services/
│   │   └── api.js             # Servicio para llamadas al backend
│   ├── App.js                 # Componente principal con rutas
│   ├── index.js               # Punto de entrada
│   └── index.css              # Estilos globales + Tailwind
├── .env.example               # Ejemplo de variables de entorno
├── tailwind.config.js         # Configuración de Tailwind
├── postcss.config.js          # Configuración de PostCSS
└── package.json
```

## 🎨 Páginas y Rutas

### `/` - Home
Landing page completa con:
- Hero section con CTA
- Sección "Cómo funciona"
- Características principales
- Preview de terapeutas
- Sección de contacto
- Footer con redes sociales

### `/register` - Registro
Formulario de registro de usuario con:
- Validaciones en tiempo real
- Campos: nombre, email, teléfono, contraseña
- Envío automático de email de verificación

### `/verification-sent` - Email Enviado
Página informativa que muestra:
- Instrucciones para verificar el email
- Botón para reenviar email
- Acceso a carpeta de spam

### `/verify-email?token=xxx` - Verificación
Página que:
- Verifica automáticamente el token
- Muestra estado de verificación
- Redirige al registro de cliente

### `/register-client` - Registro de Cliente
Formulario opcional para:
- Fecha de nacimiento
- Hora de nacimiento (para astrología)
- Puede omitirse

### `/success` - Éxito
Página final que muestra:
- Confirmación de registro
- Próximos pasos
- CTAs para explorar terapeutas

## 🔄 Flujo de Registro Completo

1. **Usuario llega al Home** → Click en "Comenzar"
2. **Página de Registro** → Completa formulario
3. **Email Enviado** → Instrucciones de verificación
4. **Usuario abre email** → Click en botón de verificación
5. **Verificación automática** → Token validado
6. **Registro de Cliente** → Datos adicionales (opcional)
7. **Página de Éxito** → ¡Listo para usar la plataforma!

## 🎨 Diseño y Estilos

El proyecto usa **Tailwind CSS** con una paleta personalizada:

- **Primary**: `#4A90E2` (Azul)
- **Gold**: `#D4AF37` (Dorado para acentos)
- **Gradientes**: De primary-500 a primary-700

### Componentes Reutilizables

- **Navbar**: Header sticky con navegación smooth scroll
- **Footer**: Con enlaces, contacto y redes sociales

## 🔌 Integración con Backend

El frontend se conecta al backend a través de `services/api.js`:

```javascript
// Ejemplo de uso
import { registerUser, verifyEmail } from './services/api';

// Registrar usuario
const response = await registerUser({
  email: 'user@example.com',
  fullName: 'Juan Pérez',
  phone: '+54911123456',
  password: 'password123'
});

// Verificar email
const result = await verifyEmail(token);
```

## 🌐 Variables de Entorno

- `REACT_APP_API_URL`: URL base del backend API

## 📱 Responsive Design

La aplicación es completamente responsive:
- **Mobile**: Menú hamburguesa, layout de 1 columna
- **Tablet**: Grid de 2 columnas en algunas secciones
- **Desktop**: Layout completo con 3-4 columnas

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm start

# Build para producción
npm run build

# Tests
npm test

# Eject (no recomendado)
npm run eject
```

## 🔧 Configuración Adicional

### Tailwind CSS
La configuración está en `tailwind.config.js` con:
- Colores personalizados
- Fuente Inter
- Plugins opcionales

### PostCSS
Configurado en `postcss.config.js` para:
- Tailwind CSS
- Autoprefixer

## 📝 Notas Importantes

1. **Backend requerido**: El frontend necesita el backend corriendo en `http://localhost:8080`
2. **CORS**: El backend debe tener CORS habilitado para `http://localhost:3000`
3. **Email verification**: El link de verificación apunta a `http://localhost:3000/verify-email?token=xxx`

## 🐛 Troubleshooting

**La app no se conecta al backend:**
- Verifica que el backend esté corriendo
- Revisa la URL en `.env`
- Chequea la consola del navegador para errores CORS

**El email de verificación no funciona:**
- Verifica que `app.frontend.url` en el backend esté configurado como `http://localhost:3000`
- Revisa que el token en la URL esté completo

**Estilos no se aplican:**
- Ejecuta `npm install` nuevamente
- Verifica que Tailwind esté configurado correctamente
- Reinicia el servidor de desarrollo

## 🎯 Próximos Pasos

Funcionalidades que se pueden agregar:
- [ ] Login de usuarios
- [ ] Dashboard de cliente
- [ ] Listado completo de terapeutas
- [ ] Sistema de reservas
- [ ] Chat en tiempo real
- [ ] Videollamadas
- [ ] Historial de sesiones
- [ ] Sistema de pagos

## 📞 Soporte

Para problemas o preguntas:
- Email: contacto@ouro.com
- GitHub Issues: [Tu repositorio]
