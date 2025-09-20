/**
 * SEO Optimization Script for GenTech ISP
 * Handles dynamic SEO enhancements, schema updates, and performance tracking
 */

class SEOOptimizer {
    constructor() {
        this.currentPage = window.location.pathname;
        this.baseURL = 'https://gentech.co.ke';
        
        this.init();
    }

    init() {
        // Dynamic meta tag optimization
        this.optimizeMetaTags();
        
        // Dynamic structured data
        this.addDynamicStructuredData();
        
        // Internal linking optimization
        this.optimizeInternalLinks();
        
        // Image SEO optimization
        this.optimizeImageSEO();
        
        // Content freshness tracking
        this.trackContentFreshness();
        
        // Social media optimization
        this.optimizeSocialSharing();
        
        // Local SEO optimization
        this.optimizeLocalSEO();
    }

    /**
     * Dynamic Meta Tag Optimization
     */
    optimizeMetaTags() {
        // Update meta descriptions based on current section
        this.updateMetaBasedOnScroll();
        
        // Add dynamic Open Graph tags
        this.addDynamicOGTags();
        
        // Optimize title tags for different sections
        this.optimizeTitleTags();
    }

    updateMetaBasedOnScroll() {
        const sections = [
            {
                id: 'hero',
                title: 'GenTech ISP - Leading Internet Provider in Kenya',
                description: 'Experience revolutionary internet with fiber, 5G, and satellite connectivity. Packages from KSh 10.'
            },
            {
                id: 'services',
                title: 'Internet Services - Fiber, 5G, Satellite | GenTech ISP',
                description: 'Professional internet services including fiber optic, 5G wireless, satellite internet, web development, and system maintenance.'
            },
            {
                id: 'pricing',
                title: 'Internet Packages & Pricing - Affordable Plans | GenTech ISP',
                description: 'Affordable internet packages: HomeConnect KSh 1,999, BizPlus KSh 4,999, prepaid from KSh 10. Best value in Kenya.'
            },
            {
                id: 'coverage',
                title: 'Internet Coverage Areas in Kenya | GenTech ISP',
                description: 'Check GenTech ISP coverage in your area. Nationwide fiber, 5G, and satellite internet across Kenya.'
            },
            {
                id: 'contact',
                title: 'Contact GenTech ISP - Customer Support | Nairobi, Kenya',
                description: 'Contact GenTech ISP for internet services. 24/7 support: +254-700-123456. Office: Westlands Road, Nairobi.'
            }
        ];

        let currentSection = 'hero';
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const sectionData = sections.find(s => s.id === sectionId);
                    
                    if (sectionData && sectionData.id !== currentSection) {
                        currentSection = sectionData.id;
                        this.updatePageMeta(sectionData);
                        
                        // Update URL hash for better navigation
                        if (history.replaceState) {
                            history.replaceState(null, null, `#${sectionId}`);
                        }
                    }
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });
    }

    updatePageMeta(sectionData) {
        // Update document title
        document.title = sectionData.title;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', sectionData.description);
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        
        if (ogTitle) ogTitle.setAttribute('content', sectionData.title);
        if (ogDesc) ogDesc.setAttribute('content', sectionData.description);
        
        // Track section views for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'section_view', {
                event_category: 'Navigation',
                event_label: sectionData.id,
                non_interaction: true
            });
        }
    }

    addDynamicOGTags() {
        // Add dynamic Open Graph image based on current section
        const sectionImages = {
            hero: '/assets/images/og-hero.jpg',
            services: '/assets/images/og-services.jpg',
            pricing: '/assets/images/og-pricing.jpg',
            coverage: '/assets/images/og-coverage.jpg',
            contact: '/assets/images/og-contact.jpg'
        };

        // This would be updated based on current section
        // Implementation would sync with the scroll observer above
    }

    optimizeTitleTags() {
        // Add breadcrumb titles for better SEO hierarchy
        const breadcrumbTitles = {
            '/': 'Home',
            '/services': 'Services',
            '/pricing': 'Pricing',
            '/contact': 'Contact'
        };

        const currentPath = window.location.pathname;
        if (breadcrumbTitles[currentPath]) {
            // Update breadcrumb structured data
            this.addBreadcrumbSchema(currentPath);
        }
    }

    /**
     * Dynamic Structured Data
     */
    addDynamicStructuredData() {
        // Add breadcrumb schema
        this.addBreadcrumbSchema();
        
        // Add article schema for content sections
        this.addArticleSchema();
        
        // Add local business schema
        this.addLocalBusinessSchema();
    }

    addBreadcrumbSchema(currentPath = '/') {
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": this.baseURL
                }
            ]
        };

        // Add current page to breadcrumb if not home
        if (currentPath !== '/') {
            const pageName = currentPath.replace('/', '').replace('-', ' ');
            breadcrumbSchema.itemListElement.push({
                "@type": "ListItem",
                "position": 2,
                "name": pageName.charAt(0).toUpperCase() + pageName.slice(1),
                "item": this.baseURL + currentPath
            });
        }

        this.addSchemaToHead('breadcrumb-schema', breadcrumbSchema);
    }

    addArticleSchema() {
        // Add article schema for service descriptions
        const serviceArticleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Revolutionary Internet Services in Kenya - GenTech ISP",
            "description": "Comprehensive guide to GenTech ISP's internet services including fiber, 5G, satellite, and business solutions.",
            "author": {
                "@type": "Organization",
                "name": "GenTech ISP"
            },
            "publisher": {
                "@type": "Organization",
                "name": "GenTech ISP",
                "logo": {
                    "@type": "ImageObject",
                    "url": this.baseURL + "/assets/images/logo.png"
                }
            },
            "datePublished": "2025-09-20",
            "dateModified": new Date().toISOString().split('T')[0],
            "articleSection": "Internet Services",
            "wordCount": this.estimateWordCount(),
            "image": this.baseURL + "/assets/images/services-hero.jpg"
        };

        this.addSchemaToHead('article-schema', serviceArticleSchema);
    }

    addLocalBusinessSchema() {
        const localBusinessSchema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": this.baseURL + "/#organization",
            "name": "GenTech ISP",
            "image": this.baseURL + "/assets/images/building.jpg",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Westlands Road",
                "addressLocality": "Nairobi",
                "addressRegion": "Nairobi County",
                "postalCode": "00100",
                "addressCountry": "KE"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": -1.2921,
                "longitude": 36.8219
            },
            "telephone": "+254-700-123456",
            "openingHours": "Mo,Tu,We,Th,Fr,Sa,Su 00:00-23:59",
            "priceRange": "KSh 10 - KSh 15,999",
            "servesCuisine": "Internet Services",
            "paymentAccepted": "Cash, Credit Card, M-Pesa, Bank Transfer"
        };

        this.addSchemaToHead('local-business-schema', localBusinessSchema);
    }

    addSchemaToHead(id, schema) {
        // Remove existing schema if present
        const existing = document.getElementById(id);
        if (existing) existing.remove();

        // Add new schema
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    /**
     * Internal Linking Optimization
     */
    optimizeInternalLinks() {
        // Add relevant internal links automatically
        this.addContextualLinks();
        
        // Optimize anchor text
        this.optimizeAnchorText();
        
        // Add related content links
        this.addRelatedContentLinks();
    }

    addContextualLinks() {
        const content = document.body.innerText.toLowerCase();
        const linkOpportunities = [
            {
                keywords: ['fiber internet', 'fiber optic'],
                link: '#services',
                anchor: 'fiber internet services'
            },
            {
                keywords: ['pricing', 'packages', 'plans'],
                link: '#pricing',
                anchor: 'internet packages'
            },
            {
                keywords: ['coverage', 'areas served', 'availability'],
                link: '#coverage',
                anchor: 'coverage areas'
            },
            {
                keywords: ['contact', 'support', 'help'],
                link: '#contact',
                anchor: 'customer support'
            }
        ];

        // This would be implemented to automatically add internal links
        // where contextually appropriate
    }

    optimizeAnchorText() {
        // Review and optimize existing anchor text for SEO
        const links = document.querySelectorAll('a[href^="#"], a[href^="/"]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim().toLowerCase();
            
            // Add title attributes for better accessibility and SEO
            if (!link.getAttribute('title')) {
                let title = '';
                
                if (href === '#services') title = 'View our internet services and solutions';
                else if (href === '#pricing') title = 'Check internet package pricing and plans';
                else if (href === '#coverage') title = 'Check service coverage in your area';
                else if (href === '#contact') title = 'Contact GenTech ISP for support';
                
                if (title) link.setAttribute('title', title);
            }
        });
    }

    addRelatedContentLinks() {
        // Add "Related Services" or "You might also like" sections
        // This would be implemented based on user behavior and content relevance
    }

    /**
     * Image SEO Optimization
     */
    optimizeImageSEO() {
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
            // Add missing alt attributes
            if (!img.getAttribute('alt')) {
                img.setAttribute('alt', this.generateImageAlt(img, index));
            }
            
            // Add title attributes for important images
            this.addImageTitles(img);
            
            // Optimize image loading
            this.optimizeImageLoading(img);
        });
    }

    generateImageAlt(img, index) {
        const src = img.src || '';
        const context = this.getImageContext(img);
        
        // Generate meaningful alt text based on context
        if (src.includes('logo')) return 'GenTech ISP Logo';
        if (src.includes('fiber')) return 'Fiber optic internet infrastructure';
        if (src.includes('5g')) return '5G wireless network technology';
        if (src.includes('satellite')) return 'Satellite internet coverage map';
        if (context.includes('service')) return `Internet service illustration ${index + 1}`;
        if (context.includes('pricing')) return `Internet package pricing plan ${index + 1}`;
        
        return `GenTech ISP service image ${index + 1}`;
    }

    getImageContext(img) {
        // Analyze surrounding content to determine context
        const parent = img.closest('section, div, article');
        if (parent) {
            const text = parent.textContent.toLowerCase();
            return text;
        }
        return '';
    }

    addImageTitles(img) {
        if (!img.getAttribute('title') && img.getAttribute('alt')) {
            const alt = img.getAttribute('alt');
            img.setAttribute('title', alt + ' - GenTech ISP');
        }
    }

    optimizeImageLoading(img) {
        // Add loading="lazy" for non-critical images
        if (!img.getAttribute('loading')) {
            const isAboveFold = img.getBoundingClientRect().top < window.innerHeight;
            if (!isAboveFold) {
                img.setAttribute('loading', 'lazy');
            }
        }
    }

    /**
     * Content Freshness Tracking
     */
    trackContentFreshness() {
        // Add last modified dates to structured data
        this.updateLastModified();
        
        // Track content updates
        this.trackContentUpdates();
    }

    updateLastModified() {
        const lastModified = document.lastModified;
        const metaModified = document.querySelector('meta[name="last-modified"]');
        
        if (!metaModified) {
            const meta = document.createElement('meta');
            meta.name = 'last-modified';
            meta.content = lastModified;
            document.head.appendChild(meta);
        }
    }

    trackContentUpdates() {
        // Track when content sections are updated
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Content was updated
                    this.updateLastModified();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Social Media Optimization
     */
    optimizeSocialSharing() {
        // Add social sharing meta tags
        this.addSocialMetaTags();
        
        // Add social sharing buttons with proper tracking
        this.addSocialSharingTracking();
    }

    addSocialMetaTags() {
        const socialMeta = [
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: 'GenTech ISP' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@gentechISP' },
            { name: 'twitter:creator', content: '@gentechISP' }
        ];

        socialMeta.forEach(meta => {
            const existing = meta.property ? 
                document.querySelector(`meta[property="${meta.property}"]`) :
                document.querySelector(`meta[name="${meta.name}"]`);
            
            if (!existing) {
                const metaTag = document.createElement('meta');
                if (meta.property) metaTag.setAttribute('property', meta.property);
                if (meta.name) metaTag.setAttribute('name', meta.name);
                metaTag.setAttribute('content', meta.content);
                document.head.appendChild(metaTag);
            }
        });
    }

    addSocialSharingTracking() {
        // Track social sharing events
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"]');
            if (target && typeof gtag !== 'undefined') {
                const platform = target.href.includes('facebook') ? 'Facebook' :
                               target.href.includes('twitter') ? 'Twitter' :
                               target.href.includes('linkedin') ? 'LinkedIn' : 'Unknown';
                
                gtag('event', 'social_share', {
                    event_category: 'Social Media',
                    event_label: platform,
                    non_interaction: false
                });
            }
        });
    }

    /**
     * Local SEO Optimization
     */
    optimizeLocalSEO() {
        // Add location-specific keywords
        this.addLocationKeywords();
        
        // Optimize for local searches
        this.optimizeLocalSearch();
        
        // Add location-specific structured data
        this.addLocationStructuredData();
    }

    addLocationKeywords() {
        // Add Kenya-specific location keywords to content
        const locationKeywords = [
            'Kenya', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
            'Kenyan', 'East Africa', 'Westlands', 'CBD'
        ];

        // This would be used to ensure location keywords appear naturally in content
    }

    optimizeLocalSearch() {
        // Add location-specific meta tags
        const geoMeta = [
            { name: 'geo.region', content: 'KE-30' }, // Nairobi region code
            { name: 'geo.placename', content: 'Nairobi' },
            { name: 'geo.position', content: '-1.2921;36.8219' },
            { name: 'ICBM', content: '-1.2921, 36.8219' }
        ];

        geoMeta.forEach(meta => {
            const existing = document.querySelector(`meta[name="${meta.name}"]`);
            if (!existing) {
                const metaTag = document.createElement('meta');
                metaTag.setAttribute('name', meta.name);
                metaTag.setAttribute('content', meta.content);
                document.head.appendChild(metaTag);
            }
        });
    }

    addLocationStructuredData() {
        const placeSchema = {
            "@context": "https://schema.org",
            "@type": "Place",
            "name": "GenTech ISP Office",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Westlands Road",
                "addressLocality": "Nairobi",
                "addressRegion": "Nairobi County",
                "postalCode": "00100",
                "addressCountry": "KE"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": -1.2921,
                "longitude": 36.8219
            },
            "telephone": "+254-700-123456",
            "url": this.baseURL
        };

        this.addSchemaToHead('place-schema', placeSchema);
    }

    /**
     * Utility Functions
     */
    estimateWordCount() {
        const textContent = document.body.innerText;
        return textContent.split(/\s+/).length;
    }

    // Monitor and report SEO metrics
    reportSEOMetrics() {
        const metrics = {
            wordCount: this.estimateWordCount(),
            imageCount: document.querySelectorAll('img').length,
            imagesWithAlt: document.querySelectorAll('img[alt]').length,
            internalLinks: document.querySelectorAll('a[href^="#"], a[href^="/"]').length,
            externalLinks: document.querySelectorAll('a[href^="http"]:not([href*="gentech.co.ke"])').length,
            headings: {
                h1: document.querySelectorAll('h1').length,
                h2: document.querySelectorAll('h2').length,
                h3: document.querySelectorAll('h3').length
            }
        };

        console.log('SEO Metrics:', metrics);
        
        // Report to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'seo_metrics', {
                event_category: 'SEO',
                custom_parameters: metrics,
                non_interaction: true
            });
        }

        return metrics;
    }
}

// Initialize SEO optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SEOOptimizer();
    
    // Report SEO metrics after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const seoOptimizer = new SEOOptimizer();
            seoOptimizer.reportSEOMetrics();
        }, 2000);
    });
});

// Export for use in other modules
window.SEOOptimizer = SEOOptimizer;
