import { initDatabase, getDatabase } from '../config/database.js';

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando base de datos...');
        await initDatabase();

        const db = await getDatabase();

        // Insertar noticias de ejemplo
        console.log('📰 Insertando noticias de ejemplo...');
        
        await db.run(`
            INSERT INTO noticias (titulo, contenido, resumen, fecha) VALUES 
            ('Admisión Escolar 2026', 
             'Ya está abierto el proceso de admisión escolar 2026 a través del Sistema de Admisión Escolar (SAE). Invitamos a las familias a registrarse anticipadamente en la plataforma oficial.',
             'Ya está abierto el proceso de postulación para becas 2026. Revisa los requisitos y plazos.',
             '2025-07-23'),
            
            ('Cuenta Pública 2024',
             'Estimada Comunidad Educativa: Compartimos con ustedes la Cuenta Pública correspondiente al año 2024 de nuestro establecimiento educacional. En ella podrán encontrar información sobre la marcha del colegio y los resultados académicos del período.',
             'Revisa la cuenta pública correspondiente al año 2024 de nuestro establecimiento.',
             '2025-03-31'),
            
            ('Lista de Útiles 2025',
             'Ya está disponible la lista de útiles escolares para el año 2025. Pueden descargar los listados por curso desde nuestra página web.',
             'Lista de útiles escolares 2025 disponible para descarga.',
             '2025-01-04')
        `);

        // Insertar circulares de ejemplo
        console.log('📋 Insertando circulares de ejemplo...');
        
        await db.run(`
            INSERT INTO circulares (numero, titulo, contenido, fecha, tipo) VALUES 
            ('20251002',
             'Proceso de Becas año 2026',
             'Estimados Padres y Apoderados: Informamos que ya está abierto el proceso de postulación a becas socioeconómicas para el año 2026. El plazo de postulación es hasta el 31 de octubre de 2025.',
             '2025-10-02',
             'becas'),
            
            ('20250408',
             'Adecuación Protocolo',
             'Se informa a la comunidad educativa sobre las adecuaciones realizadas al protocolo de convivencia escolar.',
             '2025-04-08',
             'general'),
            
            ('20250319',
             'Reuniones de Apoderados',
             'Estimados apoderados: Se convoca a reunión de apoderados según calendario adjunto.',
             '2025-03-19',
             'general')
        `);

        // Insertar documentos de ejemplo
        console.log('📄 Insertando documentos de ejemplo...');
        
        await db.run(`
            INSERT INTO documentos (nombre, descripcion, categoria, archivo_url, tamano) VALUES 
            ('Lista de Útiles Kinder 2025', 'Material requerido para nivel Kinder', 'listas-utiles', '/docs/kinder-2025.pdf', 52000),
            ('Lista de Útiles 1° Básico 2025', 'Material requerido para 1° básico', 'listas-utiles', '/docs/1basico-2025.pdf', 54000),
            ('Reglamento Interno 2025', 'Reglamento interno del establecimiento', 'reglamentos', '/docs/reglamento-2025.pdf', 350000),
            ('Manual de Convivencia', 'Manual de convivencia escolar', 'reglamentos', '/docs/manual-convivencia.pdf', 280000),
            ('Calendario Escolar 2025', 'Calendario académico año 2025', 'calendarios', '/docs/calendario-2025.pdf', 125000)
        `);

        console.log('✅ Base de datos poblada exitosamente');
        console.log('📊 Resumen:');
        
        const countNoticias = await db.get('SELECT COUNT(*) as count FROM noticias');
        const countCirculares = await db.get('SELECT COUNT(*) as count FROM circulares');
        const countDocumentos = await db.get('SELECT COUNT(*) as count FROM documentos');
        
        console.log(`   - Noticias: ${countNoticias.count}`);
        console.log(`   - Circulares: ${countCirculares.count}`);
        console.log(`   - Documentos: ${countDocumentos.count}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
        process.exit(1);
    }
}

seedDatabase();
