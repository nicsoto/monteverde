import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../config/database.js';

const router = express.Router();

// GET - Obtener todas las circulares activas
router.get('/', async (req, res) => {
    try {
        const db = await getDatabase();
        const { limit = 10, offset = 0, tipo } = req.query;

        let query = 'SELECT * FROM circulares WHERE activo = 1';
        const params = [];

        if (tipo) {
            query += ' AND tipo = ?';
            params.push(tipo);
        }

        query += ' ORDER BY fecha DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const circulares = await db.all(query, params);

        let countQuery = 'SELECT COUNT(*) as count FROM circulares WHERE activo = 1';
        if (tipo) {
            countQuery += ' AND tipo = ?';
            const total = await db.get(countQuery, [tipo]);
            return res.json({
                success: true,
                data: circulares,
                total: total.count,
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
        }

        const total = await db.get(countQuery);

        res.json({
            success: true,
            data: circulares,
            total: total.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET - Obtener circular por ID
router.get('/:id', async (req, res) => {
    try {
        const db = await getDatabase();
        const circular = await db.get(
            'SELECT * FROM circulares WHERE id = ? AND activo = 1',
            [req.params.id]
        );

        if (!circular) {
            return res.status(404).json({ success: false, error: 'Circular no encontrada' });
        }

        res.json({ success: true, data: circular });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - Crear nueva circular
router.post('/',
    [
        body('numero').notEmpty().trim().withMessage('El número de circular es requerido'),
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
            const { numero, titulo, contenido, fecha, archivo_url, tipo } = req.body;

            const result = await db.run(
                'INSERT INTO circulares (numero, titulo, contenido, fecha, archivo_url, tipo) VALUES (?, ?, ?, ?, ?, ?)',
                [numero, titulo, contenido, fecha, archivo_url || null, tipo || 'general']
            );

            const nuevaCircular = await db.get('SELECT * FROM circulares WHERE id = ?', [result.lastID]);

            res.status(201).json({
                success: true,
                message: 'Circular creada exitosamente',
                data: nuevaCircular
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

// PUT - Actualizar circular
router.put('/:id', async (req, res) => {
    try {
        const db = await getDatabase();
        const { numero, titulo, contenido, fecha, archivo_url, tipo, activo } = req.body;

        const updates = [];
        const values = [];

        if (numero) {
            updates.push('numero = ?');
            values.push(numero);
        }
        if (titulo) {
            updates.push('titulo = ?');
            values.push(titulo);
        }
        if (contenido) {
            updates.push('contenido = ?');
            values.push(contenido);
        }
        if (fecha) {
            updates.push('fecha = ?');
            values.push(fecha);
        }
        if (archivo_url !== undefined) {
            updates.push('archivo_url = ?');
            values.push(archivo_url);
        }
        if (tipo) {
            updates.push('tipo = ?');
            values.push(tipo);
        }
        if (activo !== undefined) {
            updates.push('activo = ?');
            values.push(activo ? 1 : 0);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(req.params.id);

        await db.run(
            `UPDATE circulares SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        const circularActualizada = await db.get('SELECT * FROM circulares WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Circular actualizada exitosamente',
            data: circularActualizada
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE - Eliminar circular (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDatabase();
        await db.run('UPDATE circulares SET activo = 0 WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Circular eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
