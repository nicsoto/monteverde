import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../config/database.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuración de Multer para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads', 'documentos');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|xls|xlsx|jpg|jpeg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    }
});

// GET - Obtener todos los documentos
router.get('/', async (req, res) => {
    try {
        const db = await getDatabase();
        const { categoria, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT * FROM documentos WHERE activo = 1';
        const params = [];

        if (categoria) {
            query += ' AND categoria = ?';
            params.push(categoria);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const documentos = await db.all(query, params);

        res.json({
            success: true,
            data: documentos,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET - Obtener documento por ID
router.get('/:id', async (req, res) => {
    try {
        const db = await getDatabase();
        const documento = await db.get(
            'SELECT * FROM documentos WHERE id = ? AND activo = 1',
            [req.params.id]
        );

        if (!documento) {
            return res.status(404).json({ success: false, error: 'Documento no encontrado' });
        }

        res.json({ success: true, data: documento });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - Subir nuevo documento
router.post('/',
    upload.single('archivo'),
    [
        body('nombre').notEmpty().trim().withMessage('El nombre es requerido'),
        body('categoria').notEmpty().trim().withMessage('La categoría es requerida')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ success: false, error: 'No se ha subido ningún archivo' });
            }

            const db = await getDatabase();
            const { nombre, descripcion, categoria } = req.body;
            const archivo_url = `/uploads/documentos/${req.file.filename}`;

            const result = await db.run(
                'INSERT INTO documentos (nombre, descripcion, categoria, archivo_url, tamano) VALUES (?, ?, ?, ?, ?)',
                [nombre, descripcion || null, categoria, archivo_url, req.file.size]
            );

            const nuevoDocumento = await db.get('SELECT * FROM documentos WHERE id = ?', [result.lastID]);

            res.status(201).json({
                success: true,
                message: 'Documento subido exitosamente',
                data: nuevoDocumento
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

// PUT - Actualizar documento
router.put('/:id', async (req, res) => {
    try {
        const db = await getDatabase();
        const { nombre, descripcion, categoria, activo } = req.body;

        const updates = [];
        const values = [];

        if (nombre) {
            updates.push('nombre = ?');
            values.push(nombre);
        }
        if (descripcion !== undefined) {
            updates.push('descripcion = ?');
            values.push(descripcion);
        }
        if (categoria) {
            updates.push('categoria = ?');
            values.push(categoria);
        }
        if (activo !== undefined) {
            updates.push('activo = ?');
            values.push(activo ? 1 : 0);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(req.params.id);

        await db.run(
            `UPDATE documentos SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        const documentoActualizado = await db.get('SELECT * FROM documentos WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Documento actualizado exitosamente',
            data: documentoActualizado
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE - Eliminar documento (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDatabase();
        await db.run('UPDATE documentos SET activo = 0 WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Documento eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
