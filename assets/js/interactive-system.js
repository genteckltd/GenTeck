// Final integration and additional features for GenTech ISP
// This file handles final integrations and additional interactive features

class GenTechInteractiveSystem {
    constructor() {
        this.features = {
            speedTest: null,
            coverageMap: null,
            liveChat: null,
            packageComparison: null,
            billCalculator: null
        };
        this.analytics = {
            pageViews: 0,
            featureUsage: {},
            userJourney: []
        };
        this.init();
    }

    init() {
        this.initializeAnalytics();
        this.setupCrossFeatureIntegration();
        this.initializeNotifications();
        this.setupKeyboardShortcuts();
        this.initializeAccessibility();
        this.setupScrollAnimations();
    }

    initializeAnalytics() {
        // Track page view
        this.analytics.pageViews++;
        this.trackEvent('page_view', { timestamp: new Date().toISOString() });

        // Track feature button clicks
        document.querySelectorAll('[data-feature]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const feature = e.currentTarget.getAttribute('data-feature');
                this.trackFeatureUsage(feature);
            });
        });

        // Track scroll depth
        this.setupScrollTracking();
    }

    trackFeatureUsage(feature) {
        if (!this.analytics.featureUsage[feature]) {
            this.analytics.featureUsage[feature] = 0;
        }
        this.analytics.featureUsage[feature]++;
        
        this.trackEvent('feature_used', {
            feature: feature,
            count: this.analytics.featureUsage[feature],
            timestamp: new Date().toISOString()
        });

        // Show helpful tooltips for first-time users
        this.showFeatureIntro(feature);
    }

    showFeatureIntro(feature) {
        const introMessages = {
            'speed-test': 'Test your current internet speed and compare with our packages!',
            'coverage-map': 'Check if GenTech services are available in your area.',
            'package-comparison': 'Compare all our packages side by side to find the perfect fit.',
            'bill-calculator': 'Calculate your monthly costs with add-ons and discounts.'
        };

        if (introMessages[feature] && !localStorage.getItem(`intro_shown_${feature}`)) {
            this.showToast(introMessages[feature], 'info', 5000);
            localStorage.setItem(`intro_shown_${feature}`, 'true');
        }
    }

    setupCrossFeatureIntegration() {
        // Integration between speed test and package recommendations
        document.addEventListener('speedTestCompleted', (e) => {
            const results = e.detail;
            this.recommendPackagesBasedOnSpeed(results);
        });

        // Integration between coverage map and package availability
        document.addEventListener('coverageChecked', (e) => {
            const location = e.detail;
            this.updatePackageAvailability(location);
        });

        // Integration between package comparison and bill calculator
        document.addEventListener('packageSelected', (e) => {
            const packageData = e.detail;
            this.prePopulateBillCalculator(packageData);
        });
    }

    recommendPackagesBasedOnSpeed(speedResults) {
        const currentSpeed = speedResults.download;
        let recommendation = '';

        if (currentSpeed < 25) {
            recommendation = 'Based on your current speed, our HomeConnect Basic (25 Mbps) would be a significant upgrade!';
        } else if (currentSpeed < 50) {
            recommendation = 'Consider our HomeConnect Standard (50 Mbps) for better streaming and browsing.';
        } else if (currentSpeed < 100) {
            recommendation = 'Our HomeConnect Premium (100 Mbps) would give you professional-grade speeds.';
        } else {
            recommendation = 'You have great speed! Consider our BizPlus or Enterprise packages for even more features.';
        }

        this.showToast(recommendation, 'success', 8000);
    }

    setupScrollTracking() {
        let maxScroll = 0;
        const sections = ['home', 'services', 'plans', 'coverage', 'contact'];
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestone scrolls
                if (scrollPercent >= 25 && !this.analytics.scrollMilestones?.['25%']) {
                    this.trackEvent('scroll_milestone', { percentage: 25 });
                    if (!this.analytics.scrollMilestones) this.analytics.scrollMilestones = {};
                    this.analytics.scrollMilestones['25%'] = true;
                }
            }

            // Track section views
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section && this.isElementInViewport(section)) {
                    this.trackSectionView(sectionId);
                }
            });
        });
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    trackSectionView(sectionId) {
        if (!this.analytics.sectionsViewed) {
            this.analytics.sectionsViewed = {};
        }
        
        if (!this.analytics.sectionsViewed[sectionId]) {
            this.analytics.sectionsViewed[sectionId] = true;
            this.trackEvent('section_viewed', { section: sectionId });
        }
    }

    initializeNotifications() {
        // Request notification permission for important updates
        if ('Notification' in window && Notification.permission === 'default') {
            // Don't auto-request, let user trigger it
            this.createNotificationPermissionButton();
        }

        // Setup service worker messages
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'UPDATE_AVAILABLE') {
                    this.showUpdateNotification();
                }
            });
        }
    }

    createNotificationPermissionButton() {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-bell"></i> Enable Notifications';
        button.className = 'fixed bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors z-40';
        button.onclick = () => this.requestNotificationPermission();
        
        setTimeout(() => {
            document.body.appendChild(button);
            setTimeout(() => button.remove(), 10000); // Auto-remove after 10s
        }, 5000);
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.showToast('Notifications enabled! You\'ll receive important updates.', 'success');
                new Notification('GenTech ISP', {
                    body: 'Notifications are now enabled. We\'ll keep you updated on service improvements!',
                    icon: '/favicon.ico'
                });
            }
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + S for Speed Test
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                document.querySelector('[data-feature="speed-test"]')?.click();
            }
            
            // Alt + C for Coverage Map
            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                document.querySelector('[data-feature="coverage-map"]')?.click();
            }
            
            // Alt + B for Bill Calculator
            if (e.altKey && e.key === 'b') {
                e.preventDefault();
                document.querySelector('[data-feature="bill-calculator"]')?.click();
            }
            
            // Esc to close any open modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    closeAllModals() {
        const modals = [
            'speed-test-modal',
            'coverage-map-modal',
            'package-comparison-modal',
            'bill-calculator-modal'
        ];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }

    initializeAccessibility() {
        // Add ARIA labels and roles where needed
        document.querySelectorAll('[data-feature]').forEach(btn => {
            const feature = btn.getAttribute('data-feature');
            const featureNames = {
                'speed-test': 'Internet Speed Test Tool',
                'coverage-map': 'Service Coverage Map',
                'package-comparison': 'Package Comparison Tool',
                'bill-calculator': 'Monthly Bill Calculator'
            };
            
            btn.setAttribute('aria-label', featureNames[feature] || feature);
            btn.setAttribute('role', 'button');
        });

        // Focus management for modals
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-feature')) {
                setTimeout(() => {
                    const openModal = document.querySelector('.fixed:not(.hidden)');
                    if (openModal) {
                        const firstFocusable = openModal.querySelector('input, button, select, textarea');
                        firstFocusable?.focus();
                    }
                }, 100);
            }
        });
    }

    setupScrollAnimations() {
        // Enhanced scroll animations with intersection observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.animate-slide-up, .animate-slide-in-left, .animate-slide-in-right').forEach(el => {
            observer.observe(el);
        });
    }

    showToast(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        const colors = {
            info: 'bg-blue-500',
            success: 'bg-green-500',
            warning: 'bg-orange-500',
            error: 'bg-red-500'
        };
        
        toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle mr-2"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(full)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
        notification.innerHTML = `
            <div class="flex items-start">
                <i class="fas fa-download mr-3 mt-1"></i>
                <div class="flex-1">
                    <h4 class="font-semibold mb-1">Update Available</h4>
                    <p class="text-sm text-blue-100 mb-3">A new version of GenTech ISP website is available with improved features.</p>
                    <div class="flex gap-2">
                        <button onclick="window.location.reload()" class="bg-white text-blue-500 px-3 py-1 rounded text-sm font-semibold">
                            Update Now
                        </button>
                        <button onclick="this.closest('.fixed').remove()" class="text-blue-100 hover:text-white px-3 py-1 text-sm">
                            Later
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
    }

    trackEvent(eventName, data) {
        // Analytics tracking (would integrate with Google Analytics, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Store in local analytics
        if (!this.analytics.events) {
            this.analytics.events = [];
        }
        
        this.analytics.events.push({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString()
        });
        
        // Console log for development
        console.log('GenTech Analytics:', eventName, data);
    }

    // Public API for other scripts
    getAnalytics() {
        return this.analytics;
    }

    showFeature(featureName) {
        const btn = document.querySelector(`[data-feature="${featureName}"]`);
        if (btn) {
            btn.click();
        }
    }
}

// Additional utility functions
class GenTechUtils {
    static formatCurrency(amount, currency = 'KSH') {
        return `${currency} ${amount.toLocaleString()}`;
    }

    static formatSpeed(mbps) {
        if (mbps >= 1000) {
            return `${(mbps / 1000).toFixed(1)} Gbps`;
        }
        return `${mbps} Mbps`;
    }

    static calculatePricePerMbps(price, speed) {
        const speedNum = parseInt(speed.replace(/[^\d]/g, ''));
        return Math.round(price / speedNum);
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return re.test(phone);
    }

    static generateQuoteId() {
        return 'GT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    static getLocationFromIP() {
        // Simulated location detection (would use real IP geolocation service)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    city: 'Nairobi',
                    country: 'Kenya',
                    coordinates: { lat: -1.2921, lng: 36.8219 }
                });
            }, 1000);
        });
    }
}

// Initialize the interactive system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main interactive system
    window.GenTechSystem = new GenTechInteractiveSystem();
    window.GenTechUtils = GenTechUtils;
    
    // Add global styles for toast animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .toast-enter {
            animation: toastSlideIn 0.3s ease-out;
        }
        
        .toast-exit {
            animation: toastSlideOut 0.3s ease-in;
        }
        
        @keyframes toastSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes toastSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Show welcome message for first-time visitors
    if (!localStorage.getItem('gentech_visited')) {
        setTimeout(() => {
            window.GenTechSystem.showToast('Welcome to GenTech ISP! Explore our interactive features for the best experience.', 'info', 6000);
            localStorage.setItem('gentech_visited', 'true');
        }, 2000);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GenTechInteractiveSystem, GenTechUtils };
}
