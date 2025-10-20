import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../config/database.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configurar transporter de nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// POST - Enviar mensaje de contacto
router.post('/',
    [
        body('nombre').notEmpty().trim().withMessage('El nombre es requerido'),
        body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
        body('telefono').optional().trim(),
        body('asunto').notEmpty().trim().withMessage('El asunto es requerido'),
        body('mensaje').notEmpty().trim().withMessage('El mensaje es requerido')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const db = await getDatabase();
            const { nombre, email, telefono, asunto, mensaje } = req.body;

            // Guardar en la base de datos
            const result = await db.run(
                'INSERT INTO mensajes_contacto (nombre, email, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)',
                [nombre, email, telefono || null, asunto, mensaje]
            );

            // Enviar email (opcional, comentado por si no tienes configurado el SMTP)
            try {
                await transporter.sendMail({
                    from: `"${nombre}" <${process.env.EMAIL_FROM}>`,
                    to: process.env.EMAIL_TO,
                    replyTo: email,
                    subject: `Contacto Web: ${asunto}`,
                    html: `
                        <h2>Nuevo mensaje de contacto - Colegio Monteverde</h2>
                        <p><strong>Nombre:</strong> ${nombre}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
                        <p><strong>Asunto:</strong> ${asunto}</p>
                        <hr>
                        <p><strong>Mensaje:</strong></p>
                        <p>${mensaje.replace(/\n/g, '<br>')}</p>
                    `
                });
                console.log('✅ Email enviado correctamente');
            } catch (emailError) {
                console.error('⚠️  Error al enviar email:', emailError.message);
                // Continuar aunque falle el email
            }

            res.status(201).json({
                success: true,
                message: 'Mensaje enviado exitosamente',
                id: result.lastID
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

// GET - Obtener todos los mensajes de contacto (para admin)
router.get('/', async (req, res) => {
    try {
        const db = await getDatabase();
        const { limit = 50, offset = 0, leido } = req.query;

        let query = 'SELECT * FROM mensajes_contacto';
        const params = [];

        if (leido !== undefined) {
            query += ' WHERE leido = ?';
            params.push(leido === 'true' ? 1 : 0);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const mensajes = await db.all(query, params);

        res.json({
            success: true,
            data: mensajes,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT - Marcar mensaje como leído
router.put('/:id/leido', async (req, res) => {
    try {
        const db = await getDatabase();
        await db.run(
            'UPDATE mensajes_contacto SET leido = 1 WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Mensaje marcado como leído'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE - Eliminar mensaje
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDatabase();
        await db.run('DELETE FROM mensajes_contacto WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Mensaje eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
