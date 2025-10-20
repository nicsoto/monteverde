// SEO Structured Data (Schema.org) para Colegio Monteverde
// Este script agrega JSON-LD structured data para mejorar el SEO y rich snippets

(function() {
    'use strict';

    // Estructura base de la organización (School)
    const schoolSchema = {
        "@context": "https://schema.org",
        "@type": "School",
        "@id": "https://www.colegiomonteverde.cl/#school",
        "name": "Colegio Monteverde",
        "alternateName": "Fundación Educacional Monteverde",
        "url": "https://www.colegiomonteverde.cl",
        "logo": "https://www.colegiomonteverde.cl/images/logo.png",
        "image": "https://www.colegiomonteverde.cl/images/colegio.jpg",
        "description": "Colegio Monteverde - Educación de excelencia desde Pre-Kínder hasta 4° Medio. Formando el futuro de nuestros estudiantes con valores y compromiso académico.",
        "foundingDate": "2010",
        "slogan": "Formando el futuro de nuestros estudiantes",
        
        // Información de contacto principal
        "telephone": "+56222780758",
        "email": "colegios@colegiomonteverde.cl",
        
        // Sedes del colegio (LocalBusiness)
        "location": [
            {
                "@type": "Place",
                "name": "Sede Tagua Tagua",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Tagua Tagua 7575",
                    "addressLocality": "Peñalolén",
                    "addressRegion": "Región Metropolitana",
                    "addressCountry": "CL",
                    "postalCode": "7910000"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "-33.4850",
                    "longitude": "-70.5300"
                },
                "telephone": "+56222780758"
            },
            {
                "@type": "Place",
                "name": "Sede Caburga",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Caburga 7750",
                    "addressLocality": "Peñalolén",
                    "addressRegion": "Región Metropolitana",
                    "addressCountry": "CL",
                    "postalCode": "7910000"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "-33.4860",
                    "longitude": "-70.5320"
                },
                "telephone": "+56222780759"
            }
        ],

        // Programas educativos ofrecidos
        "availableService": [
            {
                "@type": "EducationalOccupationalProgram",
                "name": "Educación Pre-Básica",
                "description": "Pre-Kínder y Kínder",
                "educationalCredentialAwarded": "Certificado Pre-Básica"
            },
            {
                "@type": "EducationalOccupationalProgram",
                "name": "Educación Básica",
                "description": "1° a 8° Básico",
                "educationalCredentialAwarded": "Licencia de Educación Básica"
            },
            {
                "@type": "EducationalOccupationalProgram",
                "name": "Educación Media",
                "description": "1° a 4° Medio",
                "educationalCredentialAwarded": "Licencia de Educación Media"
            }
        ],

        // Redes sociales
        "sameAs": [
            "https://www.facebook.com/colegiomonteverde",
            "https://www.instagram.com/colegiomonteverde"
        ],

        // Horario de atención
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "17:00"
            }
        ],

        // Punto de contacto principal
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": "+56222780758",
                "contactType": "Admisiones",
                "email": "admisiones@colegiomonteverde.cl",
                "availableLanguage": "Spanish",
                "areaServed": "CL"
            },
            {
                "@type": "ContactPoint",
                "telephone": "+56222780758",
                "contactType": "Dirección",
                "email": "direccion@colegiomonteverde.cl",
                "availableLanguage": "Spanish",
                "areaServed": "CL"
            },
            {
                "@type": "ContactPoint",
                "telephone": "+56222780758",
                "contactType": "Secretaría",
                "email": "secretaria@colegiomonteverde.cl",
                "availableLanguage": "Spanish",
                "areaServed": "CL"
            }
        ],

        // Organización matriz
        "parentOrganization": {
            "@type": "Organization",
            "name": "Fundación Educacional Monteverde",
            "taxID": "65.135.544-3"
        }
    };

    // LocalBusiness para cada sede (para búsquedas locales)
    const sedeTagua = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://www.colegiomonteverde.cl/#sede-tagua",
        "name": "Colegio Monteverde - Sede Tagua Tagua",
        "image": "https://www.colegiomonteverde.cl/images/sede-tagua.jpg",
        "telephone": "+56222780758",
        "email": "colegios@colegiomonteverde.cl",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Tagua Tagua 7575",
            "addressLocality": "Peñalolén",
            "addressRegion": "Región Metropolitana",
            "addressCountry": "CL",
            "postalCode": "7910000"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-33.4850",
            "longitude": "-70.5300"
        },
        "url": "https://www.colegiomonteverde.cl",
        "priceRange": "$$",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "17:00"
            }
        ]
    };

    const sedeCaburga = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://www.colegiomonteverde.cl/#sede-caburga",
        "name": "Colegio Monteverde - Sede Caburga",
        "image": "https://www.colegiomonteverde.cl/images/sede-caburga.jpg",
        "telephone": "+56222780759",
        "email": "colegios@colegiomonteverde.cl",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Caburga 7750",
            "addressLocality": "Peñalolén",
            "addressRegion": "Región Metropolitana",
            "addressCountry": "CL",
            "postalCode": "7910000"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-33.4860",
            "longitude": "-70.5320"
        },
        "url": "https://www.colegiomonteverde.cl",
        "priceRange": "$$",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "17:00"
            }
        ]
    };

    // BreadcrumbList para navegación (se agrega dinámicamente según la página)
    function createBreadcrumb() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop().replace('.html', '') || 'index';
        
        const breadcrumbMap = {
            'index': 'Inicio',
            'nosotros': 'Nosotros',
            'profesores': 'Profesores',
            'directivos': 'Directivos',
            'coordinacion': 'Coordinación',
            'asistentes': 'Asistentes',
            'vida-escolar': 'Vida Escolar',
            'admision': 'Admisión',
            'apoderados': 'Apoderados',
            'noticias': 'Noticias',
            'contacto': 'Contacto',
            'protocolos': 'Protocolos',
            'planes': 'Planes Institucionales',
            'centro-alumnos': 'Centro de Alumnos'
        };

        const breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Inicio",
                    "item": "https://www.colegiomonteverde.cl/"
                }
            ]
        };

        if (pageName !== 'index' && breadcrumbMap[pageName]) {
            breadcrumb.itemListElement.push({
                "@type": "ListItem",
                "position": 2,
                "name": breadcrumbMap[pageName],
                "item": `https://www.colegiomonteverde.cl/${pageName}.html`
            });
        }

        return breadcrumb;
    }

    // WebSite schema para search box
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://www.colegiomonteverde.cl/#website",
        "url": "https://www.colegiomonteverde.cl",
        "name": "Colegio Monteverde",
        "description": "Sitio web oficial del Colegio Monteverde - Educación de excelencia en Peñalolén",
        "publisher": {
            "@id": "https://www.colegiomonteverde.cl/#school"
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.colegiomonteverde.cl/noticias.html?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };

    // Función para insertar JSON-LD en el head
    function insertStructuredData(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    // Insertar todos los schemas al cargar la página
    function init() {
        // Schema principal de la escuela
        insertStructuredData(schoolSchema);
        
        // LocalBusiness para cada sede
        insertStructuredData(sedeTagua);
        insertStructuredData(sedeCaburga);
        
        // WebSite schema
        insertStructuredData(websiteSchema);
        
        // Breadcrumb dinámico
        insertStructuredData(createBreadcrumb());

        // Schema específico para página de noticias
        if (window.location.pathname.includes('noticias.html')) {
            const blogSchema = {
                "@context": "https://schema.org",
                "@type": "Blog",
                "name": "Noticias - Colegio Monteverde",
                "description": "Últimas noticias y eventos del Colegio Monteverde",
                "url": "https://www.colegiomonteverde.cl/noticias.html",
                "publisher": {
                    "@id": "https://www.colegiomonteverde.cl/#school"
                }
            };
            insertStructuredData(blogSchema);
        }

        // Schema específico para página de contacto
        if (window.location.pathname.includes('contacto.html')) {
            const contactSchema = {
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": "Contacto - Colegio Monteverde",
                "description": "Información de contacto y ubicación del Colegio Monteverde",
                "url": "https://www.colegiomonteverde.cl/contacto.html",
                "mainEntity": {
                    "@id": "https://www.colegiomonteverde.cl/#school"
                }
            };
            insertStructuredData(contactSchema);
        }

        console.log('✓ SEO Structured Data cargado correctamente');
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
