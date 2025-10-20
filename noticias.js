document.addEventListener('DOMContentLoaded', function() {
    const noticiasContainer = document.getElementById('noticiasContainer');
    const busquedaInput = document.getElementById('busquedaNoticias');
    const filtrosBotones = document.querySelectorAll('.filtro-btn');
    const paginacion = document.getElementById('paginacion');
    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');
    const paginaInfo = document.getElementById('paginaInfo');
    
    let todasLasNoticias = [];
    let noticiasFiltradas = [];
    let categoriaActual = 'todas';
    let busquedaActual = '';
    
    const NOTICIAS_POR_PAGINA = 9;
    let paginaActual = 1;
    
    // Cargar todas las noticias al inicio
    cargarNoticias();
    
    async function cargarNoticias() {
        try {
            mostrarCargando();
             const API_BASE_URL = (window.API_BASE_URL)
                ? window.API_BASE_URL.replace(/\/$/, '')
                : ((['localhost', '127.0.0.1'].includes(window.location.hostname))
                    ? 'http://localhost:3000'
                    : window.location.origin);

            const response = await fetch(`${API_BASE_URL}/api/noticias`);
            
            if (!response.ok) {
                throw new Error('Error al cargar las noticias');
            }
            
            const data = await response.json();
            todasLasNoticias = Array.isArray(data.data) ? data.data : [];
            noticiasFiltradas = [...todasLasNoticias];
            
            mostrarNoticias();
        } catch (error) {
            console.error('Error:', error);
            mostrarError();
        }
    }
    
    function mostrarCargando() {
        noticiasContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Cargando noticias...</p>
            </div>
        `;
        paginacion.style.display = 'none';
    }
    
    function mostrarError() {
        noticiasContainer.innerHTML = `
            <div class="error-container">
                <p>⚠ Error al cargar las noticias</p>
                <button onclick="location.reload()" class="btn-primary">Reintentar</button>
            </div>
        `;
        paginacion.style.display = 'none';
    }
    
    function mostrarNoticias() {
        if (noticiasFiltradas.length === 0) {
            noticiasContainer.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <h3>No se encontraron noticias</h3>
                    <p>Intenta con otros filtros o búsqueda</p>
                </div>
            `;
            paginacion.style.display = 'none';
            return;
        }
        
        // Calcular paginación
        const totalPaginas = Math.ceil(noticiasFiltradas.length / NOTICIAS_POR_PAGINA);
        const inicio = (paginaActual - 1) * NOTICIAS_POR_PAGINA;
        const fin = inicio + NOTICIAS_POR_PAGINA;
        const noticiasPagina = noticiasFiltradas.slice(inicio, fin);
        
        // Mostrar noticias
        noticiasContainer.innerHTML = noticiasPagina.map(noticia => crearTarjetaNoticia(noticia)).join('');
        
        // Actualizar paginación
        if (totalPaginas > 1) {
            paginacion.style.display = 'flex';
            paginaInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;
            btnPrevPage.disabled = paginaActual === 1;
            btnNextPage.disabled = paginaActual === totalPaginas;
        } else {
            paginacion.style.display = 'none';
        }
    }
    
    function crearTarjetaNoticia(noticia) {
        const fecha = noticia.fecha ? new Date(noticia.fecha) : new Date();
        const fechaFormateada = fecha.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const categoriaColores = {
            'academica': '#2563eb',
            'deportiva': '#16a34a',
            'cultural': '#9333ea',
            'institucional': '#dc2626'
        };
        
         const categoriaKey = noticia.categoria ? noticia.categoria.toLowerCase() : '';
        const categoria = categoriaKey ? categoriaKey.charAt(0).toUpperCase() + categoriaKey.slice(1) : 'General';
        const colorCategoria = categoriaColores[categoriaKey] || '#6b7280';
        const resumen = noticia.resumen || noticia.contenido || '';
        
        return `
            <article class="noticia-card-full">
                <div class="noticia-imagen">
                    <img src="${noticia.imagen || 'https://via.placeholder.com/400x250?text=Colegio+Monteverde'}"
                         alt="${noticia.titulo}">
                    <span class="noticia-categoria" style="background-color: ${colorCategoria}">
                        ${categoria}
                    </span>
                </div>
                <div class="noticia-contenido">
                    <div class="noticia-meta">
                        <span class="noticia-fecha">📅 ${fechaFormateada}</span>
                    </div>
                    <h3 class="noticia-titulo">${noticia.titulo}</h3>
                   <p class="noticia-resumen">${resumen.substring(0, 150)}${resumen.length > 150 ? '...' : ''}</p>
                    <button class="btn-leer-mas" onclick="verNoticiaCompleta(${noticia.id})">
                        Leer más →
                    </button>
                </div>
            </article>
        `;
    }
    
    // Función global para ver noticia completa
    window.verNoticiaCompleta = function(id) {
        const noticia = todasLasNoticias.find(n => n.id === id);
        if (!noticia) return;
        
         const fecha = noticia.fecha ? new Date(noticia.fecha) : new Date();
        const fechaFormateada = fecha.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const categoriaColores = {
            'academica': '#2563eb',
            'deportiva': '#16a34a',
            'cultural': '#9333ea',
            'institucional': '#dc2626'
        };
        
        
        const categoriaKey = noticia.categoria ? noticia.categoria.toLowerCase() : '';
        const categoria = categoriaKey ? categoriaKey.charAt(0).toUpperCase() + categoriaKey.slice(1) : 'General';
        const colorCategoria = categoriaColores[categoriaKey] || '#6b7280';
        const contenido = noticia.contenido || noticia.resumen || '';
        
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'modal-noticia';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="cerrarModal()"></div>
            <div class="modal-contenido">
                <button class="modal-cerrar" onclick="cerrarModal()">✕</button>
                <div class="modal-body">
                    <img src="${noticia.imagen || 'https://via.placeholder.com/800x400?text=Colegio+Monteverde'}" 
                         alt="${noticia.titulo}" class="modal-imagen">
                    <div class="modal-info">
                        <span class="noticia-categoria" style="background-color: ${colorCategoria}">
                            ${noticia.categoria}
                        </span>
                        <span class="noticia-fecha">📅 ${fechaFormateada}</span>
                    </div>
                    <h2>${noticia.titulo}</h2>
                    <div class="modal-contenido-texto">
                        ${contenido}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    };
    
    window.cerrarModal = function() {
        const modal = document.querySelector('.modal-noticia');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    };
    
    // Filtros por categoría
    filtrosBotones.forEach(boton => {
        boton.addEventListener('click', function() {
            // Actualizar botón activo
            filtrosBotones.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            categoriaActual = this.getAttribute('data-categoria');
            paginaActual = 1;
            aplicarFiltros();
        });
    });
    
    // Búsqueda
    let timeoutBusqueda;
    busquedaInput.addEventListener('input', function() {
        clearTimeout(timeoutBusqueda);
        timeoutBusqueda = setTimeout(() => {
            busquedaActual = this.value.toLowerCase().trim();
            paginaActual = 1;
            aplicarFiltros();
        }, 300);
    });
    
    function aplicarFiltros() {
        noticiasFiltradas = todasLasNoticias.filter(noticia => {
            // Filtro de categoría
            const cumpleCategoria = categoriaActual === 'todas' || noticia.categoria === categoriaActual;
            
            // Filtro de búsqueda
            const cumpleBusqueda = busquedaActual === '' || 
                                   noticia.titulo.toLowerCase().includes(busquedaActual) ||
                                   noticia.contenido.toLowerCase().includes(busquedaActual);
            
            return cumpleCategoria && cumpleBusqueda;
        });
        
        mostrarNoticias();
    }
    
    // Paginación
    btnPrevPage.addEventListener('click', function() {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarNoticias();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    btnNextPage.addEventListener('click', function() {
        const totalPaginas = Math.ceil(noticiasFiltradas.length / NOTICIAS_POR_PAGINA);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarNoticias();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});
