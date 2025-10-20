import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

export async function getDatabase() {
    if (db) return db;

    const dbPath = process.env.DB_PATH || './database/monteverde.db';
    
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error al abrir la base de datos:', err);
        } else {
            console.log('✅ Conectado a la base de datos SQLite');
        }
    });

    // Convertir a promesas para facilitar el uso
    db.all = promisify(db.all.bind(db));
    db.get = promisify(db.get.bind(db));
    db.run = promisify(db.run.bind(db));

    return db;
}

function promisify(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };
}

export async function initDatabase() {
    const database = await getDatabase();

    // Habilitar foreign keys
    await database.run('PRAGMA foreign_keys = ON');

    // Tabla de Noticias
    await database.run(`
        CREATE TABLE IF NOT EXISTS noticias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            contenido TEXT NOT NULL,
            resumen TEXT,
            fecha DATE NOT NULL,
            imagen TEXT,
            activo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabla de Circulares
    await database.run(`
        CREATE TABLE IF NOT EXISTS circulares (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL,
            titulo TEXT NOT NULL,
            contenido TEXT NOT NULL,
            fecha DATE NOT NULL,
            archivo_url TEXT,
            tipo TEXT DEFAULT 'general',
            activo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabla de Documentos
    await database.run(`
        CREATE TABLE IF NOT EXISTS documentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            categoria TEXT NOT NULL,
            archivo_url TEXT NOT NULL,
            tamano INTEGER,
            activo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabla de Mensajes de Contacto
    await database.run(`
        CREATE TABLE IF NOT EXISTS mensajes_contacto (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL,
            telefono TEXT,
            asunto TEXT NOT NULL,
            mensaje TEXT NOT NULL,
            leido INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('✅ Base de datos inicializada correctamente');
    return database;
}

export default { getDatabase, initDatabase };
