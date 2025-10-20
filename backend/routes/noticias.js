import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../config/database.js';

const router = express.Router();

// GET - Obtener todas las noticias activas
router.get('/', async (req, res) => {
    try {
        const db = await getDatabase();
        const { limit = 10, offset = 0 } = req.query;

        const noticias = await db.all(
            'SELECT * FROM noticias WHERE activo = 1 ORDER BY fecha DESC LIMIT ? OFFSET ?',
            [parseInt(limit), parseInt(offset)]
        );

        const total = await db.get('SELECT COUNT(*) as count FROM noticias WHERE activo = 1');

        res.json({
            success: true,
            data: noticias,
            total: total.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET - Obtener una noticia por ID
router.get('/:id', async (req, res) => {
    try {
        const db = await getDatabase();
        const noticia = await db.get(
            'SELECT * FROM noticias WHERE id = ? AND activo = 1',
            [req.params.id]
        );

        if (!noticia) {
            return res.status(404).json({ success: false, error: 'Noticia no encontrada' });
        }

        res.json({ success: true, data: noticia });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - Crear nueva noticia
router.post('/',
    [
        body('titulo').notEmpty().trim().withMessage('El título es requerido'),
        body('contenido').notEmpty().withMessage('El contenido es requerido'),
        body('fecha').isDate().withMessage('Fecha inválida')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const db = await getDatabase();
            const { titulo, contenido, resumen, fecha, imagen } = req.body;

            const result = await db.run(
                'INSERT INTO noticias (titulo, contenido, resumen, fecha, imagen) VALUES (?, ?, ?, ?, ?)',
                [titulo, contenido, resumen || null, fecha, imagen || null]
            );

            const nuevaNoticia = await db.get('SELECT * FROM noticias WHERE id = ?', [result.lastID]);

            res.status(201).json({
                success: true,
                message: 'Noticia creada exitosamente',
                data: nuevaNoticia
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

// PUT - Actualizar noticia
router.put('/:id',
    [
        body('titulo').optional().trim().notEmpty(),
        body('contenido').optional().notEmpty(),
        body('fecha').optional().isDate()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const db = await getDatabase();
            const { titulo, contenido, resumen, fecha, imagen, activo } = req.body;

            const updates = [];
            const values = [];

            if (titulo) {
                updates.push('titulo = ?');
                values.push(titulo);
            }
            if (contenido) {
                updates.push('contenido = ?');
                values.push(contenido);
            }
            if (resumen !== undefined) {
                updates.push('resumen = ?');
                values.push(resumen);
            }
            if (fecha) {
                updates.push('fecha = ?');
                values.push(fecha);
            }
            if (imagen !== undefined) {
                updates.push('imagen = ?');
                values.push(imagen);
            }
            if (activo !== undefined) {
                updates.push('activo = ?');
                values.push(activo ? 1 : 0);
            }

            updates.push('updated_at = CURRENT_TIMESTAMP');
            values.push(req.params.id);

            await db.run(
                `UPDATE noticias SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            const noticiaActualizada = await db.get('SELECT * FROM noticias WHERE id = ?', [req.params.id]);

            res.json({
                success: true,
                message: 'Noticia actualizada exitosamente',
                data: noticiaActualizada
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

// DELETE - Eliminar noticia (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDatabase();
        await db.run('UPDATE noticias SET activo = 0 WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Noticia eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
