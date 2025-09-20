/* ================================================================================================
   MOBILE EXPERIENCE & TOUCH INTERACTIONS
   Advanced mobile optimizations, touch gestures, and PWA features
   ================================================================================================ */

class MobileExperience {
    constructor() {
        this.currentSlide = 0;
        this.isTouch = 'ontouchstart' in window;
        this.startX = 0;
        this.startY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.isScrolling = false;
        this.fabMenuOpen = false;
        
        this.init();
    }
    
    init() {
        // Initialize all mobile features
        this.setupTouchInteractions();
        this.setupSwipeNavigation();
        this.setupMobileCTAs();
        this.setupMobileNavigation();
        this.setupFloatingActionButton();
        this.setupPWA();
        this.optimizeForMobile();
        
        console.log('✅ Mobile Experience initialized');
    }
    
    // ===== TOUCH INTERACTIONS =====
    setupTouchInteractions() {
        // Add touch-friendly classes to interactive elements
        const touchTargets = document.querySelectorAll('button, a, .btn, .card, [onclick]');
        touchTargets.forEach(target => {
            if (!target.classList.contains('touch-target')) {
                target.classList.add('touch-target');
            }
        });
        
        // Improve touch feedback
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    }
    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.isScrolling = false;
    }
    
    handleTouchMove(e) {
        if (!this.startX || !this.startY) return;
        
        this.deltaX = e.touches[0].clientX - this.startX;
        this.deltaY = e.touches[0].clientY - this.startY;
        
        // Determine if user is scrolling
        if (Math.abs(this.deltaY) > Math.abs(this.deltaX)) {
            this.isScrolling = true;
        }
    }
    
    handleTouchEnd(e) {
        this.startX = 0;
        this.startY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.isScrolling = false;
    }
    
    // ===== SWIPE NAVIGATION FOR PRICING CARDS =====
    setupSwipeNavigation() {
        const pricingSection = document.querySelector('#plans');
        if (!pricingSection) return;
        
        // Create mobile-optimized pricing carousel
        this.createPricingCarousel();
        
        // Add swipe listeners
        const carousel = document.querySelector('.pricing-carousel');
        if (carousel) {
            carousel.addEventListener('touchstart', this.handleSwipeStart.bind(this), { passive: true });
            carousel.addEventListener('touchmove', this.handleSwipeMove.bind(this), { passive: false });
            carousel.addEventListener('touchend', this.handleSwipeEnd.bind(this), { passive: true });
        }
    }
    
    createPricingCarousel() {
        const pricingSection = document.querySelector('#plans');
        const pricingCards = pricingSection.querySelectorAll('.pricing-card');
        
        if (window.innerWidth <= 768 && pricingCards.length > 0) {
            // Create carousel container
            const carouselHTML = `
                <div class="pricing-carousel md:hidden">
                    <div class="pricing-cards-container" id="pricingCardsContainer">
                        ${Array.from(pricingCards).map((card, index) => `
                            <div class="pricing-card-mobile">
                                ${card.outerHTML}
                            </div>
                        `).join('')}
                    </div>
                    <div class="pricing-indicators" id="pricingIndicators">
                        ${Array.from(pricingCards).map((_, index) => `
                            <div class="pricing-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>
                        `).join('')}
                    </div>
                    <div class="swipe-hint">
                        <i class="fas fa-hand-pointer"></i>
                        <span>Swipe to explore plans</span>
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            `;
            
            // Insert carousel and hide original cards on mobile
            const originalContainer = pricingCards[0].parentElement;
            originalContainer.insertAdjacentHTML('afterend', carouselHTML);
            originalContainer.classList.add('hidden', 'md:block');
            
            // Setup indicator clicks
            const indicators = document.querySelectorAll('.pricing-indicator');
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.goToSlide(index);
                });
            });
        }
    }
    
    handleSwipeStart(e) {
        this.swipeStartX = e.touches[0].clientX;
        this.swipeStartTime = Date.now();
    }
    
    handleSwipeMove(e) {
        if (!this.swipeStartX) return;
        
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - this.swipeStartX;
        
        // Prevent default if horizontal swipe
        if (Math.abs(deltaX) > 10) {
            e.preventDefault();
        }
    }
    
    handleSwipeEnd(e) {
        if (!this.swipeStartX) return;
        
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - this.swipeStartX;
        const deltaTime = Date.now() - this.swipeStartTime;
        const velocity = Math.abs(deltaX) / deltaTime;
        
        // Swipe threshold
        if (Math.abs(deltaX) > 50 || velocity > 0.3) {
            if (deltaX > 0) {
                this.previousSlide();
            } else {
                this.nextSlide();
            }
        }
        
        this.swipeStartX = 0;
        this.swipeStartTime = 0;
    }
    
    nextSlide() {
        const totalSlides = document.querySelectorAll('.pricing-card-mobile').length;
        this.currentSlide = (this.currentSlide + 1) % totalSlides;
        this.goToSlide(this.currentSlide);
    }
    
    previousSlide() {
        const totalSlides = document.querySelectorAll('.pricing-card-mobile').length;
        this.currentSlide = (this.currentSlide - 1 + totalSlides) % totalSlides;
        this.goToSlide(this.currentSlide);
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        const container = document.getElementById('pricingCardsContainer');
        const indicators = document.querySelectorAll('.pricing-indicator');
        
        if (container) {
            container.style.transform = `translateX(-${index * 100}%)`;
        }
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    // ===== MOBILE-SPECIFIC CTAs =====
    setupMobileCTAs() {
        if (window.innerWidth <= 768) {
            this.createMobileCTAContainer();
            this.showMobileCTAs();
        }
    }
    
    createMobileCTAContainer() {
        const ctaHTML = `
            <div class="mobile-cta-container" id="mobileCTAContainer">
                <div class="mobile-cta-buttons">
                    <a href="tel:+254700123456" class="mobile-call-btn touch-target">
                        <i class="fas fa-phone"></i>
                        <span>Call Now</span>
                    </a>
                    <a href="https://wa.me/254700123456?text=Hi! I'm interested in GenTech ISP services" 
                       target="_blank" class="mobile-whatsapp-btn touch-target">
                        <i class="fab fa-whatsapp"></i>
                        <span>WhatsApp</span>
                    </a>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', ctaHTML);
    }
    
    showMobileCTAs() {
        let ctaShown = false;
        
        const showCTAs = () => {
            if (!ctaShown && window.scrollY > 500) {
                const container = document.getElementById('mobileCTAContainer');
                if (container) {
                    container.classList.add('visible');
                    ctaShown = true;
                }
            }
        };
        
        window.addEventListener('scroll', showCTAs, { passive: true });
    }
    
    // ===== MOBILE NAVIGATION =====
    setupMobileNavigation() {
        this.createMobileNavMenu();
        this.setupMobileNavToggle();
    }
    
    createMobileNavMenu() {
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileNavHTML = `
            <div class="mobile-nav-overlay" id="mobileNavOverlay"></div>
            <div class="mobile-nav-menu" id="mobileNavMenu">
                <div class="mb-8">
                    <div class="flex items-center space-x-3 mb-6">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <i class="fas fa-wifi text-white text-lg"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-bold text-white">GenTech ISP</h1>
                            <p class="text-xs text-gray-400 font-mono">NEXT-GEN CONNECTIVITY</p>
                        </div>
                    </div>
                </div>
                
                ${Array.from(navLinks).map(link => `
                    <a href="${link.getAttribute('href')}" class="mobile-nav-link">
                        ${link.textContent}
                    </a>
                `).join('')}
                
                <div class="mt-8 pt-6 border-t border-gray-700">
                    <a href="tel:+254700123456" class="mobile-nav-link">
                        <i class="fas fa-phone mr-3 text-green-400"></i>
                        Call Support
                    </a>
                    <a href="https://wa.me/254700123456" class="mobile-nav-link">
                        <i class="fab fa-whatsapp mr-3 text-green-400"></i>
                        WhatsApp
                    </a>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', mobileNavHTML);
    }
    
    setupMobileNavToggle() {
        // Add mobile menu button to navbar
        const navbar = document.querySelector('.navbar');
        if (navbar && window.innerWidth <= 768) {
            const menuButton = document.createElement('button');
            menuButton.className = 'lg:hidden text-white p-2 touch-target';
            menuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            menuButton.addEventListener('click', () => this.toggleMobileNav());
            
            navbar.querySelector('.container > div').appendChild(menuButton);
        }
        
        // Setup event listeners
        document.getElementById('mobileNavOverlay').addEventListener('click', () => this.closeMobileNav());
        
        // Close on nav link click
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileNav());
        });
    }
    
    toggleMobileNav() {
        const menu = document.getElementById('mobileNavMenu');
        const overlay = document.getElementById('mobileNavOverlay');
        
        menu.classList.toggle('open');
        overlay.classList.toggle('open');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    }
    
    closeMobileNav() {
        const menu = document.getElementById('mobileNavMenu');
        const overlay = document.getElementById('mobileNavOverlay');
        
        menu.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    // ===== FLOATING ACTION BUTTON =====
    setupFloatingActionButton() {
        if (window.innerWidth <= 768) {
            this.createFloatingActionButton();
        }
    }
    
    createFloatingActionButton() {
        const fabHTML = `
            <div class="mobile-fab" id="mobileFAB">
                <i class="fas fa-ellipsis-v"></i>
            </div>
            
            <div class="mobile-fab-menu" id="mobileFABMenu">
                <a href="#contact" class="mobile-fab-item">
                    <i class="fas fa-envelope"></i>
                    <span>Contact</span>
                </a>
                <a href="#business" class="mobile-fab-item">
                    <i class="fas fa-user-circle"></i>
                    <span>Account</span>
                </a>
                <a href="#plans" class="mobile-fab-item">
                    <i class="fas fa-wifi"></i>
                    <span>Plans</span>
                </a>
                <a href="#" class="mobile-fab-item" onclick="mobileExperience.scrollToTop()">
                    <i class="fas fa-arrow-up"></i>
                    <span>Top</span>
                </a>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', fabHTML);
        
        // Setup FAB toggle
        document.getElementById('mobileFAB').addEventListener('click', () => {
            this.toggleFABMenu();
        });
        
        // Close FAB menu when clicking outside
        document.addEventListener('click', (e) => {
            const fab = document.getElementById('mobileFAB');
            const fabMenu = document.getElementById('mobileFABMenu');
            
            if (!fab.contains(e.target) && !fabMenu.contains(e.target)) {
                this.closeFABMenu();
            }
        });
    }
    
    toggleFABMenu() {
        this.fabMenuOpen = !this.fabMenuOpen;
        const fabMenu = document.getElementById('mobileFABMenu');
        const fab = document.getElementById('mobileFAB');
        
        fabMenu.classList.toggle('open', this.fabMenuOpen);
        fab.querySelector('i').className = this.fabMenuOpen ? 'fas fa-times' : 'fas fa-ellipsis-v';
    }
    
    closeFABMenu() {
        this.fabMenuOpen = false;
        const fabMenu = document.getElementById('mobileFABMenu');
        const fab = document.getElementById('mobileFAB');
        
        fabMenu.classList.remove('open');
        fab.querySelector('i').className = 'fas fa-ellipsis-v';
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        this.closeFABMenu();
    }
    
    // ===== PROGRESSIVE WEB APP =====
    setupPWA() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupPWAManifest();
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        }
    }
    
    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallBanner();
        });
        
        // Store the install prompt function
        this.installPWA = () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('✅ User accepted the install prompt');
                        this.hideInstallBanner();
                    }
                    deferredPrompt = null;
                });
            }
        };
    }
    
    showInstallBanner() {
        const bannerHTML = `
            <div class="pwa-install-banner" id="pwaInstallBanner">
                <div class="pwa-install-content">
                    <div class="pwa-install-text">
                        <div class="pwa-install-title">Install GenTech ISP</div>
                        <div class="pwa-install-description">Get the app for faster access and offline features</div>
                    </div>
                    <div class="pwa-install-buttons">
                        <button class="pwa-btn" onclick="mobileExperience.hideInstallBanner()">Later</button>
                        <button class="pwa-btn primary" onclick="mobileExperience.installPWA()">Install</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', bannerHTML);
        
        // Show banner after a delay
        setTimeout(() => {
            const banner = document.getElementById('pwaInstallBanner');
            if (banner) banner.classList.add('visible');
        }, 3000);
    }
    
    hideInstallBanner() {
        const banner = document.getElementById('pwaInstallBanner');
        if (banner) {
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 300);
        }
    }
    
    setupPWAManifest() {
        // Check if manifest is already added
        if (!document.querySelector('link[rel="manifest"]')) {
            const manifest = document.createElement('link');
            manifest.rel = 'manifest';
            manifest.href = '/manifest.json';
            document.head.appendChild(manifest);
        }
    }
    
    // ===== MOBILE OPTIMIZATIONS =====
    optimizeForMobile() {
        // Optimize touch scrolling
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Improve form inputs on mobile
        this.optimizeMobileForms();
        
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Optimize viewport for mobile
        this.optimizeViewport();
    }
    
    optimizeMobileForms() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.add('mobile-form-field');
            
            // Add better mobile keyboards
            if (input.type === 'email') {
                input.setAttribute('inputmode', 'email');
            } else if (input.type === 'tel') {
                input.setAttribute('inputmode', 'tel');
            } else if (input.type === 'number') {
                input.setAttribute('inputmode', 'numeric');
            }
        });
    }
    
    handleOrientationChange() {
        // Recalculate layouts if needed
        if (window.innerWidth <= 768) {
            this.updateCarouselLayout();
        }
    }
    
    updateCarouselLayout() {
        const container = document.getElementById('pricingCardsContainer');
        if (container) {
            // Reset to current slide after orientation change
            container.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
    }
    
    optimizeViewport() {
        // Add mobile viewport meta tag if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }
    }
}

// Initialize Mobile Experience
let mobileExperience;

document.addEventListener('DOMContentLoaded', () => {
    mobileExperience = new MobileExperience();
});

// Reinitialize on resize for responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && !mobileExperience) {
        mobileExperience = new MobileExperience();
    }
});
