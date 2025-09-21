// ===== MOBILE OPTIMIZATIONS FOR GENTECH ISP =====
// Enhanced mobile interactions and responsiveness

document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Mobile optimizations loaded');
    
    initializeMobileOptimizations();
    initializeTouchInteractions();
    initializeMobileViewport();
    initializeMobileNavigation();
    initializeMobileForms();
    initializeMobileModals();
});

// Mobile viewport height fix for iOS Safari
function initializeMobileViewport() {
    const setVHProperty = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVHProperty();
    window.addEventListener('resize', setVHProperty);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVHProperty, 500);
    });
}

// Enhanced mobile navigation
function initializeMobileNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    // Smooth scrolling for mobile navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
                
                // Wait for menu to close before scrolling
                setTimeout(() => {
                    const headerOffset = 80;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                navbarToggler.click();
            }
        }
    });
}

// Touch interactions for better mobile UX
function initializeTouchInteractions() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn, button, [role="button"]');
    buttons.forEach(btn => {
        btn.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.1s ease';
        }, { passive: true });
        
        btn.addEventListener('touchend', function(e) {
            this.style.transform = 'scale(1)';
        }, { passive: true });
        
        btn.addEventListener('touchcancel', function(e) {
            this.style.transform = 'scale(1)';
        }, { passive: true });
    });
    
    // Add touch feedback to cards
    const cards = document.querySelectorAll('.card, .pricing-card');
    cards.forEach(card => {
        card.addEventListener('touchstart', function(e) {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        }, { passive: true });
        
        card.addEventListener('touchend', function(e) {
            this.style.transform = 'translateY(0)';
        }, { passive: true });
    });
}

// Mobile form optimizations
function initializeMobileForms() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Prevent zoom on iOS when focusing inputs
        input.addEventListener('focus', function() {
            if (window.innerWidth < 768 && this.type !== 'file') {
                this.style.fontSize = '16px';
            }
            this.classList.add('mobile-focus');
        });
        
        input.addEventListener('blur', function() {
            this.classList.remove('mobile-focus');
        });
        
        // Add visual feedback on touch
        input.addEventListener('touchstart', function() {
            this.classList.add('mobile-touch');
        }, { passive: true });
        
        input.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('mobile-touch');
            }, 150);
        }, { passive: true });
    });
    
    // Form validation improvements for mobile
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const invalidFields = form.querySelectorAll(':invalid');
            if (invalidFields.length > 0) {
                e.preventDefault();
                
                // Focus on first invalid field with proper mobile behavior
                const firstInvalid = invalidFields[0];
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        });
    });
}

// Mobile modal optimizations
function initializeMobileModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        
        // Touch-to-dismiss functionality
        modal.addEventListener('touchstart', (e) => {
            if (e.target === modal) {
                startY = e.touches[0].clientY;
                isDragging = true;
            }
        }, { passive: true });
        
        modal.addEventListener('touchmove', (e) => {
            if (!isDragging || e.target !== modal) return;
            
            currentY = e.touches[0].clientY;
            const diff = startY - currentY;
            
            // Close modal if swiped down significantly
            if (diff < -100) {
                const closeBtn = modal.querySelector('.btn-close, .close, [data-bs-dismiss="modal"]');
                if (closeBtn) {
                    closeBtn.click();
                    isDragging = false;
                }
            }
        }, { passive: true });
        
        modal.addEventListener('touchend', () => {
            isDragging = false;
        }, { passive: true });
        
        // Prevent body scroll when modal is open
        modal.addEventListener('show.bs.modal', function() {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        });
        
        modal.addEventListener('hide.bs.modal', function() {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        });
    });
    
    // Close modals on swipe for mobile
    const exitIntentPopup = document.querySelector('.exit-intent-popup');
    const progressiveForms = document.querySelectorAll('.progressive-form');
    
    [exitIntentPopup, ...progressiveForms].forEach(popup => {
        if (!popup) return;
        
        let startY = 0;
        let isDragging = false;
        
        popup.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });
        
        popup.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentY = e.touches[0].clientY;
            const diff = startY - currentY;
            
            if (diff < -80) {
                const closeBtn = popup.querySelector('.close, .btn-close');
                if (closeBtn) closeBtn.click();
                isDragging = false;
            }
        }, { passive: true });
        
        popup.addEventListener('touchend', () => {
            isDragging = false;
        }, { passive: true });
    });
}

// General mobile optimizations
function initializeMobileOptimizations() {
    // Disable hover effects on touch devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // Optimize scrolling performance
    let ticking = false;
    
    function updateScrollPosition() {
        // Update any scroll-dependent elements here
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    }, { passive: true });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        // Force a reflow to fix layout issues
        setTimeout(() => {
            const body = document.body;
            body.style.display = 'none';
            body.offsetHeight; // Trigger reflow
            body.style.display = '';
        }, 100);
    });
    
    // Optimize image loading for mobile
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Mobile keyboard handling
    let initialViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
        const currentHeight = window.innerHeight;
        const heightDifference = initialViewportHeight - currentHeight;
        
        // Keyboard is likely open if height decreased significantly
        if (heightDifference > 150) {
            document.body.classList.add('keyboard-open');
        } else {
            document.body.classList.remove('keyboard-open');
        }
    });
}

// CSS for mobile focus states
const mobileFocusStyles = `
<style>
.mobile-focus {
    border-color: var(--primary-400) !important;
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2) !important;
}

.mobile-touch {
    background-color: rgba(14, 165, 233, 0.1) !important;
}

.touch-device .hover-effect:hover {
    transform: none !important;
}

.keyboard-open .currency-widget,
.keyboard-open .social-proof-widget {
    display: none !important;
}

@media (max-height: 500px) {
    .keyboard-open .modal-content {
        max-height: 80vh !important;
    }
}
</style>
`;

// Inject mobile focus styles
document.head.insertAdjacentHTML('beforeend', mobileFocusStyles);
