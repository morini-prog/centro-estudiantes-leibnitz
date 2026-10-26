/**
 * Comportamiento interactivo y accesibilidad — Instituto Leibnitz
 * Navegación adaptable, indicador de sección activa y acordeón accesible WAI-ARIA.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. MENÚ DE NAVEGACIÓN MÓVIL ACCESIBLE
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  function setMenuState(isOpen) {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
    );
    mainNav.classList.toggle('is-open', isOpen);
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!isExpanded);
    });

    // Cerrar menú al seleccionar un enlace interno
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          setMenuState(false);
        }
      });
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
        setMenuState(false);
        menuToggle.focus();
      }
    });

    // Cerrar al hacer clic fuera del encabezado en pantallas móviles
    document.addEventListener('click', (event) => {
      if (
        mainNav.classList.contains('is-open') &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        setMenuState(false);
      }
    });
  }

  /* ==========================================================================
     2. MARCADOR DE SECCIÓN ACTIVA EN EL MENÚ
     ========================================================================== */
  const trackedSections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, observerOptions);

    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  /* ==========================================================================
     3. ACORDEÓN ACCESIBLE DE PREGUNTAS FRECUENTES
     ========================================================================== */
  const accordionTriggers = Array.from(document.querySelectorAll('.accordion-trigger'));
  const expandAllBtn = document.getElementById('faq-expand-all');
  const collapseAllBtn = document.getElementById('faq-collapse-all');

  function setAccordionItemState(trigger, isOpen) {
    const panelId = trigger.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    const parentItem = trigger.closest('.accordion-item');

    trigger.setAttribute('aria-expanded', String(isOpen));
    if (panel) {
      if (isOpen) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    }
    if (parentItem) {
      parentItem.classList.toggle('is-open', isOpen);
    }
  }

  accordionTriggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      setAccordionItemState(trigger, !isExpanded);
    });

    // Navegación por teclado entre encabezados del acordeón (Flechas, Inicio, Fin)
    trigger.addEventListener('keydown', (event) => {
      let targetIndex = null;

      if (event.key === 'ArrowDown') {
        targetIndex = (index + 1) % accordionTriggers.length;
      } else if (event.key === 'ArrowUp') {
        targetIndex = (index - 1 + accordionTriggers.length) % accordionTriggers.length;
      } else if (event.key === 'Home') {
        targetIndex = 0;
      } else if (event.key === 'End') {
        targetIndex = accordionTriggers.length - 1;
      }

      if (targetIndex !== null) {
        event.preventDefault();
        accordionTriggers[targetIndex].focus();
      }
    });
  });

  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      accordionTriggers.forEach((trigger) => setAccordionItemState(trigger, true));
    });
  }

  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => {
      accordionTriggers.forEach((trigger) => setAccordionItemState(trigger, false));
    });
  }
});
