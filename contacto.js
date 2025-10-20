// ===============================================
// FORMULARIO DE CONTACTO
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Deshabilitar botón
            submitBtn.disabled = true;
            document.querySelector('.btn-text').style.display = 'none';
            document.querySelector('.btn-loading').style.display = 'inline';
            
            // Limpiar mensajes anteriores
            formStatus.innerHTML = '';
            formStatus.className = 'form-status';
            
            // Obtener datos del formulario
            const formData = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefono: document.getElementById('telefono').value.trim() || null,
                asunto: document.getElementById('asunto').value,
                mensaje: document.getElementById('mensaje').value.trim()
            };
            
            // Validación básica
            if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
                showMessage('error', 'Por favor, completa todos los campos obligatorios.');
                resetButton();
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showMessage('error', 'Por favor, ingresa un correo electrónico válido.');
                resetButton();
                return;
            }
            
            try {
                // Enviar a la API
                const response = await fetch('http://localhost:3000/api/contacto/enviar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    showMessage('success', '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
                    contactForm.reset();
                } else {
                    showMessage('error', data.message || 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
                }
                
            } catch (error) {
                console.error('Error al enviar formulario:', error);
                showMessage('error', 'No se pudo conectar con el servidor. Por favor, intenta más tarde o contáctanos por teléfono.');
            } finally {
                resetButton();
            }
        });
    }
    
    function showMessage(type, message) {
        formStatus.className = `form-status ${type}`;
        formStatus.innerHTML = `
            <div class="status-icon">
                ${type === 'success' ? '✓' : '⚠'}
            </div>
            <div class="status-message">${message}</div>
        `;
        formStatus.style.display = 'flex';
        
        // Scroll al mensaje
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    function resetButton() {
        submitBtn.disabled = false;
        document.querySelector('.btn-text').style.display = 'inline';
        document.querySelector('.btn-loading').style.display = 'none';
    }
});
