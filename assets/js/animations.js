/**
 * ================================================================================================
 * GENTECH ISP - ADVANCED ANIMATIONS & VISUAL EFFECTS
 * Comprehensive animation system with parallax, scroll triggers, and interactive effects
 * ================================================================================================
 */

class AdvancedAnimations {
    constructor() {
        this.initializeOnLoad();
    }

    initializeOnLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.setupParallaxScrolling();
        this.setupScrollTriggerAnimations();
        this.setupCounterAnimations();
        this.setupPricingCardInteractions();
        this.setupProgressBarAnimations();
        this.setupLoadingSkeletons();
        this.setupSmoothSectionTransitions();
        this.setupEnhancedHoverEffects();
        this.setupStatisticsAnimations();
    }

    // ===== PARALLAX SCROLLING EFFECTS =====
    setupParallaxScrolling() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (parallaxElements.length === 0) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // ===== SCROLL-TRIGGERED ANIMATIONS =====
    setupScrollTriggerAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Stagger animation for child elements
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animateElements = document.querySelectorAll(
            '.animate-on-scroll, .slide-left, .slide-right, .fade-scale'
        );
        
        animateElements.forEach(el => observer.observe(el));
    }

    // ===== COUNTER ANIMATIONS =====
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.target || counter.textContent);
            const duration = parseInt(counter.dataset.duration || 2000);
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                    counter.classList.add('counter-animated');
                }
            };

            updateCounter();
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ===== ENHANCED PRICING CARD INTERACTIONS =====
    setupPricingCardInteractions() {
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        pricingCards.forEach(card => {
            // Add enhanced hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.03)';
                card.style.boxShadow = `
                    0 25px 50px rgba(0, 0, 0, 0.3),
                    0 0 50px rgba(59, 130, 246, 0.2)
                `;
                card.style.zIndex = '10';

                // Animate pricing features
                const features = card.querySelectorAll('.pricing-feature');
                features.forEach((feature, index) => {
                    setTimeout(() => {
                        feature.style.opacity = '1';
                        feature.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
                card.style.zIndex = '';

                // Reset features
                const features = card.querySelectorAll('.pricing-feature');
                features.forEach(feature => {
                    feature.style.opacity = '0.8';
                    feature.style.transform = 'translateX(-10px)';
                });
            });

            // Add click ripple effect
            card.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(59, 130, 246, 0.3);
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                card.style.position = 'relative';
                card.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== PROGRESS BAR ANIMATIONS =====
    setupProgressBarAnimations() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const animateProgressBar = (bar) => {
            const fill = bar.querySelector('.progress-fill');
            const percentage = fill.dataset.percentage || 100;
            
            setTimeout(() => {
                fill.style.width = `${percentage}%`;
                fill.classList.add('animate');
            }, 300);
        };

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateProgressBar(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => progressObserver.observe(bar));
    }

    // ===== LOADING SKELETON SCREENS =====
    setupLoadingSkeletons() {
        const showSkeletons = () => {
            document.querySelectorAll('.content-loading').forEach(element => {
                element.innerHTML = this.generateSkeletonHTML(element.dataset.skeletonType || 'card');
            });
        };

        const hideSkeletons = () => {
            setTimeout(() => {
                document.querySelectorAll('.skeleton').forEach(skeleton => {
                    skeleton.style.opacity = '0';
                    setTimeout(() => {
                        const parent = skeleton.closest('.content-loading');
                        if (parent) {
                            parent.classList.remove('content-loading');
                            parent.innerHTML = parent.dataset.originalContent || '';
                        }
                    }, 300);
                });
            }, 1500); // Show skeletons for 1.5 seconds
        };

        // Auto-hide skeletons after page load
        if (document.readyState === 'complete') {
            hideSkeletons();
        } else {
            window.addEventListener('load', hideSkeletons);
        }
    }

    generateSkeletonHTML(type) {
        switch (type) {
            case 'card':
                return `
                    <div class="skeleton-card">
                        <div class="skeleton skeleton-image"></div>
                        <div class="skeleton skeleton-text large"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text small"></div>
                    </div>
                `;
            case 'list':
                return `
                    <div class="space-y-4">
                        ${Array(5).fill().map(() => `
                            <div class="flex items-center space-x-4">
                                <div class="skeleton skeleton-avatar"></div>
                                <div class="flex-1">
                                    <div class="skeleton skeleton-text"></div>
                                    <div class="skeleton skeleton-text small"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            default:
                return `<div class="skeleton skeleton-text"></div>`;
        }
    }

    // ===== SMOOTH SECTION TRANSITIONS =====
    setupSmoothSectionTransitions() {
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-fade-in');
                    
                    // Add staggered animation to child elements
                    const staggerElements = entry.target.querySelectorAll('.section-stagger > *');
                    staggerElements.forEach((element, index) => {
                        setTimeout(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ===== ENHANCED HOVER EFFECTS =====
    setupEnhancedHoverEffects() {
        // Hover lift effect
        document.querySelectorAll('.hover-lift').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-8px)';
                element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
                element.style.boxShadow = '';
            });
        });

        // Hover glow effect
        document.querySelectorAll('.hover-glow').forEach(element => {
            element.addEventListener('mouseenter', () => {
                const glowElement = element.querySelector('::after') || element;
                if (glowElement) {
                    glowElement.style.opacity = '0.3';
                }
            });

            element.addEventListener('mouseleave', () => {
                const glowElement = element.querySelector('::after') || element;
                if (glowElement) {
                    glowElement.style.opacity = '0';
                }
            });
        });
    }

    // ===== STATISTICS ANIMATIONS =====
    setupStatisticsAnimations() {
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.stat-icon');
                const number = card.querySelector('.stat-number');
                
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                    icon.style.color = 'var(--primary-500)';
                }
                
                if (number) {
                    number.style.transform = 'scale(1.05)';
                }
                
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.stat-icon');
                const number = card.querySelector('.stat-number');
                
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                    icon.style.color = '';
                }
                
                if (number) {
                    number.style.transform = 'scale(1)';
                }
                
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });
    }

    // ===== UTILITY METHODS =====
    
    // Add animation class to element when it enters viewport
    addScrollAnimation(selector, animationClass = 'animate-on-scroll') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add(animationClass);
        });
    }

    // Create and animate a progress bar
    createAnimatedProgressBar(container, percentage, color = 'var(--primary-500)') {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-fill" data-percentage="${percentage}" style="background: ${color}"></div>
        `;
        container.appendChild(progressBar);
        
        setTimeout(() => {
            const fill = progressBar.querySelector('.progress-fill');
            fill.style.width = `${percentage}%`;
            fill.classList.add('animate');
        }, 100);
    }

    // Trigger skeleton loading state
    showSkeletonFor(element, duration = 2000) {
        const originalContent = element.innerHTML;
        element.dataset.originalContent = originalContent;
        element.classList.add('content-loading');
        element.innerHTML = this.generateSkeletonHTML('card');
        
        setTimeout(() => {
            element.classList.remove('content-loading');
            element.innerHTML = originalContent;
        }, duration);
    }
}

// Initialize animations when DOM is ready
const advancedAnimations = new AdvancedAnimations();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAnimations;
} else if (typeof window !== 'undefined') {
    window.AdvancedAnimations = AdvancedAnimations;
}
