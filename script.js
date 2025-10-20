// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });

    // Header background on scroll
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.info-card, .news-card, .contact-card, .stat, .proyecto-card, .equipo-card, .vida-feature, .jornada-card, .galeria-item, .apoderado-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Prevent scroll jumping when clicking on empty href="#" links
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===============================================
// CARGAR ÚLTIMAS NOTICIAS DESDE LA API
// ===============================================
async function cargarUltimasNoticias() {
    const noticiasContainer = document.getElementById('ultimas-noticias');
    
    if (!noticiasContainer) return;

      const API_BASE_URL = (window.API_BASE_URL)
        ? window.API_BASE_URL.replace(/\/$/, '')
        : ((['localhost', '127.0.0.1'].includes(window.location.hostname))
            ? 'http://localhost:3000'
            : window.location.origin);

    
    try {
        const response = await fetch(`${API_BASE_URL}/api/noticias?limit=3`);
        
        if (!response.ok) {
            throw new Error('Error al cargar noticias');
        }
        
        const data = await response.json();
        
         if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            noticiasContainer.innerHTML = '';
            
            data.data.forEach(noticia => {
               const fecha = noticia.fecha ? new Date(noticia.fecha) : new Date();
                const dia = fecha.getDate().toString().padStart(2, '0');
                const mes = fecha.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
                const anio = fecha.getFullYear();
                
                // Limitar resumen a 150 caracteres
                const resumen = noticia.resumen || noticia.contenido || '';
                const resumenCorto = resumen.length > 150
                    ? resumen.substring(0, 150) + '...'
                    : resumen;
                
                // Determinar color de categoría
                const categoriaColors = {
                    'academica': '#8B1538',
                    'deportiva': '#2C3E50',
                    'cultural': '#C9A961',
                    'institucional': '#495057'
                };
                 const categoriaKey = noticia.categoria ? noticia.categoria.toLowerCase() : '';
                const categoriaColor = categoriaColors[categoriaKey] || '#6C757D';
                const categoriaLabel = categoriaKey
                    ? categoriaKey.charAt(0).toUpperCase() + categoriaKey.slice(1)
                    : 'General';
                
                const noticiaHTML = `
                    <article class="noticia-card">
                        <div class="noticia-fecha">${dia} ${mes} ${anio}</div>
                        <div class="noticia-contenido">
                            <span class="noticia-categoria" style="background: ${categoriaColor}">
                               ${categoriaLabel}
                            </span>
                            <h3>${noticia.titulo}</h3>
                            <p>${resumenCorto}</p>
                            <a href="noticias.html?id=${noticia.id}" class="noticia-link">Leer más →</a>
                        </div>
                    </article>
                `;
                
                noticiasContainer.innerHTML += noticiaHTML;
            });
            
            // Animar las cards recién cargadas
            document.querySelectorAll('.noticia-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            });
            
        } else {
            noticiasContainer.innerHTML = '<p class="loading">No hay noticias disponibles en este momento.</p>';
        }
        
    } catch (error) {
        console.error('Error al cargar noticias:', error);
        noticiasContainer.innerHTML = `
            <div class="loading">
                <p>No se pudieron cargar las noticias.</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Por favor, intenta de nuevo más tarde.</p>
            </div>
        `;
    }
}

// Cargar noticias cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarUltimasNoticias);
} else {
    cargarUltimasNoticias();
}
