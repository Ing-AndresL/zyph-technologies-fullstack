#!/bin/bash

# 🚀 Script de Instalación Automática - Zyph Technologies
# Este script configura todo el proyecto automáticamente

echo "⚡ Iniciando instalación de Zyph Technologies Full Stack..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar que Node.js está instalado
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado. Por favor instala Node.js 16+ desde https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version $NODE_VERSION encontrada. Se requiere Node.js 16 o superior."
        exit 1
    fi
    
    print_success "Node.js $(node --version) ✓"
}

# Verificar que npm está instalado
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado"
        exit 1
    fi
    print_success "npm $(npm --version) ✓"
}

# Crear estructura de directorios
create_structure() {
    print_status "Creando estructura de directorios..."
    
    mkdir -p backend
    mkdir -p frontend/src/components
    mkdir -p frontend/public
    mkdir -p docs
    mkdir -p .vscode
    
    print_success "Estructura de directorios creada ✓"
}

# Instalar dependencias del backend
install_backend() {
    print_status "Instalando dependencias del backend..."
    
    cd backend
    
    # Crear package.json si no existe
    if [ ! -f package.json ]; then
        npm init -y > /dev/null 2>&1
    fi
    
    # Instalar dependencias
    npm install express cors nodemailer express-rate-limit helmet mongoose dotenv bcryptjs jsonwebtoken validator --save
    npm install nodemon jest supertest eslint --save-dev
    
    # Crear scripts en package.json
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = {
        'start': 'node server.js',
        'dev': 'nodemon server.js',
        'test': 'jest',
        'lint': 'eslint .'
    };
    pkg.main = 'server.js';
    pkg.name = 'zyph-backend';
    pkg.description = 'Backend API para Zyph Technologies';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    
    cd ..
    print_success "Backend configurado ✓"
}

# Instalar dependencias del frontend
install_frontend() {
    print_status "Instalando dependencias del frontend..."
    
    cd frontend
    
    # Crear React app si no existe
    if [ ! -f package.json ]; then
        npx create-react-app . --template minimal > /dev/null 2>&1
    fi
    
    # Instalar dependencias adicionales
    npm install lucide-react --save
    npm install tailwindcss postcss autoprefixer --save-dev
    
    # Inicializar Tailwind
    npx tailwindcss init -p > /dev/null 2>&1
    
    cd ..
    print_success "Frontend configurado ✓"
}

# Crear archivos de configuración
create_config_files() {
    print_status "Creando archivos de configuración..."
    
    # .env.example para backend
    cat > backend/.env.example << 'EOF'
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/zyph-web
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password
ADMIN_EMAIL=admin@zyph.tech
ADMIN_TOKEN=token-super-secreto-123456789
EOF
    
    # .env.local.example para frontend
    cat > frontend/.env.local.example << 'EOF'
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
REACT_APP_COMPANY_EMAIL=contacto@zyph.tech
REACT_APP_COMPANY_PHONE=+595 123 456 789
EOF
    
    # Copiar archivos .env
    cp backend/.env.example backend/.env
    cp frontend/.env.local.example frontend/.env.local
    
    print_success "Archivos de configuración creados ✓"
}

# Función principal
main() {
    print_status "Verificando requisitos del sistema..."
    check_node
    check_npm
    
    print_status "Configurando proyecto..."
    create_structure
    install_backend
    install_frontend
    create_config_files
    
    echo ""
    echo "🎉 ¡Instalación completada exitosamente!"
    echo "=================================================="
    echo ""
    print_success "Próximos pasos:"
    echo "1. Configurar variables de entorno:"
    echo "   - Editar backend/.env con tus configuraciones"
    echo "   - Configurar MongoDB y email"
    echo ""
    echo "2. Iniciar el desarrollo:"
    echo "   Backend:  cd backend && npm run dev"
    echo "   Frontend: cd frontend && npm start"
    echo ""
    echo "3. Acceder a la aplicación:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo ""
    print_warning "No olvides configurar MongoDB y Gmail para el funcionamiento completo!"
    echo ""
    echo "📚 Para más información, revisa el README.md"
    echo ""
}

# Ejecutar función principal
main