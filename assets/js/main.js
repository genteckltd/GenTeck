// GenTeck Technology - Main JavaScript Module
// Author: GenTeck Team
// Version: 1.0.0

class GenTeckApp {
    constructor() {
        this.init();
    }

    init() {
        this.initThemeToggle();
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initBackToTop();
        this.initContactForm();
        this.initCookieConsent();
        this.initAnimations();
        this.initFloatingElements();
    }

    // Theme Toggle Functionality
    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'light';

        html.classList.add(savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                html.classList.toggle('dark');
                localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
            });
        }
    }

    // Mobile Menu Functionality
    initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.add('open');
            });
        }

        if (mobileMenuClose && mobileMenu) {
            mobileMenuClose.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        }
    }

    // Smooth Scroll for Navigation Links
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu) {
                        mobileMenu.classList.remove('open');
                    }
                }
            });
        });
    }

    // Back to Top Button
    initBackToTop() {
        const backToTop = document.createElement('div');
        backToTop.innerHTML = `
            <button id="back-to-top" class="fixed bottom-8 right-8 p-3 bg-cyber-blue text-gray-900 rounded-full shadow-lg hover:bg-cyber-purple transition-all hidden z-50">
                <i class="fas fa-arrow-up"></i>
            </button>
        `;
        document.body.appendChild(backToTop);
        
        const backToTopBtn = document.getElementById('back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('hidden');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Contact Form Handler
    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        const formElements = ['name', 'email', 'subject', 'message', 'consent'];

        if (contactForm) {
            // Email field synchronization for Formspree
            const emailField = document.getElementById('email');
            const emailHidden = document.getElementById('email_hidden');
            
            if (emailField && emailHidden) {
                emailField.addEventListener('input', (e) => {
                    emailHidden.value = e.target.value;
                });
            }

            // Real-time validation
            formElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('input', () => {
                        element.classList.remove('form-error');
                        const errorElement = document.getElementById(`${id}Error`);
                        if (errorElement) {
                            errorElement.classList.add('hidden');
                        }
                    });
                }
            });

            // Form submission
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm, formElements);
            });
        }
    }

    // Handle form submission with validation
    handleFormSubmission(form, formElements) {
        let isValid = true;

        // Validate each field
        formElements.forEach(id => {
            const element = document.getElementById(id);
            const errorElement = document.getElementById(`${id}Error`);

            if (element && errorElement) {
                if ((id === 'consent' && !element.checked) || 
                    (id !== 'consent' && element.value.trim() === '')) {
                    element.classList.add('form-error');
                    errorElement.classList.remove('hidden');
                    isValid = false;
                }
            }
        });

        const loadingMessage = document.getElementById('loadingMessage');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');

        // Hide all messages initially
        [loadingMessage, successMessage, errorMessage].forEach(msg => {
            if (msg) msg.classList.add('hidden');
        });

        if (isValid) {
            // Show loading
            if (loadingMessage) loadingMessage.classList.remove('hidden');

            // Create FormData object
            const formData = new FormData(form);

            // Send form data using Fetch API
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                // Hide loading
                if (loadingMessage) loadingMessage.classList.add('hidden');

                if (response.ok) {
                    // Show success message
                    if (successMessage) successMessage.classList.remove('hidden');
                    form.reset();
                    setTimeout(() => {
                        if (successMessage) successMessage.classList.add('hidden');
                    }, 5000);
                } else {
                    // Show error message
                    if (errorMessage) errorMessage.classList.remove('hidden');
                    setTimeout(() => {
                        if (errorMessage) errorMessage.classList.add('hidden');
                    }, 5000);
                }
            })
            .catch(error => {
                // Hide loading and show error
                if (loadingMessage) loadingMessage.classList.add('hidden');
                if (errorMessage) errorMessage.classList.remove('hidden');
                setTimeout(() => {
                    if (errorMessage) errorMessage.classList.add('hidden');
                }, 5000);
            });
        }
    }

    // Cookie Consent Functionality
    initCookieConsent() {
        const cookieConsent = document.getElementById('cookie-consent');
        const cookieAccept = document.getElementById('cookie-accept');
        const cookieDecline = document.getElementById('cookie-decline');

        if (!localStorage.getItem('cookieConsent') && cookieConsent) {
            cookieConsent.classList.remove('hidden');
        }

        if (cookieAccept) {
            cookieAccept.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                if (cookieConsent) cookieConsent.classList.add('hidden');
            });
        }

        if (cookieDecline) {
            cookieDecline.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'declined');
                if (cookieConsent) cookieConsent.classList.add('hidden');
            });
        }
    }

    // Initialize Intersection Observer for animations
    initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-fadeIn').forEach(el => {
            observer.observe(el);
        });

        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }

    // Initialize floating elements
    initFloatingElements() {
        const floatingElements = document.querySelectorAll('.animate-float');
        floatingElements.forEach(el => {
            el.style.animation = `float 6s ease-in-out infinite`;
        });
    }

    // Utility method for adding event listeners safely
    addEventListenerSafely(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    // Utility method for showing/hiding elements
    toggleElementVisibility(element, show) {
        if (element) {
            element.classList.toggle('hidden', !show);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GenTeckApp();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GenTeckApp;
}
