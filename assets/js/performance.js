/**
 * Performance & Loading Optimizations for GenTech ISP
 * Handles lazy loading, animations, and performance monitoring
 */

class PerformanceManager {
    constructor() {
        this.intersectionObserver = null;
        this.lazyElements = [];
        this.loadStartTime = performance.now();
        
        this.init();
    }

    init() {
        // Initialize page loader
        this.initPageLoader();
        
        // Initialize lazy loading
        this.initLazyLoading();
        
        // Initialize content animations
        this.initContentAnimations();
        
        // Initialize performance monitoring
        this.initPerformanceMonitoring();
        
        // Initialize image optimization
        this.initImageOptimization();
    }

    /**
     * Page Loading Management
     */
    initPageLoader() {
        const pageLoader = document.getElementById('page-loader');
        const progressBar = document.getElementById('progress-bar');
        
        if (!pageLoader || !progressBar) return;

        // Show progress bar
        progressBar.classList.add('loading');

        // Simulate loading progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) {
                clearInterval(progressInterval);
                
                // Wait for DOM content loaded
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                        this.completePageLoad(pageLoader, progressBar);
                    });
                } else {
                    this.completePageLoad(pageLoader, progressBar);
                }
            }
        }, 200);
    }

    completePageLoad(pageLoader, progressBar) {
        // Complete progress bar
        progressBar.style.transform = 'translateX(0%)';
        
        setTimeout(() => {
            // Hide loader
            pageLoader.classList.add('hidden');
            progressBar.style.display = 'none';
            
            // Trigger content animations
            this.triggerContentAnimations();
            
            // Log performance metrics
            this.logPerformanceMetrics();
        }, 500);
    }

    /**
     * Lazy Loading Implementation
     */
    initLazyLoading() {
        // Create intersection observer for lazy loading
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    this.intersectionObserver.unobserve(entry.target);
                }
            });
        }, options);

        // Find all lazy loadable elements
        this.setupLazyElements();
    }

    setupLazyElements() {
        // Lazy load images
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
        lazyImages.forEach(img => {
            this.intersectionObserver.observe(img);
        });

        // Lazy load sections
        const lazySections = document.querySelectorAll('.lazy-load');
        lazySections.forEach(section => {
            this.intersectionObserver.observe(section);
        });

        // Lazy load iframes (for maps, videos)
        const lazyIframes = document.querySelectorAll('iframe[data-src]');
        lazyIframes.forEach(iframe => {
            this.intersectionObserver.observe(iframe);
        });
    }

    loadElement(element) {
        // Handle images
        if (element.tagName === 'IMG') {
            this.loadImage(element);
        }
        
        // Handle iframes
        if (element.tagName === 'IFRAME') {
            this.loadIframe(element);
        }
        
        // Handle sections
        if (element.classList.contains('lazy-load')) {
            this.loadSection(element);
        }
    }

    loadImage(img) {
        // Create placeholder while loading
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder loading';
        placeholder.style.width = img.offsetWidth + 'px';
        placeholder.style.height = img.offsetHeight + 'px';
        placeholder.innerHTML = '<i class="fas fa-image"></i>';
        
        // Insert placeholder
        img.parentNode.insertBefore(placeholder, img);
        img.style.display = 'none';

        // Load the actual image
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Set the src
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            
            // Show image with fade effect
            img.style.opacity = '0';
            img.style.display = 'block';
            img.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                img.style.opacity = '1';
                placeholder.remove();
            }, 100);
        };

        imageLoader.onerror = () => {
            placeholder.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            placeholder.classList.remove('loading');
        };

        // Start loading
        if (img.dataset.srcset) {
            imageLoader.srcset = img.dataset.srcset;
        }
        if (img.dataset.src) {
            imageLoader.src = img.dataset.src;
        }
    }

    loadIframe(iframe) {
        if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
        }
    }

    loadSection(section) {
        section.classList.add('loaded');
        
        // Trigger any section-specific loading
        const event = new CustomEvent('sectionLoaded', {
            detail: { section: section }
        });
        document.dispatchEvent(event);
    }

    /**
     * Content Animations
     */
    initContentAnimations() {
        // Add fade-in classes to content elements
        const animatableElements = document.querySelectorAll(
            '.glass-card, .pricing-card, .service-card, .stat-card'
        );
        
        animatableElements.forEach(element => {
            element.classList.add('content-fade-in');
        });
    }

    triggerContentAnimations() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, options);

        const fadeElements = document.querySelectorAll('.content-fade-in');
        fadeElements.forEach(element => {
            animationObserver.observe(element);
        });
    }

    /**
     * Image Optimization
     */
    initImageOptimization() {
        // Convert images to WebP where supported
        if (this.supportsWebP()) {
            this.convertToWebP();
        }
        
        // Setup responsive images
        this.setupResponsiveImages();
    }

    supportsWebP() {
        const elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d')) && 
               elem.toDataURL('image/webp').indexOf('image/webp') === 5;
    }

    convertToWebP() {
        const images = document.querySelectorAll('img[data-webp]');
        images.forEach(img => {
            if (img.dataset.webp) {
                img.dataset.src = img.dataset.webp;
            }
        });
    }

    setupResponsiveImages() {
        // This would typically be done during build process
        // For now, we'll add srcset attributes to existing images
        const images = document.querySelectorAll('img:not([srcset])');
        images.forEach(img => {
            if (img.src && !img.dataset.src) {
                // Convert to lazy loading
                img.dataset.src = img.src;
                img.src = '';
                img.classList.add('lazy-image');
                this.intersectionObserver.observe(img);
            }
        });
    }

    /**
     * Performance Monitoring
     */
    initPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.measureCoreWebVitals();
        
        // Monitor resource loading
        this.monitorResourceLoading();
        
        // Monitor user interactions
        this.monitorUserInteractions();
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            new PerformanceObserver((entryList) => {
                let clsValue = 0;
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    monitorResourceLoading() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.loadStartTime;
            console.log('Page Load Time:', loadTime + 'ms');
            
            // Send analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    event_category: 'Performance',
                    value: Math.round(loadTime)
                });
            }
        });
    }

    monitorUserInteractions() {
        // Track time to first interaction
        let firstInteraction = true;
        ['click', 'keydown', 'scroll'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                if (firstInteraction) {
                    const timeToInteraction = performance.now() - this.loadStartTime;
                    console.log('Time to First Interaction:', timeToInteraction + 'ms');
                    firstInteraction = false;
                }
            }, { once: true });
        });
    }

    logPerformanceMetrics() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            
            console.group('Performance Metrics');
            console.log('DNS Lookup:', perfData.domainLookupEnd - perfData.domainLookupStart + 'ms');
            console.log('TCP Connection:', perfData.connectEnd - perfData.connectStart + 'ms');
            console.log('Request/Response:', perfData.responseEnd - perfData.requestStart + 'ms');
            console.log('DOM Processing:', perfData.domContentLoadedEventEnd - perfData.responseEnd + 'ms');
            console.log('Total Load Time:', perfData.loadEventEnd - perfData.navigationStart + 'ms');
            console.groupEnd();
        }
    }
}

// Initialize performance manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PerformanceManager();
    });
} else {
    new PerformanceManager();
}

// Export for use in other modules
window.PerformanceManager = PerformanceManager;
