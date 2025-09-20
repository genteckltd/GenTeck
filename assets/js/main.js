// ===== REVOLUTIONARY ISP WEBSITE JAVASCRIPT =====
// Modern JavaScript ES6+ for GenTech ISP

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 GenTech ISP - Revolutionary Internet Solutions Loaded');
    
    // Initialize all revolutionary features
    initializeNavigation();
    initializePricingPlans();
    initializeCoverageChecker();
    initializeContactForm();
    initializeAnimations();
    initializeMobileMenu();
});

// ===== REVOLUTIONARY NAVIGATION =====
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// ===== REVOLUTIONARY PRICING PLANS SYSTEM =====
function initializePricingPlans() {
    const planToggles = document.querySelectorAll('.plan-toggle');
    const planContainers = document.querySelectorAll('.plans-container');
    
    planToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const planType = this.getAttribute('data-plan');
            
            // Update toggle states
            planToggles.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide plan containers with animation
            planContainers.forEach(container => {
                container.classList.add('hidden');
            });
            
            setTimeout(() => {
                const targetContainer = document.getElementById(`${planType}-plans`);
                if (targetContainer) {
                    targetContainer.classList.remove('hidden');
                }
            }, 250);
            
            console.log(`💡 Switched to ${planType} plans`);
        });
    });
    
    // Initialize pricing card interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('featured')) {
                this.style.transform = 'scale(1.05)';
            } else {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// ===== REVOLUTIONARY CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const formData = new FormData(this);
            
            // Validate form
            if (validateContactForm(this)) {
                // Show loading state
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Message Sent!';
                    submitBtn.classList.remove('btn-primary');
                    submitBtn.classList.add('btn-success');
                    
                    // Show success message
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    
                    // Reset form after delay
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('btn-success');
                        submitBtn.classList.add('btn-primary');
                    }, 3000);
                    
                    console.log('📧 Contact form submitted:', Object.fromEntries(formData));
                }, 2000);
            } else {
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error state
    field.classList.remove('error');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        field.style.borderColor = '#ef4444';
    } else {
        field.style.borderColor = '';
    }
    
    return isValid;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all duration-300 transform translate-x-full`;
    
    if (type === 'success') {
        notification.className += ' bg-green-500 text-white';
        notification.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
    } else if (type === 'error') {
        notification.className += ' bg-red-500 text-white';
        notification.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
    } else {
        notification.className += ' bg-blue-500 text-white';
        notification.innerHTML = `<i class="fas fa-info-circle mr-2"></i>${message}`;
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ===== REVOLUTIONARY COVERAGE CHECKER =====
function initializeCoverageChecker() {
    const coverageForm = document.querySelector('#coverage input[type="text"]');
    const checkButton = document.querySelector('#coverage .btn-primary');
    const resultDiv = document.getElementById('coverage-result');
    
    if (coverageForm && checkButton) {
        checkButton.addEventListener('click', function() {
            const location = coverageForm.value.trim();
            
            if (location) {
                // Simulate coverage check
                this.classList.add('loading');
                this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Checking...';
                
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = '<i class="fas fa-search mr-2"></i>Check';
                    
                    // Show result
                    if (resultDiv) {
                        resultDiv.classList.remove('hidden');
                        resultDiv.style.animation = 'slideInUp 0.5s ease-out';
                    }
                    
                    console.log(`📡 Coverage checked for: ${location}`);
                }, 2000);
            } else {
                // Shake animation for empty input
                coverageForm.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    coverageForm.style.animation = '';
                }, 500);
            }
        });
        
        // Check on Enter key
        coverageForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkButton.click();
            }
        });
    }
}

// ===== REVOLUTIONARY ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    animatedElements.forEach(el => {
        if (!el.style.animation) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        observer.observe(el);
    });
    
    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.animate-float');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.2);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== MOBILE MENU FUNCTIONALITY =====
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Animate hamburger icon
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-xl';
            } else {
                icon.className = 'fas fa-times text-xl';
            }
        });
        
        // Close mobile menu when clicking links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-xl';
            });
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// Add shake animation keyframes
if (!document.querySelector('#shake-keyframes')) {
    const style = document.createElement('style');
    style.id = 'shake-keyframes';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// Console art for branding
console.log(`
    ╔═══════════════════════════════════════╗
    ║         GenTech ISP                   ║
    ║    Revolutionary Internet Solutions   ║
    ║                                       ║
    ║  🚀 Next-Gen Connectivity             ║
    ║  ⚡ Lightning-Fast Speeds             ║
    ║  🌐 Global Coverage                   ║
    ║  🛡️  Enterprise Security              ║
    ╚═══════════════════════════════════════╝
`);

// Performance monitoring
console.log('🔧 Performance Metrics:', {
    loadTime: performance.now(),
    userAgent: navigator.userAgent,
    connection: navigator.connection?.effectiveType || 'unknown'
});

// Export functions for external use
window.GenTechISP = {
    initializeNavigation,
    initializePricingPlans,
    initializeCoverageChecker,
    initializeAnimations,
    initializeMobileMenu
};
