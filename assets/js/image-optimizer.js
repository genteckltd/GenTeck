/**
 * Image Optimization and WebP Conversion Utilities
 * Handles responsive images, WebP conversion, and lazy loading setup
 */

class ImageOptimizer {
    constructor() {
        this.supportedFormats = {
            webp: this.supportsWebP(),
            avif: this.supportsAVIF()
        };
        
        this.init();
    }

    init() {
        // Setup responsive images
        this.setupResponsiveImages();
        
        // Convert to modern formats
        this.convertToModernFormats();
        
        // Setup lazy loading for images
        this.setupImageLazyLoading();
        
        // Setup placeholder system
        this.setupImagePlaceholders();
    }

    /**
     * Check WebP support
     */
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
    }

    /**
     * Check AVIF support
     */
    supportsAVIF() {
        const avif = new Image();
        avif.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=";
        return new Promise((resolve) => {
            avif.onload = () => resolve(true);
            avif.onerror = () => resolve(false);
        });
    }

    /**
     * Setup responsive images with srcset
     */
    setupResponsiveImages() {
        const images = document.querySelectorAll('img:not([data-responsive])');
        
        images.forEach(img => {
            if (img.src && !img.dataset.src) {
                this.makeImageResponsive(img);
            }
        });
    }

    makeImageResponsive(img) {
        const originalSrc = img.src;
        const filename = this.getFilenameWithoutExtension(originalSrc);
        const extension = this.getFileExtension(originalSrc);
        
        // Create responsive srcset
        const sizes = [320, 640, 960, 1280, 1920];
        const srcsetWebP = sizes.map(size => 
            `${filename}-${size}w.webp ${size}w`
        ).join(', ');
        
        const srcsetOriginal = sizes.map(size => 
            `${filename}-${size}w.${extension} ${size}w`
        ).join(', ');

        // Use picture element for better format support
        const picture = document.createElement('picture');
        
        // WebP source
        if (this.supportedFormats.webp) {
            const sourceWebP = document.createElement('source');
            sourceWebP.srcset = srcsetWebP;
            sourceWebP.type = 'image/webp';
            picture.appendChild(sourceWebP);
        }
        
        // Fallback source
        const sourceFallback = document.createElement('source');
        sourceFallback.srcset = srcsetOriginal;
        picture.appendChild(sourceFallback);
        
        // Update img attributes
        img.srcset = srcsetOriginal;
        img.sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
        img.dataset.responsive = 'true';
        
        // Replace img with picture
        img.parentNode.insertBefore(picture, img);
        picture.appendChild(img);
    }

    /**
     * Convert images to modern formats
     */
    convertToModernFormats() {
        const images = document.querySelectorAll('img[data-webp], img[data-avif]');
        
        images.forEach(img => {
            if (this.supportedFormats.webp && img.dataset.webp) {
                img.src = img.dataset.webp;
            } else if (this.supportedFormats.avif && img.dataset.avif) {
                img.src = img.dataset.avif;
            }
        });
    }

    /**
     * Setup lazy loading for images
     */
    setupImageLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => this.loadImage(img));
        }
    }

    /**
     * Load individual image
     */
    loadImage(img) {
        // Add loading class
        img.classList.add('loading');
        
        // Create placeholder
        const placeholder = this.createImagePlaceholder(img);
        
        // Load image
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Set the actual image source
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            
            // Fade in effect
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            requestAnimationFrame(() => {
                img.style.opacity = '1';
                img.classList.remove('loading');
                img.classList.add('loaded');
                
                if (placeholder) {
                    placeholder.remove();
                }
            });
        };

        imageLoader.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
            
            if (placeholder) {
                placeholder.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            }
        };

        // Start loading
        if (img.dataset.srcset) {
            imageLoader.srcset = img.dataset.srcset;
        }
        if (img.dataset.src) {
            imageLoader.src = img.dataset.src;
        }
    }

    /**
     * Setup image placeholders
     */
    setupImagePlaceholders() {
        const images = document.querySelectorAll('img:not([data-placeholder])');
        
        images.forEach(img => {
            img.dataset.placeholder = 'true';
            
            // Add error handling
            img.addEventListener('error', () => {
                this.handleImageError(img);
            });
            
            // Add loading state
            img.addEventListener('loadstart', () => {
                img.classList.add('loading');
            });
            
            img.addEventListener('load', () => {
                img.classList.remove('loading');
                img.classList.add('loaded');
            });
        });
    }

    /**
     * Create image placeholder
     */
    createImagePlaceholder(img) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder loading';
        placeholder.style.width = img.offsetWidth + 'px';
        placeholder.style.height = img.offsetHeight + 'px';
        placeholder.innerHTML = '<i class="fas fa-image"></i>';
        
        img.parentNode.insertBefore(placeholder, img);
        return placeholder;
    }

    /**
     * Handle image loading errors
     */
    handleImageError(img) {
        const placeholder = this.createImagePlaceholder(img);
        placeholder.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        placeholder.classList.add('error');
        img.style.display = 'none';
    }

    /**
     * Utility functions
     */
    getFilenameWithoutExtension(url) {
        return url.replace(/\.[^/.]+$/, "");
    }

    getFileExtension(url) {
        return url.split('.').pop().split('?')[0];
    }

    /**
     * Generate responsive image sizes
     */
    generateResponsiveImages(originalImage, sizes = [320, 640, 960, 1280, 1920]) {
        // This would typically be done on the server/build process
        // For demo purposes, we'll create the URLs
        const filename = this.getFilenameWithoutExtension(originalImage);
        const extension = this.getFileExtension(originalImage);
        
        const responsive = {
            webp: sizes.map(size => ({
                size: size,
                url: `${filename}-${size}w.webp`
            })),
            original: sizes.map(size => ({
                size: size,
                url: `${filename}-${size}w.${extension}`
            }))
        };
        
        return responsive;
    }

    /**
     * Preload critical images
     */
    preloadCriticalImages() {
        const criticalImages = [
            '/assets/images/hero-bg.webp',
            '/assets/images/logo.webp',
            '/assets/images/service-icons.webp'
        ];
        
        criticalImages.forEach(imageSrc => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = imageSrc;
            document.head.appendChild(link);
        });
    }
}

// Initialize image optimizer
document.addEventListener('DOMContentLoaded', () => {
    new ImageOptimizer();
});

// Export for use in other modules
window.ImageOptimizer = ImageOptimizer;
