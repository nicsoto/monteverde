# Backend - Colegio Monteverde

API REST completa para la gestión del sitio web del Colegio Monteverde.

## 🚀 Características

- ✅ **API REST** con Node.js + Express
- ✅ **Base de datos SQLite** (fácil de usar, sin instalación)
- ✅ **Gestión de Noticias** (CRUD completo)
- ✅ **Gestión de Circulares** (CRUD completo)
- ✅ **Sistema de Contacto** con envío de emails
- ✅ **Gestión de Documentos** con subida de archivos
- ✅ **Sin autenticación** (según requerimiento)
- ✅ **Validación de datos** con express-validator
- ✅ **CORS** configurado
- ✅ **Variables de entorno** (.env)

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de base de datos
├── routes/
│   ├── noticias.js          # Rutas de noticias
│   ├── circulares.js        # Rutas de circulares
│   ├── contacto.js          # Rutas de contacto
│   └── documentos.js        # Rutas de documentos
├── scripts/
│   └── init-db.js           # Script para inicializar BD
├── uploads/                  # Archivos subidos
├── database/                 # Base de datos SQLite
├── .env                      # Variables de entorno
├── .env.example             # Ejemplo de variables
├── server.js                # Servidor principal
├── package.json             # Dependencias
└── README.md                # Este archivo
```

## 🛠️ Instalación

### 1. Instalar Node.js
Si no tienes Node.js instalado:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Verificar instalación
node --version
npm --version
```

### 2. Instalar Dependencias
```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar con tus datos
nano .env
```

Configurar especialmente:
- `EMAIL_USER` y `EMAIL_PASS` para el sistema de contacto
- Si usas Gmail, necesitas crear una "Contraseña de aplicación"

### 4. Inicializar Base de Datos
```bash
npm run init-db
```

Esto creará la base de datos y la poblará con datos de ejemplo.

### 5. Iniciar Servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📡 API Endpoints

### **Noticias**

#### Obtener todas las noticias
```bash
GET /api/noticias
Query params: ?limit=10&offset=0
```

#### Obtener una noticia
```bash
GET /api/noticias/:id
```

#### Crear noticia
```bash
POST /api/noticias
Body (JSON):
{
  "titulo": "Título de la noticia",
  "contenido": "Contenido completo...",
  "resumen": "Resumen breve",
  "fecha": "2025-10-16",
  "imagen": "/path/to/image.jpg"
}
```

#### Actualizar noticia
```bash
PUT /api/noticias/:id
Body (JSON): (campos opcionales)
{
  "titulo": "Nuevo título",
  "activo": true
}
```

#### Eliminar noticia (soft delete)
```bash
DELETE /api/noticias/:id
```

---

### **Circulares**

#### Obtener todas las circulares
```bash
GET /api/circulares
Query params: ?limit=10&offset=0&tipo=becas
```

#### Obtener una circular
```bash
GET /api/circulares/:id
```

#### Crear circular
```bash
POST /api/circulares
Body (JSON):
{
  "numero": "20251016",
  "titulo": "Título circular",
  "contenido": "Contenido...",
  "fecha": "2025-10-16",
  "tipo": "general",
  "archivo_url": "/path/to/file.pdf"
}
```

#### Actualizar circular
```bash
PUT /api/circulares/:id
```

#### Eliminar circular
```bash
DELETE /api/circulares/:id
```

---

### **Contacto**

#### Enviar mensaje de contacto
```bash
POST /api/contacto
Body (JSON):
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "+56912345678",
  "asunto": "Consulta",
  "mensaje": "Hola, quisiera..."
}
```

#### Obtener mensajes (admin)
```bash
GET /api/contacto
Query params: ?limit=50&offset=0&leido=false
```

#### Marcar como leído
```bash
PUT /api/contacto/:id/leido
```

#### Eliminar mensaje
```bash
DELETE /api/contacto/:id
```

---

### **Documentos**

#### Obtener documentos
```bash
GET /api/documentos
Query params: ?categoria=listas-utiles&limit=50
```

#### Obtener un documento
```bash
GET /api/documentos/:id
```

#### Subir documento
```bash
POST /api/documentos
Content-Type: multipart/form-data
Form data:
- archivo: [file]
- nombre: "Lista de Útiles Kinder"
- descripcion: "Material requerido"
- categoria: "listas-utiles"
```

#### Actualizar documento
```bash
PUT /api/documentos/:id
```

#### Eliminar documento
```bash
DELETE /api/documentos/:id
```

---

## 🧪 Probar la API

### Usando cURL:

```bash
# Obtener noticias
curl http://localhost:3000/api/noticias

# Crear noticia
curl -X POST http://localhost:3000/api/noticias \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Nueva Noticia",
    "contenido": "Contenido de prueba",
    "fecha": "2025-10-16"
  }'

# Enviar mensaje de contacto
curl -X POST http://localhost:3000/api/contacto \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "asunto": "Prueba",
    "mensaje": "Mensaje de prueba"
  }'
```

### Usando Postman o Insomnia:

1. Importa la colección de endpoints
2. Configura la URL base: `http://localhost:3000`
3. Prueba los diferentes endpoints

---

## 📧 Configuración de Email

Para que funcione el sistema de contacto con envío de emails:

### Gmail:
1. Activa la verificación en 2 pasos
2. Genera una "Contraseña de aplicación"
3. Úsala en `EMAIL_PASS` del archivo `.env`

### Otro SMTP:
Configura en `.env`:
```
EMAIL_HOST=smtp.tuservidor.com
EMAIL_PORT=587
EMAIL_USER=tu_usuario
EMAIL_PASS=tu_contraseña
```

---

## 📂 Categorías de Documentos

Categorías sugeridas:
- `listas-utiles` - Listas de útiles escolares
- `reglamentos` - Reglamentos y manuales
- `calendarios` - Calendarios escolares
- `circulares` - Circulares en PDF
- `formularios` - Formularios descargables
- `otros` - Otros documentos

---

## 🔒 Seguridad (Mejoras futuras)

Este backend NO tiene autenticación (según tu requerimiento). Para producción, considera:

1. **Agregar autenticación JWT** para rutas de administración
2. **Rate limiting** para evitar spam
3. **Sanitización** adicional de inputs
4. **HTTPS** en producción
5. **Backup** automático de la base de datos

---

## 🚀 Despliegue en Producción

### Opciones recomendadas:

1. **Railway.app** (Gratis, fácil)
   ```bash
   railway login
   railway init
   railway up
   ```

2. **Render.com** (Gratis)
   - Conecta tu repo GitHub
   - Configura variables de entorno
   - Deploy automático

3. **VPS (DigitalOcean, etc.)**
   ```bash
   # Instalar PM2
   npm install -g pm2
   
   # Iniciar con PM2
   pm2 start server.js --name monteverde-api
   pm2 startup
   pm2 save
   ```

---

## 📊 Base de Datos

### SQLite (Actual)
- ✅ Fácil de usar
- ✅ Sin instalación
- ✅ Perfecto para empezar
- ⚠️ Limitado para alto tráfico

### Migrar a PostgreSQL/MySQL (futuro)
Si crece el proyecto, puedes migrar fácilmente cambiando el driver en `database.js`

---

## 🐛 Troubleshooting

### Error: Puerto 3000 en uso
```bash
# Cambiar puerto en .env
PORT=3001
```

### Error: Email no se envía
- Verifica credenciales SMTP
- Revisa que el puerto 587 esté abierto
- Usa contraseña de aplicación (Gmail)

### Error: Base de datos bloqueada
```bash
# Reiniciar servidor
npm start
```

---

## 📝 To-Do (Mejoras futuras)

- [ ] Agregar autenticación JWT
- [ ] Panel de administración web
- [ ] Subida de imágenes para noticias
- [ ] Sistema de roles y permisos
- [ ] Estadísticas y analytics
- [ ] Backup automático de BD
- [ ] Paginación mejorada
- [ ] Búsqueda full-text
- [ ] Caché con Redis
- [ ] Tests automatizados

---

## 📞 Soporte

Para dudas o problemas, revisa los logs del servidor:
```bash
npm run dev
```

Los errores se mostrarán en la consola.

---

**Desarrollado para Colegio Monteverde** 🎓
