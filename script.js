// =============== VARIABLES ===============
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const scrollTop = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

// =============== MENU MÓVIL ===============
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// =============== HEADER SCROLL ===============
window.addEventListener('scroll', () => {
    if (window.scrollY >= 80) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
    
    // Mostrar/ocultar botón scroll to top
    if (window.scrollY >= 560) {
        scrollTop.classList.add('show');
    } else {
        scrollTop.classList.remove('show');
    }
});

// =============== ACTIVE LINK ===============
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (sectionsClass) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active-link');
            } else {
                sectionsClass.classList.remove('active-link');
            }
        }
    });
};

window.addEventListener('scroll', scrollActive);

// =============== SCROLL TO TOP ===============
scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// =============== ANIMACIONES AOS (Scroll Animations) ===============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observar todos los elementos con data-aos
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// =============== CONTADOR DE ESTADÍSTICAS ===============
const statsObserverOptions = {
    threshold: 0.5
};

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.parentElement.querySelector('.stat-card__text').textContent.includes('%') ? '%' : '+');
        }
    };

    updateCounter();
};

const statsObserverCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            animateCounter(entry.target);
            entry.target.classList.add('counted');
        }
    });
};

const statsObserver = new IntersectionObserver(statsObserverCallback, statsObserverOptions);

document.querySelectorAll('.stat-card__number').forEach(counter => {
    statsObserver.observe(counter);
});

// =============== FORMULARIO DE CONTACTO ===============
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    // Validación básica
    if (!name || !email || !service || !message) {
        showMessage('Por favor, complete todos los campos obligatorios.', 'error');
        return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Por favor, ingrese un email válido.', 'error');
        return;
    }

    // Crear mensaje para WhatsApp (formato simple compatible con app y web)
    let whatsappMessage = 'Nueva Consulta - Dr. Martin Garcia\n\n';
    whatsappMessage += 'Nombre: ' + name + '\n';
    whatsappMessage += 'Email: ' + email + '\n';
    
    if (phone) {
        whatsappMessage += 'Telefono: ' + phone + '\n';
    }
    
    whatsappMessage += 'Servicio de Interes: ' + service + '\n\n';
    whatsappMessage += 'Mensaje:\n' + message;

    // Número de WhatsApp
    const phoneNumber = '541130082030';
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Detectar si es móvil o escritorio
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let whatsappURL;
    if (isMobile) {
        // En móvil usar el esquema whatsapp://
        whatsappURL = 'whatsapp://send?phone=' + phoneNumber + '&text=' + encodedMessage;
    } else {
        // En escritorio usar api.whatsapp.com que funciona mejor con la app
        whatsappURL = 'https://api.whatsapp.com/send?phone=' + phoneNumber + '&text=' + encodedMessage;
    }
    
    // Log para debugging
    console.log('Mensaje WhatsApp:', whatsappMessage);
    console.log('URL:', whatsappURL);
    console.log('Es móvil:', isMobile);
    
    // Abrir WhatsApp
    window.location.href = whatsappURL;

    // Mostrar mensaje de éxito
    showMessage('¡Redirigiendo a WhatsApp! Si no se abre automáticamente, haga clic en el botón de WhatsApp flotante.', 'success');

    // Limpiar formulario después de un momento
    setTimeout(() => {
        contactForm.reset();
        formMessage.style.display = 'none';
    }, 3000);
});

// Función para mostrar mensajes
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form__message ${type}`;
    formMessage.style.display = 'block';

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// =============== SMOOTH SCROLL ===============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =============== PARALLAX EFECTO ===============
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero__image-wrapper');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// =============== ANIMACIÓN DE TARJETAS AL HOVER ===============
const cards = document.querySelectorAll('.practice-card, .service-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// =============== PRELOADER (Opcional) ===============
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Iniciar animaciones después de cargar
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('aos-animate');
            }, index * 100);
        });
    }, 300);
});

// =============== LAZY LOADING PARA IMÁGENES ===============
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// =============== TYPEWRITER EFECTO (Opcional para el título) ===============
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// =============== CAMBIO DE TEMA (Opcional - Light/Dark Mode) ===============
// Puedes agregar un botón para cambiar entre modo claro y oscuro
const themeButton = document.getElementById('theme-button');

if (themeButton) {
    const getCurrentTheme = () => document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const getCurrentIcon = () => themeButton.classList.contains('fa-moon') ? 'fa-moon' : 'fa-sun';

    const savedTheme = localStorage.getItem('selected-theme');
    const savedIcon = localStorage.getItem('selected-icon');

    if (savedTheme) {
        document.body.classList[savedTheme === 'dark' ? 'add' : 'remove']('dark-theme');
        themeButton.classList[savedIcon === 'fa-moon' ? 'add' : 'remove']('fa-moon');
    }

    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeButton.classList.toggle('fa-moon');
        themeButton.classList.toggle('fa-sun');
        
        localStorage.setItem('selected-theme', getCurrentTheme());
        localStorage.setItem('selected-icon', getCurrentIcon());
    });
}

// =============== VALIDACIÓN EN TIEMPO REAL DEL FORMULARIO ===============
const formInputs = document.querySelectorAll('.form__input, .form__textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '' && this.hasAttribute('required')) {
            this.style.borderColor = 'var(--color-error)';
        } else {
            this.style.borderColor = 'var(--color-primary)';
        }
    });

    input.addEventListener('focus', function() {
        this.style.borderColor = 'var(--color-primary)';
    });
});

// =============== PROTECCIÓN CONTRA SPAM EN FORMULARIO ===============
// Se maneja dentro del event listener principal del formulario

// =============== ANALYTICS (Opcional - Google Analytics) ===============
// Puedes agregar eventos de tracking
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Ejemplo de uso:
document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('Button', 'Click', btn.textContent.trim());
    });
});

// =============== CURSOR PERSONALIZADO (Opcional) ===============
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
    });
});

// =============== CONSOLE MESSAGE ===============
console.log('%c👨‍⚖️ Dr. Martín García - Abogado', 'color: #1a5f7a; font-size: 20px; font-weight: bold;');
console.log('%c📞 Contacto: +54 11 3008-2030', 'color: #546e7a; font-size: 14px;');
console.log('%c✉️ Email: contacto@mgabogado.com.ar', 'color: #546e7a; font-size: 14px;');
