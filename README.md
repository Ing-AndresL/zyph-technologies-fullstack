# ⚡ Zyph Technologies - Full Stack Web Application

Sitio web corporativo completo con backend API para formulario de contacto y notificaciones por email.

![Zyph Technologies](https://img.shields.io/badge/Zyph-Technologies-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=flat&logo=tailwindcss)

## 🌟 Características

- **🎨 Diseño Moderno**: Interface elegante con TailwindCSS y animaciones fluidas
- **📱 Responsive**: Optimizado para móviles, tablets y desktop  
- **🚀 Performance**: Carga rápida y optimizada
- **📧 Sistema de Contacto**: Formulario funcional con emails automáticos
- **🔒 Seguridad**: Rate limiting, validaciones y protección CORS
- **🗄️ Base de Datos**: Almacenamiento persistente en MongoDB
- **⚡ API REST**: Backend robusto con Node.js + Express

## 🛠️ Stack Tecnológico

### Frontend
- **React** 18.2.0 - Library de interfaz de usuario
- **TailwindCSS** 3.3.6 - Framework de CSS utility-first
- **Lucide React** - Iconos modernos y elegantes
- **React Scripts** - Herramientas de desarrollo

### Backend  
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Nodemailer** - Servicio de emails
- **Helmet** - Middleware de seguridad

## 🚀 Instalación Rápida

### Requisitos Previos
- Node.js 16+ 
- MongoDB (local o Atlas)
- Gmail con App Password configurado

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/zyph-technologies-fullstack.git
cd zyph-technologies-fullstack
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
npm run dev
```

### 3. Configurar Frontend
```bash
cd ../frontend
npm install
cp .env.local.example .env.local
# Editar .env.local si es necesario
npm start
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Health**: http://localhost:3001/api/health

## ⚙️ Configuración de Variables de Entorno

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/zyph-web
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password-gmail
ADMIN_EMAIL=admin@zyph.tech
ADMIN_TOKEN=token-super-secreto-123456789
```

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
REACT_APP_COMPANY_EMAIL=contacto@zyph.tech
REACT_APP_COMPANY_PHONE=+595 123 456 789
```

## 📡 Endpoints API

### Públicos
- `GET /api/health` - Estado del servidor
- `POST /api/contact` - Enviar formulario de contacto

### Administración (requiere token)
- `GET /api/admin/stats` - Estadísticas de contactos
- `GET /api/admin/contacts` - Lista paginada de contactos

## 🧪 Scripts Disponibles

### Backend
```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon  
npm test           # Ejecutar tests
npm run lint       # Linter ESLint
```

### Frontend
```bash
npm start          # Servidor de desarrollo
npm run build      # Build de producción
npm test           # Ejecutar tests
npm run eject      # Eject de CRA (no recomendado)
```

## 🌐 Despliegue

### Opción 1: Vercel + Railway (Recomendado)
```bash
# Frontend en Vercel
npm run build
vercel --prod

# Backend en Railway
railway login
railway init
railway add
railway deploy
```

### Opción 2: Netlify + Render
```bash
# Frontend en Netlify
npm run build
netlify deploy --prod --dir=build

# Backend en Render
# Conectar repositorio en render.com
```

### Configuración de Producción
1. **Dominio personalizado**: Configurar DNS
2. **SSL**: Automático en la mayoría de plataformas
3. **Variables de entorno**: Configurar en panel de hosting
4. **MongoDB Atlas**: Para producción
5. **Email service**: Configurar Gmail o servicio SMTP

## 📊 Estructura del Proyecto

```
zyph-technologies-fullstack/
├── 📁 backend/              # API Node.js + Express
│   ├── server.js           # Servidor principal  
│   ├── package.json        # Dependencias backend
│   ├── .env.example        # Variables de entorno ejemplo
│   └── README.md           # Docs del backend
├── 📁 frontend/             # App React
│   ├── 📁 src/
│   │   ├── 📁 components/   # Componentes React
│   │   ├── App.js          # Componente principal
│   │   ├── index.js        # Punto de entrada
│   │   └── index.css       # Estilos con Tailwind
│   ├── 📁 public/
│   │   ├── index.html      # HTML principal
│   │   └── manifest.json   # PWA manifest
│   ├── package.json        # Dependencias frontend  
│   ├── tailwind.config.js  # Configuración Tailwind
│   └── .env.local.example  # Variables de entorno ejemplo
├── 📁 docs/                 # Documentación
├── 📁 .vscode/              # Configuración VS Code
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Este archivo
```

## 🔧 Desarrollo

### Configuración de VS Code
El proyecto incluye configuración optimizada para VS Code:
- **Extensiones recomendadas**: Prettier, ESLint, Tailwind IntelliSense
- **Configuración de debugging**: Launch configs para backend y frontend
- **Configuración del editor**: Format on save, auto imports

### Hot Reloading  
- **Frontend**: Recarga automática con React Fast Refresh
- **Backend**: Reinicio automático con Nodemon

### Debugging
```bash
# Debug backend
npm run dev

# Debug frontend  
npm start
```

## 🔒 Seguridad

- **Rate Limiting**: 5 intentos por 15 minutos por IP
- **CORS**: Configurado para dominios específicos  
- **Helmet**: Headers de seguridad
- **Validación**: Sanitización de inputs
- **Environment Variables**: Secrets protegidos

## 📈 Performance

- **React**: Componentes optimizados
- **TailwindCSS**: CSS minificado y purgado
- **Images**: Lazy loading y optimización
- **API**: Responses comprimidas

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)  
5. Crear Pull Request

## 📞 Soporte

- **Email**: contacto@zyph.tech
- **LinkedIn**: [Zyph Technologies](https://linkedin.com/company/zyph-tech)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/zyph-technologies-fullstack/issues)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Acknowledgments

- **React Team** por la increíble librería
- **Tailwind Team** por el framework CSS
- **Unsplash** por las imágenes de alta calidad
- **Lucide** por los iconos elegantes

---

**Desarrollado con ❤️ por el equipo de Zyph Technologies**

![Footer](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)