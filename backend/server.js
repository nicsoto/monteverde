import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import noticiasRouter from './routes/noticias.js';
import circularesRouter from './routes/circulares.js';
import contactoRouter from './routes/contacto.js';
import documentosRouter from './routes/documentos.js';

// Configuración
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas principales
app.get('/', (req, res) => {
    res.json({
        message: 'API Colegio Monteverde',
        version: '1.0.0',
        endpoints: {
            noticias: '/api/noticias',
            circulares: '/api/circulares',
            contacto: '/api/contacto',
            documentos: '/api/documentos'
        }
    });
});

// Rutas API
app.use('/api/noticias', noticiasRouter);
app.use('/api/circulares', circularesRouter);
app.use('/api/contacto', contactoRouter);
app.use('/api/documentos', documentosRouter);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📚 API disponible en http://localhost:${PORT}/api`);
});

export default app;
