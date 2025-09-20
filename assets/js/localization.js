/**
 * GenTech ISP Localization System
 * Comprehensive multi-language support with dynamic content loading
 */

class LocalizationManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('gentech-language') || 'en';
        this.fallbackLanguage = 'en';
        this.translations = {};
        this.regions = {};
        this.currencies = {};
        this.loadingPromises = {};
        
        this.init();
    }

    async init() {
        try {
            // Load initial translations
            await this.loadTranslations(this.currentLanguage);
            
            // Setup language switcher
            this.setupLanguageSwitcher();
            
            // Setup currency system
            this.setupCurrencySystem();
            
            // Setup regional system
            this.setupRegionalSystem();
            
            // Apply current language
            this.applyLanguage(this.currentLanguage);
            
            console.log('✅ Localization system initialized');
        } catch (error) {
            console.error('❌ Localization initialization failed:', error);
            this.applyLanguage(this.fallbackLanguage);
        }
    }

    async loadTranslations(language) {
        if (this.translations[language]) {
            return this.translations[language];
        }

        if (this.loadingPromises[language]) {
            return this.loadingPromises[language];
        }

        this.loadingPromises[language] = this.fetchTranslations(language);
        
        try {
            const translations = await this.loadingPromises[language];
            this.translations[language] = translations;
            return translations;
        } catch (error) {
            console.error(`Failed to load translations for ${language}:`, error);
            delete this.loadingPromises[language];
            
            // Return fallback translations if available
            if (language !== this.fallbackLanguage && this.translations[this.fallbackLanguage]) {
                return this.translations[this.fallbackLanguage];
            }
            
            return this.getDefaultTranslations();
        }
    }

    async fetchTranslations(language) {
        // In a real implementation, this would fetch from server
        // For now, return embedded translations
        return this.getTranslationsForLanguage(language);
    }

    getTranslationsForLanguage(language) {
        const translations = {
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.plans': 'Plans',
                'nav.business': 'Business',
                'nav.support': 'Support',
                'nav.contact': 'Contact',
                
                // Hero Section
                'hero.title': 'Revolutionary Internet Solutions',
                'hero.subtitle': 'Experience lightning-fast connectivity with our cutting-edge fiber, 5G, and satellite internet solutions across Kenya.',
                'hero.cta.primary': 'View Plans',
                'hero.cta.secondary': 'Test Speed',
                'hero.stats.customers': 'Happy Customers',
                'hero.stats.uptime': 'Network Uptime',
                'hero.stats.coverage': 'Area Coverage',
                'hero.stats.support': '24/7 Support',
                
                // Plans Section
                'plans.title': 'Internet Plans',
                'plans.subtitle': 'Choose the perfect plan for your needs',
                'plans.basic.title': 'Home Basic',
                'plans.basic.speed': 'Up to 25 Mbps',
                'plans.basic.data': 'Unlimited Data',
                'plans.premium.title': 'Home Premium',
                'plans.premium.speed': 'Up to 100 Mbps',
                'plans.premium.data': 'Unlimited Data',
                'plans.business.title': 'Business Pro',
                'plans.business.speed': 'Up to 500 Mbps',
                'plans.business.data': 'Unlimited Data',
                'plans.cta': 'Get Started',
                'plans.features.installation': 'Free Installation',
                'plans.features.support': '24/7 Technical Support',
                'plans.features.router': 'Free WiFi Router',
                'plans.features.guarantee': '99.9% Uptime Guarantee',
                
                // Contact Section
                'contact.title': 'Get In Touch',
                'contact.subtitle': 'Ready to upgrade your internet experience?',
                'contact.phone': 'Call Us',
                'contact.email': 'Email Us',
                'contact.whatsapp': 'WhatsApp',
                'contact.address': 'Visit Us',
                'contact.form.name': 'Full Name',
                'contact.form.email': 'Email Address',
                'contact.form.phone': 'Phone Number',
                'contact.form.message': 'Message',
                'contact.form.submit': 'Send Message',
                'contact.form.success': 'Message sent successfully!',
                
                // Coverage Areas
                'coverage.kakamega': 'Kakamega County',
                'coverage.kakamega.desc': 'Full operational coverage with fiber and 5G networks',
                'coverage.bungoma': 'Bungoma County',
                'coverage.bungoma.desc': 'Expanding fiber coverage with wireless backup',
                'coverage.busia': 'Busia County',
                'coverage.busia.desc': 'Border connectivity with satellite solutions',
                'coverage.transnzoia': 'Trans Nzoia County',
                'coverage.transnzoia.desc': 'Agricultural region coverage with reliable connectivity',
                'coverage.kisumu': 'Kisumu City',
                'coverage.kisumu.desc': 'Urban fiber network with high-speed options',
                
                // Currency
                'currency.ksh': 'Kenyan Shilling',
                'currency.usd': 'US Dollar',
                'currency.eur': 'Euro',
                'currency.gbp': 'British Pound',
                
                // Common
                'common.loading': 'Loading...',
                'common.error': 'An error occurred',
                'common.retry': 'Try Again',
                'common.close': 'Close',
                'common.save': 'Save',
                'common.cancel': 'Cancel',
                'common.next': 'Next',
                'common.previous': 'Previous',
                'common.continue': 'Continue',
                'common.month': 'month',
                'common.year': 'year',
                'common.per': 'per',
                'common.from': 'from',
                'common.to': 'to',
                'common.learn_more': 'Learn More',
                'common.get_started': 'Get Started',
                
                // Regional Contact
                'regional.kakamega.phone': '+254 700 123 456',
                'regional.kakamega.address': 'Kakamega Town, Kenya',
                'regional.kakamega.email': 'kakamega@gentech.co.ke',
                'regional.bungoma.phone': '+254 700 234 567',
                'regional.bungoma.address': 'Bungoma Town, Kenya',
                'regional.bungoma.email': 'bungoma@gentech.co.ke',
                'regional.busia.phone': '+254 700 345 678',
                'regional.busia.address': 'Busia Town, Kenya',
                'regional.busia.email': 'busia@gentech.co.ke',
                'regional.transnzoia.phone': '+254 700 456 789',
                'regional.transnzoia.address': 'Kitale Town, Kenya',
                'regional.transnzoia.email': 'transnzoia@gentech.co.ke',
                'regional.kisumu.phone': '+254 700 567 890',
                'regional.kisumu.address': 'Kisumu City, Kenya',
                'regional.kisumu.email': 'kisumu@gentech.co.ke'
            },
            
            sw: {
                // Navigation - Swahili
                'nav.home': 'Nyumbani',
                'nav.about': 'Kuhusu',
                'nav.plans': 'Mipango',
                'nav.business': 'Biashara',
                'nav.support': 'Msaada',
                'nav.contact': 'Mawasiliano',
                
                // Hero Section - Swahili
                'hero.title': 'Suluhisho za Mtandao wa Mapinduzi',
                'hero.subtitle': 'Furahia muunganisho wa kasi ya umeme kwa suluhisho zetu za kisasa za nyuzi, 5G, na satellite kote Kenya.',
                'hero.cta.primary': 'Tazama Mipango',
                'hero.cta.secondary': 'Pima Kasi',
                'hero.stats.customers': 'Wateja Wenye Furaha',
                'hero.stats.uptime': 'Muda wa Mtandao',
                'hero.stats.coverage': 'Uwazi wa Eneo',
                'hero.stats.support': 'Msaada 24/7',
                
                // Plans Section - Swahili
                'plans.title': 'Mipango ya Mtandao',
                'plans.subtitle': 'Chagua mpango kamili kwa mahitaji yako',
                'plans.basic.title': 'Nyumba Msingi',
                'plans.basic.speed': 'Hadi 25 Mbps',
                'plans.basic.data': 'Data Isiyopungua',
                'plans.premium.title': 'Nyumba Bora',
                'plans.premium.speed': 'Hadi 100 Mbps',
                'plans.premium.data': 'Data Isiyopungua',
                'plans.business.title': 'Biashara Mtaalamu',
                'plans.business.speed': 'Hadi 500 Mbps',
                'plans.business.data': 'Data Isiyopungua',
                'plans.cta': 'Anza',
                'plans.features.installation': 'Usakinishaji Bure',
                'plans.features.support': 'Msaada wa Kiufundi 24/7',
                'plans.features.router': 'Router ya WiFi Bure',
                'plans.features.guarantee': 'Uhakika wa 99.9% Uptime',
                
                // Contact Section - Swahili
                'contact.title': 'Wasiliana Nasi',
                'contact.subtitle': 'Uko tayari kuboresha uzoefu wako wa mtandao?',
                'contact.phone': 'Tupigie Simu',
                'contact.email': 'Tumumie Barua Pepe',
                'contact.whatsapp': 'WhatsApp',
                'contact.address': 'Tutembelee',
                'contact.form.name': 'Jina Kamili',
                'contact.form.email': 'Anwani ya Barua Pepe',
                'contact.form.phone': 'Nambari ya Simu',
                'contact.form.message': 'Ujumbe',
                'contact.form.submit': 'Tuma Ujumbe',
                'contact.form.success': 'Ujumbe umetumwa kwa ufanisi!',
                
                // Coverage Areas - Swahili
                'coverage.kakamega': 'Kaunti ya Kakamega',
                'coverage.kakamega.desc': 'Uwazi kamili wa uendeshaji na mitandao ya nyuzi na 5G',
                'coverage.bungoma': 'Kaunti ya Bungoma',
                'coverage.bungoma.desc': 'Kupanua uwazi wa nyuzi na msaada wa wireless',
                'coverage.busia': 'Kaunti ya Busia',
                'coverage.busia.desc': 'Muunganisho wa mpakani na suluhisho za satellite',
                'coverage.transnzoia': 'Kaunti ya Trans Nzoia',
                'coverage.transnzoia.desc': 'Uwazi wa mkoa wa kilimo na muunganisho wa kuaminika',
                'coverage.kisumu': 'Jiji la Kisumu',
                'coverage.kisumu.desc': 'Mtandao wa nyuzi wa mijini na chaguo za kasi ya juu',
                
                // Currency - Swahili
                'currency.ksh': 'Shilingi ya Kenya',
                'currency.usd': 'Dola ya Marekani',
                'currency.eur': 'Euro',
                'currency.gbp': 'Pauni ya Uingereza',
                
                // Common - Swahili
                'common.loading': 'Inapakia...',
                'common.error': 'Hitilafu imetokea',
                'common.retry': 'Jaribu Tena',
                'common.close': 'Funga',
                'common.save': 'Hifadhi',
                'common.cancel': 'Ghairi',
                'common.next': 'Ifuatayo',
                'common.previous': 'Iliyotangulia',
                'common.continue': 'Endelea',
                'common.month': 'mwezi',
                'common.year': 'mwaka',
                'common.per': 'kwa',
                'common.from': 'kutoka',
                'common.to': 'hadi',
                'common.learn_more': 'Jifunze Zaidi',
                'common.get_started': 'Anza',
                
                // Regional Contact - Swahili
                'regional.kakamega.phone': '+254 700 123 456',
                'regional.kakamega.address': 'Mji wa Kakamega, Kenya',
                'regional.kakamega.email': 'kakamega@gentech.co.ke',
                'regional.bungoma.phone': '+254 700 234 567',
                'regional.bungoma.address': 'Mji wa Bungoma, Kenya',
                'regional.bungoma.email': 'bungoma@gentech.co.ke',
                'regional.busia.phone': '+254 700 345 678',
                'regional.busia.address': 'Mji wa Busia, Kenya',
                'regional.busia.email': 'busia@gentech.co.ke',
                'regional.transnzoia.phone': '+254 700 456 789',
                'regional.transnzoia.address': 'Mji wa Kitale, Kenya',
                'regional.transnzoia.email': 'transnzoia@gentech.co.ke',
                'regional.kisumu.phone': '+254 700 567 890',
                'regional.kisumu.address': 'Jiji la Kisumu, Kenya',
                'regional.kisumu.email': 'kisumu@gentech.co.ke'
            }
        };

        return translations[language] || translations[this.fallbackLanguage];
    }

    getDefaultTranslations() {
        return this.getTranslationsForLanguage(this.fallbackLanguage);
    }

    setupLanguageSwitcher() {
        // Create language switcher UI
        this.createLanguageSwitcher();
        
        // Handle language change events
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-language]')) {
                const language = e.target.dataset.language;
                this.changeLanguage(language);
            }
        });
    }

    createLanguageSwitcher() {
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher fixed top-4 right-4 z-50 md:relative md:top-auto md:right-auto';
        switcher.innerHTML = `
            <div class="relative">
                <button id="languageDropdown" class="flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <i class="fas fa-globe mr-2"></i>
                    <span class="current-language">${this.currentLanguage === 'sw' ? 'Kiswahili' : 'English'}</span>
                    <i class="fas fa-chevron-down ml-2 text-xs"></i>
                </button>
                <div id="languageMenu" class="language-menu absolute top-full right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden opacity-0 invisible transition-all duration-200">
                    <button data-language="en" class="language-option w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center ${this.currentLanguage === 'en' ? 'bg-blue-600' : ''}">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiMwMDI0N0QiLz48cGF0aCBkPSJNMCAwSDI0VjhIMFoiIGZpbGw9IiNDRjE0MkIiLz48cGF0aCBkPSJNMCAxNkgyNFYyNEgwWiIgZmlsbD0iI0NGMTQyQiIvPjwvc3ZnPg==" alt="EN" class="w-5 h-5 mr-3 rounded">
                        <span>English</span>
                    </button>
                    <button data-language="sw" class="language-option w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center ${this.currentLanguage === 'sw' ? 'bg-blue-600' : ''}">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNMCAwSDI0VjhIMFoiIGZpbGw9IiNGRkZGRkYiLz48cGF0aCBkPSJNMCAxNkgyNFYyNEgwWiIgZmlsbD0iIzAwRkYwMCIvPjwvc3ZnPg==" alt="SW" class="w-5 h-5 mr-3 rounded">
                        <span>Kiswahili</span>
                    </button>
                </div>
            </div>
        `;

        // Add to navigation or create floating switcher
        const nav = document.querySelector('.navbar-nav');
        if (nav) {
            nav.appendChild(switcher);
        } else {
            document.body.appendChild(switcher);
        }

        // Toggle dropdown
        document.getElementById('languageDropdown').addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = document.getElementById('languageMenu');
            const isVisible = !menu.classList.contains('opacity-0');
            
            if (isVisible) {
                menu.classList.add('opacity-0', 'invisible');
            } else {
                menu.classList.remove('opacity-0', 'invisible');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            const menu = document.getElementById('languageMenu');
            menu.classList.add('opacity-0', 'invisible');
        });
    }

    setupCurrencySystem() {
        this.currencies = {
            KSH: { symbol: 'KSh', rate: 1, name: 'Kenyan Shilling' },
            USD: { symbol: '$', rate: 0.0067, name: 'US Dollar' },
            EUR: { symbol: '€', rate: 0.0061, name: 'Euro' },
            GBP: { symbol: '£', rate: 0.0053, name: 'British Pound' }
        };

        this.currentCurrency = localStorage.getItem('gentech-currency') || 'KSH';
    }

    setupRegionalSystem() {
        this.regions = {
            'kakamega': {
                name: 'Kakamega County',
                phone: '+254 700 123 456',
                email: 'kakamega@gentech.co.ke',
                address: 'Kakamega Town, Kenya',
                coordinates: [0.2842, 34.7519],
                coverage: 'full',
                plans: {
                    basic: { price: 2500, installation: 'free' },
                    premium: { price: 4500, installation: 'free' },
                    business: { price: 8500, installation: 'free' }
                }
            },
            'bungoma': {
                name: 'Bungoma County',
                phone: '+254 700 234 567',
                email: 'bungoma@gentech.co.ke',
                address: 'Bungoma Town, Kenya',
                coordinates: [0.5692, 34.5606],
                coverage: 'expanding',
                plans: {
                    basic: { price: 2800, installation: 'free' },
                    premium: { price: 4800, installation: 'free' },
                    business: { price: 9000, installation: 'free' }
                }
            },
            'busia': {
                name: 'Busia County',
                phone: '+254 700 345 678',
                email: 'busia@gentech.co.ke',
                address: 'Busia Town, Kenya',
                coordinates: [0.4601, 34.1115],
                coverage: 'satellite',
                plans: {
                    basic: { price: 3200, installation: 1500 },
                    premium: { price: 5500, installation: 1500 },
                    business: { price: 10500, installation: 2000 }
                }
            },
            'transnzoia': {
                name: 'Trans Nzoia County',
                phone: '+254 700 456 789',
                email: 'transnzoia@gentech.co.ke',
                address: 'Kitale Town, Kenya',
                coordinates: [1.0153, 35.0062],
                coverage: 'wireless',
                plans: {
                    basic: { price: 3000, installation: 1000 },
                    premium: { price: 5200, installation: 1000 },
                    business: { price: 9800, installation: 1500 }
                }
            },
            'kisumu': {
                name: 'Kisumu City',
                phone: '+254 700 567 890',
                email: 'kisumu@gentech.co.ke',
                address: 'Kisumu City, Kenya',
                coordinates: [-0.1022, 34.7617],
                coverage: 'fiber',
                plans: {
                    basic: { price: 2200, installation: 'free' },
                    premium: { price: 4200, installation: 'free' },
                    business: { price: 8200, installation: 'free' }
                }
            }
        };

        this.currentRegion = this.detectUserRegion();
    }

    detectUserRegion() {
        // In a real implementation, this would use IP geolocation
        // For now, default to Kakamega
        return localStorage.getItem('gentech-region') || 'kakamega';
    }

    async changeLanguage(language) {
        try {
            this.showLoadingState();
            
            await this.loadTranslations(language);
            this.currentLanguage = language;
            localStorage.setItem('gentech-language', language);
            
            this.applyLanguage(language);
            this.updateLanguageSwitcher();
            
            this.hideLoadingState();
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language, translations: this.translations[language] }
            }));
            
        } catch (error) {
            console.error('Language change failed:', error);
            this.hideLoadingState();
        }
    }

    applyLanguage(language) {
        const translations = this.translations[language] || this.getDefaultTranslations();
        
        // Update all translatable elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            const translation = this.getNestedTranslation(translations, key);
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = language;
        
        // Update meta tags
        this.updateMetaTags(language);
        
        // Update pricing based on region
        this.updateRegionalPricing();
    }

    getNestedTranslation(translations, key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], translations);
    }

    updateLanguageSwitcher() {
        const currentLangElement = document.querySelector('.current-language');
        if (currentLangElement) {
            currentLangElement.textContent = this.currentLanguage === 'sw' ? 'Kiswahili' : 'English';
        }

        // Update active state
        document.querySelectorAll('.language-option').forEach(option => {
            const isActive = option.dataset.language === this.currentLanguage;
            option.classList.toggle('bg-blue-600', isActive);
        });
    }

    updateMetaTags(language) {
        const translations = this.translations[language] || this.getDefaultTranslations();
        
        // Update page title
        document.title = `GenTech ISP - ${translations['hero.title']} | Kenya`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = translations['hero.subtitle'];
        }
    }

    convertCurrency(amount, fromCurrency = 'KSH', toCurrency = this.currentCurrency) {
        const fromRate = this.currencies[fromCurrency]?.rate || 1;
        const toRate = this.currencies[toCurrency]?.rate || 1;
        
        return (amount / fromRate) * toRate;
    }

    formatCurrency(amount, currency = this.currentCurrency) {
        const currencyInfo = this.currencies[currency];
        if (!currencyInfo) return `${amount}`;
        
        return `${currencyInfo.symbol}${Math.round(amount).toLocaleString()}`;
    }

    updateRegionalPricing() {
        const region = this.regions[this.currentRegion];
        if (!region) return;

        document.querySelectorAll('[data-price]').forEach(element => {
            const planType = element.dataset.price;
            const plan = region.plans[planType];
            
            if (plan) {
                const convertedPrice = this.convertCurrency(plan.price);
                element.textContent = this.formatCurrency(convertedPrice);
            }
        });

        // Update installation fees
        document.querySelectorAll('[data-installation]').forEach(element => {
            const planType = element.dataset.installation;
            const plan = region.plans[planType];
            
            if (plan) {
                if (plan.installation === 'free') {
                    element.textContent = this.translate('plans.features.installation');
                } else {
                    const convertedFee = this.convertCurrency(plan.installation);
                    element.textContent = this.formatCurrency(convertedFee);
                }
            }
        });
    }

    translate(key, params = {}) {
        const translations = this.translations[this.currentLanguage] || this.getDefaultTranslations();
        let translation = this.getNestedTranslation(translations, key) || key;
        
        // Replace parameters
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });
        
        return translation;
    }

    showLoadingState() {
        document.body.classList.add('language-loading');
    }

    hideLoadingState() {
        document.body.classList.remove('language-loading');
    }

    getCurrentRegion() {
        return this.regions[this.currentRegion];
    }

    setRegion(regionId) {
        if (this.regions[regionId]) {
            this.currentRegion = regionId;
            localStorage.setItem('gentech-region', regionId);
            this.updateRegionalPricing();
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('regionChanged', {
                detail: { region: this.regions[regionId] }
            }));
        }
    }

    // Method to get all available languages
    getAvailableLanguages() {
        return [
            { code: 'en', name: 'English', native: 'English' },
            { code: 'sw', name: 'Swahili', native: 'Kiswahili' }
        ];
    }

    // Method to get all available regions
    getAvailableRegions() {
        return Object.keys(this.regions).map(key => ({
            id: key,
            ...this.regions[key]
        }));
    }
}

// Initialize localization system
const localization = new LocalizationManager();

// Export for global access
window.localization = localization;

console.log('🌍 Localization system loaded');
