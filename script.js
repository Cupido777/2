// script.js - OPTIMIZADO PARA MÁXIMO RENDIMIENTO - TODAS LAS MEJORAS INTEGRADAS

// === NUEVAS OPTIMIZACIONES DE PERFORMANCE AVANZADAS ===

// Cargar recursos críticos primero con prioridad
function loadCriticalResources() {
  // Preload de imágenes críticas con fetchpriority
  const criticalImages = [
    { src: './logo.jpg', priority: 'high' },
    { src: './tu-foto.jpg', priority: 'high' }
  ];
  
  criticalImages.forEach(({ src, priority }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.setAttribute('fetchpriority', priority);
    document.head.appendChild(link);
  });

  // Preconectar a dominios críticos
  const criticalDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com'
  ];
}

// === NUEVO: SISTEMA DE CARGA PROGRESIVA ===
class LoadingSystem {
  constructor() {
    this.progress = 0;
    this.totalResources = 0;
    this.loadedResources = 0;
    this.progressBar = document.getElementById('loading-progress');
    this.progressFill = document.querySelector('.progress-fill');
  }

  init() {
    this.startLoading();
    this.trackResources();
  }

  startLoading() {
    if (this.progressBar) {
      this.progressBar.classList.add('loading');
      this.updateProgress(10);
    }
  }

  trackResources() {
    // Contar imágenes y recursos
    const images = document.querySelectorAll('img');
    const audios = document.querySelectorAll('audio');
    this.totalResources = images.length + audios.length;

    // Trackear carga de imágenes
    images.forEach(img => {
      if (img.complete) {
        this.resourceLoaded();
      } else {
        img.addEventListener('load', () => this.resourceLoaded());
        img.addEventListener('error', () => this.resourceLoaded());
      }
    });

    // Trackear carga de audios
    audios.forEach(audio => {
      audio.addEventListener('loadeddata', () => this.resourceLoaded());
      audio.addEventListener('error', () => this.resourceLoaded());
    });

    // Forzar progreso mínimo
    setTimeout(() => {
      if (this.progress < 90) {
        this.updateProgress(90);
      }
    }, 1000);
  }

  resourceLoaded() {
    this.loadedResources++;
    const newProgress = 10 + (this.loadedResources / this.totalResources) * 80;
    this.updateProgress(Math.min(newProgress, 90));
  }

  updateProgress(percent) {
    this.progress = percent;
    if (this.progressFill) {
      this.progressFill.style.width = `${percent}%`;
    }

    // Completar carga
    if (percent >= 90) {
      setTimeout(() => this.completeLoading(), 300);
    }
  }

  completeLoading() {
    this.updateProgress(100);
    setTimeout(() => {
      if (this.progressBar) {
        this.progressBar.classList.remove('loading');
      }
    }, 500);
  }
}

// === FUNCIÓN REUTILIZABLE PARA TARJETAS DE AUDIO OPTIMIZADA ===
function initAudioCard(cardId, audioId) {
  const projectCard = document.getElementById(cardId);
  const audio = document.getElementById(audioId);

  if (projectCard && audio) {
    // Obtener elementos del reproductor mini
    const audioPlayer = projectCard.querySelector('.audio-player-mini');
    const playBtn = projectCard.querySelector('.audio-play-btn');
    const progressBar = projectCard.querySelector('.audio-progress');
    const audioTime = projectCard.querySelector('.audio-time');

    // Función para formatear el tiempo
    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // Actualizar progreso y tiempo
    function updateProgress() {
      if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percent}%`;
        audioTime.textContent = formatTime(audio.currentTime);
      }
    }

    // Actualizar estado visual del reproductor
    function updatePlayerState() {
      if (audio.paused) {
        playBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>';
        audioPlayer.classList.remove('playing');
      } else {
        playBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
        audioPlayer.classList.add('playing');
      }
    }

    // SOLO CLICK EN BOTÓN PLAY - Eliminada reproducción automática
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      // Pausar todos los demás audios antes de reproducir
      document.querySelectorAll('audio').forEach(otherAudio => {
        if (otherAudio !== audio && !otherAudio.paused) {
          otherAudio.pause();
          otherAudio.currentTime = 0;
          // Actualizar estado visual de otros reproductores
          const otherPlayer = otherAudio.closest('.project-card')?.querySelector('.audio-player-mini');
          if (otherPlayer) {
            otherPlayer.classList.remove('playing');
            otherPlayer.querySelector('.audio-play-btn').innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>';
          }
        }
      });

      if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Error al reproducir audio:', error);
            updatePlayerState();
          });
        }
      } else {
        audio.pause();
      }
      updatePlayerState();
    });

    // Actualizar progreso continuamente
    audio.addEventListener('timeupdate', updateProgress);

    // Actualizar estado cuando el audio se reproduce o pausa
    audio.addEventListener('play', updatePlayerState);
    audio.addEventListener('pause', updatePlayerState);

    // Reiniciar cuando termina
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      updatePlayerState();
      updateProgress();
    });

    // Inicializar duración cuando esté cargada
    audio.addEventListener('loadedmetadata', () => {
      updateProgress();
    });

    // Manejar errores de carga
    audio.addEventListener('error', () => {
      console.error(`Error cargando audio: ${audioId}`);
      playBtn.disabled = true;
      playBtn.innerHTML = '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>';
      playBtn.title = 'Error cargando audio';
    });

    // Marcar como preproducción si el badge lo indica
    const projectBadge = projectCard.querySelector('.project-badge');
    if (projectBadge && projectBadge.textContent.includes('PRODUCCIÓN')) {
      audioPlayer.classList.add('preproduction');
    }
  }
}

// === NUEVO: SISTEMA DE ANIMACIONES OPTIMIZADO ===
class AnimationSystem {
  constructor() {
    this.observer = null;
    this.animatedElements = new Set();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          entry.target.classList.add('show');
          this.animatedElements.add(entry.target);
          
          // Dejar de observar después de la animación
          setTimeout(() => {
            this.observer.unobserve(entry.target);
          }, 1000);
        }
      });
    }, options);

    // Observar todos los elementos con clase fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
      this.observer.observe(el);
    });
  }

  setupScrollAnimations() {
    // Throttle para scroll
    let scrollTimeout;
    const handleScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          this.updateScrollEffects();
          scrollTimeout = null;
        }, 10);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  updateScrollEffects() {
    // Efectos adicionales basados en scroll pueden ir aquí
  }
}

// === OPTIMIZACIÓN DE EVENT LISTENERS ===
function optimizeEventListeners() {
  // Usar event delegation para mejor performance
  document.addEventListener('click', function(e) {
    // Delegación para acordeón
    if (e.target.closest('.service-accordion-header')) {
      const header = e.target.closest('.service-accordion-header');
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Cerrar todos los acordeones
      document.querySelectorAll('.service-accordion-item').forEach(accItem => {
        accItem.classList.remove('active');
      });
      
      // Abrir el clickeado si no estaba activo
      if (!isActive) {
        item.classList.add('active');
        
        // Scroll suave para acordeones abiertos
        setTimeout(() => {
          item.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest',
            inline: 'nearest'
          });
        }, 300);
      }
    }
    
    // Delegación para modal de contacto
    if (e.target.classList.contains('open-contact-modal') || 
        e.target.closest('.open-contact-modal')) {
      e.preventDefault();
      const modal = document.getElementById('contact-modal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Enfocar el primer campo del formulario
        setTimeout(() => {
          const firstInput = modal.querySelector('input, select, textarea');
          if (firstInput) firstInput.focus();
        }, 300);
      }
    }
    
    // Delegación para cerrar modal
    if (e.target.classList.contains('modal-close') || 
        e.target.closest('.modal-close') ||
        e.target.id === 'contact-modal') {
      const modal = document.getElementById('contact-modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    }
  }, { passive: true });

  // Keyboard navigation mejorada
  document.addEventListener('keydown', function(e) {
    // Cerrar modal con ESC
    if (e.key === 'Escape') {
      const modal = document.getElementById('contact-modal');
      if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    }

    // Navegación con teclado en menú móvil
    if (e.key === 'Tab' && document.getElementById('site-nav')?.classList.contains('open')) {
      const nav = document.getElementById('site-nav');
      const focusableElements = nav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

// === MANTENER TODO EL CÓDIGO EXISTENTE FUNCIONAL MEJORADO ===

document.addEventListener('DOMContentLoaded', function() {
  console.log('🎵 ODAM - Inicializando sitio optimizado...');

  // Inicializar sistemas
  loadCriticalResources();
  
  // Sistema de carga
  const loadingSystem = new LoadingSystem();
  loadingSystem.init();
  
  // Sistema de animaciones
  const animationSystem = new AnimationSystem();
  animationSystem.init();

  // Optimizar event listeners
  optimizeEventListeners();

  // 1. Menú móvil funcional - MEJORADO
  const toggle = document.getElementById('site-nav-toggle');
  const nav = document.getElementById('site-nav');
  
  if(toggle && nav){
    toggle.addEventListener('click', function(e){
      e.stopPropagation();
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
      document.body.style.overflow = expanded ? 'auto' : 'hidden';
    });

    // Cerrar menú automáticamente al hacer clic en cualquier enlace
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Solo cerrar si no es un enlace externo
        if (!link.href.includes('//') || link.href.includes(window.location.host)) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = 'auto';
        }
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && 
          !nav.contains(e.target) && 
          !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // 2. Smooth scroll mejorado con polyfill para Safari
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        // Cerrar menú móvil si está abierto
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = 'auto';
        }

        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offset = 80; // Offset para el header fijo
        
        window.scrollTo({
          top: targetPosition - offset,
          behavior: 'smooth'
        });

        // Actualizar URL sin hacer scroll
        history.pushState(null, null, href);
      }
    });
  });

  // 3. Optimización partículas para móviles (mejorado)
  if (typeof particlesJS !== 'undefined') {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) { // Solo cargar partículas en desktop
      particlesJS('particles-js', {
        particles: {
          number: { 
            value: 25, // Reducido para mejor performance
            density: { 
              enable: true, 
              value_area: 600 // Área más pequeña
            } 
          },
          color: { value: "#c8a25f" },
          shape: { type: "circle" },
          opacity: { 
            value: 0.25, // Más transparente
            random: true 
          },
          size: { 
            value: 2.5, // Más pequeño
            random: true 
          },
          line_linked: {
            enable: true,
            distance: 120, // Distancia reducida
            color: "#c8a25f",
            opacity: 0.15, // Más transparente
            width: 0.8 // Más delgado
          },
          move: {
            enable: true,
            speed: 1.5, // Más lento
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { 
              enable: true, 
              mode: "grab" 
            },
            onclick: { 
              enable: true, 
              mode: "push" 
            },
            resize: true
          }
        },
        retina_detect: true
      });
    }
  }

  // 4. Header scroll effect (optimizado con throttling avanzado)
  let lastScroll = 0;
  let ticking = false;
  const header = document.querySelector('header');
  
  function updateHeader() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Efecto de hide/show en scroll
    if (currentScroll > lastScroll && currentScroll > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
    ticking = false;
  }
  
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });

  // 5. Prefers reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){
    document.querySelectorAll('.fade-in').forEach(el => {
      el.style.transition = 'none';
      el.classList.add('show');
    });
  }

  // ===== FORMULARIO DE CONTACTO MODAL MEJORADO =====
  const modal = document.getElementById('contact-modal');
  const contactForm = document.getElementById('contact-form');

  // Cerrar modal al hacer clic fuera
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Envío del formulario mejorado
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Mostrar estado de carga
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Enviando...';
      submitBtn.disabled = true;

      // Validar campos requeridos
      const requiredFields = contactForm.querySelectorAll('[required]');
      let isValid = true;
      let firstInvalidField = null;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#ff6b6b';
          if (!firstInvalidField) firstInvalidField = field;
        } else {
          field.style.borderColor = '';
        }
      });
      
      if (!isValid) {
        alert('Por favor completa todos los campos obligatorios (*)');
        if (firstInvalidField) firstInvalidField.focus();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
      }
      
      // Validar email
      const emailField = contactForm.querySelector('input[type="email"]');
      if (emailField && !isValidEmail(emailField.value)) {
        alert('Por favor ingresa un correo electrónico válido');
        emailField.focus();
        emailField.style.borderColor = '#ff6b6b';
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
      }
      
      // Obtener datos del formulario
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Construir el cuerpo del email
      const subject = `Nueva solicitud de servicio: ${data['service-type']}`;
      const body = `
Solicitud de Cotización - ODAM Producción Musical

INFORMACIÓN DEL CLIENTE:
Nombre: ${data.name}
Email: ${data.email}
Teléfono/WhatsApp: ${data.phone}

DETALLES DEL SERVICIO:
Servicio solicitado: ${data['service-type']}
Tipo de proyecto: ${data['project-type'] || 'No especificado'}
Presupuesto estimado: ${data.budget || 'No especificado'}
Fecha límite: ${data.deadline || 'No especificada'}

DESCRIPCIÓN DEL PROYECTO:
${data.message}

---
Este mensaje fue enviado desde el formulario de contacto de ODAM Producción Musical.
      `.trim();

      // Codificar para mailto
      const mailtoLink = `mailto:odeam@osklindealba.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Abrir cliente de email después de un breve delay
      setTimeout(() => {
        window.location.href = mailtoLink;
        
        // Mostrar mensaje de confirmación
        alert('¡Gracias! Se abrirá tu cliente de email para que envíes la solicitud. Por favor completa el envío del correo.');
        
        // Cerrar modal y resetear después de un tiempo
        setTimeout(() => {
          if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
          }
          contactForm.reset();
          
          // Restaurar botón
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }, 1000);
    });

    // Validación en tiempo real
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
          this.style.borderColor = '#ff6b6b';
        } else {
          this.style.borderColor = '';
        }
        
        // Validación específica para email
        if (this.type === 'email' && this.value.trim()) {
          if (!isValidEmail(this.value)) {
            this.style.borderColor = '#ff6b6b';
          } else {
            this.style.borderColor = '';
          }
        }
      });
    });
  }

  // Función auxiliar para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ===== VERSÍCULOS BÍBLICOS ALEATORIOS MEJORADOS =====
  const bibleVerses = [
    {
      text: "El temor del Señor es el principio de la sabiduría.",
      reference: "Proverbios 1:7"
    },
    {
      text: "Todo lo puedo en Cristo que me fortalece.",
      reference: "Filipenses 4:13"
    },
    {
      text: "Encomienda a Jehová tu camino, y confía en él; y él hará.",
      reference: "Salmos 37:5"
    },
    {
      text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito.",
      reference: "Juan 3:16"
    },
    {
      text: "Jesucristo es el mismo ayer, y hoy, y por los siglos.",
      reference: "Hebreos 13:8"
    },
    {
      text: "La paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones.",
      reference: "Filipenses 4:7"
    },
    {
      text: "Yo soy el camino, la verdad y la vida; nadie viene al Padre, sino por mí.",
      reference: "Juan 14:6"
    },
    {
      text: "Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.",
      reference: "Jeremías 33:3"
    },
    {
      text: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.",
      reference: "Isaías 40:31"
    },
    {
      text: "El Señor es mi pastor; nada me faltará.",
      reference: "Salmos 23:1"
    },
    {
      text: "Confía en Jehová de todo corazón, y no te apoyes en tu propia prudencia.",
      reference: "Proverbios 3:5"
    },
    {
      text: "Todo tiene su tiempo, y todo lo que se quiere debajo del cielo tiene su hora.",
      reference: "Eclesiastés 3:1"
    }
  ];

  const bibleVerseElement = document.getElementById('bible-verse');
  let currentVerseIndex = -1;
  let verseChangeTimeout;

  function getRandomVerse() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * bibleVerses.length);
    } while (newIndex === currentVerseIndex && bibleVerses.length > 1);
    
    currentVerseIndex = newIndex;
    return bibleVerses[currentVerseIndex];
  }

  function displayVerse() {
    const verse = getRandomVerse();
    if (bibleVerseElement) {
      // Efecto de fade out/in
      bibleVerseElement.style.opacity = '0';
      
      setTimeout(() => {
        bibleVerseElement.innerHTML = `
          <div class="verse-text">${verse.text}</div>
          <div class="verse-reference">${verse.reference}</div>
        `;
        bibleVerseElement.style.opacity = '1';
      }, 300);
    }
  }
  
  // Mostrar versículo aleatorio al cargar la página
  setTimeout(displayVerse, 1000);

  // Cambiar versículo al hacer hover (desktop) o touch (móvil)
  if (bibleVerseElement) {
    // Para desktop - hover
    bibleVerseElement.addEventListener('mouseenter', function() {
      clearTimeout(verseChangeTimeout);
      verseChangeTimeout = setTimeout(displayVerse, 300);
    });

    // Para móvil - touch
    bibleVerseElement.addEventListener('touchstart', function(e) {
      e.preventDefault();
      clearTimeout(verseChangeTimeout);
      verseChangeTimeout = setTimeout(displayVerse, 300);
    });

    // También cambiar al hacer click
    bibleVerseElement.addEventListener('click', function() {
      clearTimeout(verseChangeTimeout);
      displayVerse();
    });
  }

  // Cambiar versículo cada 45 segundos automáticamente
  setInterval(displayVerse, 45000);

  // ===== INICIALIZACIÓN DE TARJETAS DE AUDIO (SOLO CLICK EN PLAY) =====
  setTimeout(() => {
    initAudioCard('project-tu-me-sostendras', 'audio-tu-me-sostendras');
    initAudioCard('project-renovados-en-tu-voluntad', 'audio-renovados-en-tu-voluntad');
    initAudioCard('project-en-ti-confio-senor', 'audio-en-ti-confio-senor');
    initAudioCard('project-el-diezmo-es-del-senor-version-bachata', 'audio-el-diezmo-es-del-senor-version-bachata');
    initAudioCard('project-jonas-y-el-gran-pez', 'audio-jonas-y-el-gran-pez');
    initAudioCard('project-el-hijo-de-manoa', 'audio-el-hijo-de-manoa');
  }, 500);

  // ===== NUEVO: OPTIMIZACIONES PARA MÓVILES =====
  function optimizeMobile() {
    if (window.innerWidth < 768) {
      // Reducir animaciones en móviles
      document.documentElement.style.setProperty('--space-xxl', '60px');
      document.documentElement.style.setProperty('--space-xl', '40px');
      
      // Deshabilitar algunas animaciones pesadas
      const heavyAnimations = document.querySelectorAll('.service-accordion-header::before');
    }
  }

  // Ejecutar optimizaciones móviles
  optimizeMobile();
  window.addEventListener('resize', optimizeMobile);

  // ===== NUEVO: ANALYTICS MEJORADO =====
  function trackUserEngagement() {
    // Track tiempo en página
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeSpent = Date.now() - startTime;
      console.log('Tiempo en página:', Math.round(timeSpent / 1000), 'segundos');
    });

    // Track interacciones importantes
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target.matches('.btn-primary, .cta, .open-contact-modal')) {
        console.log('CTA clickeado:', target.textContent.trim());
      }
    }, { passive: true });
  }

  trackUserEngagement();

  console.log('🎵 ODAM - Sitio optimizado cargado correctamente');
});

// Service Worker para caching (opcional futuro)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Esto se puede implementar en el futuro para PWA
    console.log('Service Worker listo para implementar');
  });
}

// Inicializar sistema de estadísticas
document.addEventListener('DOMContentLoaded', function() {
    if (typeof StatsSystem !== 'undefined') {
        console.log('✅ Sistema de estadísticas listo');
    }
});

// === NUEVO: POLYFILLS PARA COMPATIBILIDAD ===
// Smooth scroll polyfill para navegadores antiguos
if (!('scrollBehavior' in document.documentElement.style)) {
  import('https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
    .then(() => {
      console.log('Smoothscroll polyfill cargado');
    });
}

// Object.entries polyfill para IE
if (!Object.entries) {
  Object.entries = function(obj) {
    var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i);
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
  };
}

// === NUEVO: MANEJO DE ERRORES GLOBAL ===
window.addEventListener('error', function(e) {
  console.error('Error global capturado:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Promise rechazada:', e.reason);
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log('Tiempo de carga:', loadTime + 'ms');
      
      if (loadTime > 3000) {
        console.warn('⚠️  Tiempo de carga elevado, considerar optimizaciones adicionales');
      }
    }, 0);
  });
}
