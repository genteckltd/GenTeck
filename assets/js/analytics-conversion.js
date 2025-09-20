/**
 * GenTech ISP Analytics & Conversion Tracking System
 * Comprehensive tracking for user behavior and conversion optimization
 */

class AnalyticsManager {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.events = [];
        this.conversions = [];
        this.leadData = {};
        this.socialProofData = this.initializeSocialProof();
        this.exitIntentTriggered = false;
        this.pageStartTime = Date.now();
        this.scrollDepth = 0;
        this.maxScrollDepth = 0;
        
        this.init();
    }

    async init() {
        try {
            // Initialize tracking
            this.setupEventTracking();
            this.setupScrollTracking();
            this.setupExitIntentDetection();
            this.setupFormTracking();
            this.setupSocialProofWidgets();
            this.setupConversionTracking();
            
            // Track page view
            this.trackEvent('page_view', {
                url: window.location.href,
                title: document.title,
                referrer: document.referrer,
                timestamp: Date.now()
            });
            
            console.log('📊 Analytics system initialized');
        } catch (error) {
            console.error('❌ Analytics initialization failed:', error);
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUserId() {
        let userId = localStorage.getItem('gentech-user-id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('gentech-user-id', userId);
        }
        return userId;
    }

    initializeSocialProof() {
        return {
            totalCustomers: 15847 + Math.floor(Math.random() * 100),
            activeConnections: 12456 + Math.floor(Math.random() * 50),
            uptime: 99.94 + (Math.random() * 0.05),
            speedTests: 8923 + Math.floor(Math.random() * 20),
            lastUpdate: Date.now()
        };
    }

    setupEventTracking() {
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[data-track]');
            if (element) {
                const action = element.dataset.track;
                const category = element.dataset.trackCategory || 'interaction';
                const label = element.dataset.trackLabel || element.textContent.trim();
                
                this.trackEvent('click', {
                    action,
                    category,
                    label,
                    element: element.tagName,
                    elementId: element.id,
                    elementClass: element.className
                });
            }
        });

        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, [role="button"]')) {
                this.trackEvent('button_click', {
                    text: e.target.textContent.trim(),
                    id: e.target.id,
                    class: e.target.className,
                    section: this.getCurrentSection(e.target)
                });
            }
        });

        // Track link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href]')) {
                const href = e.target.href;
                const isExternal = !href.includes(window.location.hostname);
                
                this.trackEvent('link_click', {
                    url: href,
                    text: e.target.textContent.trim(),
                    isExternal,
                    section: this.getCurrentSection(e.target)
                });
            }
        });
    }

    setupScrollTracking() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = Math.round((scrollTop / docHeight) * 100);
                
                this.scrollDepth = scrollPercent;
                this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercent);
                
                // Track milestone scroll depths
                if ([25, 50, 75, 90].includes(scrollPercent) && !this.scrollMilestones) {
                    this.scrollMilestones = this.scrollMilestones || new Set();
                    if (!this.scrollMilestones.has(scrollPercent)) {
                        this.scrollMilestones.add(scrollPercent);
                        this.trackEvent('scroll_depth', {
                            depth: scrollPercent,
                            section: this.getCurrentVisibleSection()
                        });
                    }
                }
            }, 100);
        });
    }

    setupExitIntentDetection() {
        let exitIntentShown = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentShown && !this.exitIntentTriggered) {
                this.exitIntentTriggered = true;
                exitIntentShown = true;
                
                this.trackEvent('exit_intent', {
                    timeOnPage: Date.now() - this.pageStartTime,
                    scrollDepth: this.maxScrollDepth,
                    section: this.getCurrentVisibleSection()
                });
                
                this.showExitIntentPopup();
            }
        });

        // Mobile exit intent (scroll to top quickly)
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            if (scrollTop < lastScrollTop - 50 && scrollTop < 100 && !exitIntentShown) {
                exitIntentShown = true;
                this.exitIntentTriggered = true;
                
                this.trackEvent('mobile_exit_intent', {
                    timeOnPage: Date.now() - this.pageStartTime,
                    scrollDepth: this.maxScrollDepth
                });
                
                this.showExitIntentPopup();
            }
            lastScrollTop = scrollTop;
        });
    }

    setupFormTracking() {
        // Track form interactions
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.trackEvent('form_field_focus', {
                    fieldName: e.target.name || e.target.id,
                    fieldType: e.target.type,
                    formId: e.target.closest('form')?.id,
                    section: this.getCurrentSection(e.target)
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData.entries());
            
            this.trackEvent('form_submit', {
                formId: form.id,
                formClass: form.className,
                fields: Object.keys(formObject),
                section: this.getCurrentSection(form)
            });
            
            // Store lead data
            this.updateLeadProfile(formObject);
        });
    }

    setupSocialProofWidgets() {
        this.createSocialProofWidgets();
        this.startSocialProofUpdates();
    }

    createSocialProofWidgets() {
        // Customer count widget
        const customerWidget = this.createWidget('customer-count', {
            position: 'top-right',
            icon: 'fas fa-users',
            title: 'Happy Customers',
            value: this.socialProofData.totalCustomers.toLocaleString(),
            subtitle: 'and growing!'
        });

        // Uptime widget
        const uptimeWidget = this.createWidget('uptime-stats', {
            position: 'bottom-right',
            icon: 'fas fa-signal',
            title: 'Network Uptime',
            value: this.socialProofData.uptime.toFixed(2) + '%',
            subtitle: 'last 30 days'
        });

        // Live activity widget
        const activityWidget = this.createWidget('live-activity', {
            position: 'bottom-left',
            icon: 'fas fa-wifi',
            title: 'Active Connections',
            value: this.socialProofData.activeConnections.toLocaleString(),
            subtitle: 'right now',
            pulse: true
        });

        // Add to page
        document.body.appendChild(customerWidget);
        document.body.appendChild(uptimeWidget);
        document.body.appendChild(activityWidget);
    }

    createWidget(id, options) {
        const widget = document.createElement('div');
        widget.id = id;
        widget.className = `social-proof-widget fixed z-40 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs transform transition-all duration-500 ${this.getPositionClasses(options.position)}`;
        
        widget.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0 mr-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center ${options.pulse ? 'animate-pulse' : ''}">
                        <i class="${options.icon} text-white text-sm"></i>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">${options.title}</p>
                    <p class="text-lg font-bold text-gray-900">${options.value}</p>
                    <p class="text-xs text-gray-600">${options.subtitle}</p>
                </div>
                <button class="ml-2 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.style.display='none'">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        `;

        // Show with delay
        widget.style.opacity = '0';
        widget.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            widget.style.opacity = '1';
            widget.style.transform = 'translateY(0)';
        }, Math.random() * 3000 + 2000);

        return widget;
    }

    getPositionClasses(position) {
        const positions = {
            'top-left': 'top-20 left-4',
            'top-right': 'top-20 right-4',
            'bottom-left': 'bottom-20 left-4',
            'bottom-right': 'bottom-20 right-4'
        };
        return positions[position] || positions['top-right'];
    }

    startSocialProofUpdates() {
        // Update social proof data every 30 seconds
        setInterval(() => {
            this.updateSocialProofData();
            this.updateWidgetDisplay();
        }, 30000);
    }

    updateSocialProofData() {
        // Simulate real-time updates
        this.socialProofData.totalCustomers += Math.floor(Math.random() * 3);
        this.socialProofData.activeConnections += Math.floor(Math.random() * 10 - 5);
        this.socialProofData.uptime = Math.min(99.99, this.socialProofData.uptime + (Math.random() * 0.01 - 0.005));
        this.socialProofData.speedTests += Math.floor(Math.random() * 5);
        this.socialProofData.lastUpdate = Date.now();
    }

    updateWidgetDisplay() {
        // Update customer count
        const customerWidget = document.getElementById('customer-count');
        if (customerWidget) {
            const valueElement = customerWidget.querySelector('.text-lg.font-bold');
            if (valueElement) {
                valueElement.textContent = this.socialProofData.totalCustomers.toLocaleString();
            }
        }

        // Update uptime
        const uptimeWidget = document.getElementById('uptime-stats');
        if (uptimeWidget) {
            const valueElement = uptimeWidget.querySelector('.text-lg.font-bold');
            if (valueElement) {
                valueElement.textContent = this.socialProofData.uptime.toFixed(2) + '%';
            }
        }

        // Update active connections
        const activityWidget = document.getElementById('live-activity');
        if (activityWidget) {
            const valueElement = activityWidget.querySelector('.text-lg.font-bold');
            if (valueElement) {
                valueElement.textContent = this.socialProofData.activeConnections.toLocaleString();
            }
        }
    }

    showExitIntentPopup() {
        // Don't show if already shown or user is on mobile
        if (document.getElementById('exitIntentPopup') || window.innerWidth < 768) return;

        const popup = document.createElement('div');
        popup.id = 'exitIntentPopup';
        popup.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in';
        
        popup.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-md mx-4 transform animate-scale-in">
                <div class="relative p-8">
                    <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onclick="this.closest('#exitIntentPopup').remove()">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                    
                    <div class="text-center">
                        <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-exclamation text-white text-2xl"></i>
                        </div>
                        
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Wait! Don't Leave Yet!</h3>
                        <p class="text-gray-600 mb-6">
                            Get exclusive 50% off your first month of internet service.
                            This offer expires in <span id="countdown" class="text-red-600 font-bold">5:00</span>
                        </p>
                        
                        <div class="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-4 mb-6">
                            <div class="text-white text-center">
                                <div class="text-sm opacity-90">Special Exit Offer</div>
                                <div class="text-2xl font-bold">50% OFF</div>
                                <div class="text-sm opacity-90">First Month</div>
                            </div>
                        </div>
                        
                        <form id="exitOfferForm" class="space-y-4">
                            <input type="email" placeholder="Enter your email for instant access" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                            <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200">
                                Claim 50% Discount Now
                            </button>
                        </form>
                        
                        <div class="mt-4 text-xs text-gray-500 text-center">
                            * Valid for new customers only. Offer expires in 5 minutes.
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        
        // Start countdown
        this.startCountdown('countdown', 5 * 60);
        
        // Track exit intent popup shown
        this.trackEvent('exit_intent_popup_shown', {
            timeOnPage: Date.now() - this.pageStartTime,
            scrollDepth: this.maxScrollDepth
        });
        
        // Handle form submission
        document.getElementById('exitOfferForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            
            this.trackConversion('exit_intent_email', {
                email,
                offer: '50_percent_off',
                timeToConvert: Date.now() - this.pageStartTime
            });
            
            // Show success message
            popup.innerHTML = `
                <div class="bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-8 text-center">
                    <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check text-white text-2xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">Offer Claimed!</h3>
                    <p class="text-gray-600 mb-6">
                        Check your email for instructions to redeem your 50% discount.
                    </p>
                    <button class="bg-blue-600 text-white px-6 py-2 rounded-lg" onclick="this.closest('#exitIntentPopup').remove()">
                        Continue Browsing
                    </button>
                </div>
            `;
            
            setTimeout(() => {
                popup.remove();
            }, 3000);
        });
    }

    startCountdown(elementId, seconds) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const interval = setInterval(() => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            element.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            
            if (seconds <= 0) {
                clearInterval(interval);
                element.textContent = 'Expired';
                element.style.color = '#dc2626';
            }
            
            seconds--;
        }, 1000);
    }

    setupConversionTracking() {
        // Define conversion goals
        this.conversionGoals = {
            'plan_selection': { weight: 10, category: 'engagement' },
            'contact_form_submit': { weight: 25, category: 'lead' },
            'phone_click': { weight: 30, category: 'lead' },
            'chat_start': { weight: 20, category: 'engagement' },
            'speed_test_complete': { weight: 15, category: 'engagement' },
            'exit_intent_email': { weight: 35, category: 'lead' },
            'account_creation': { weight: 50, category: 'conversion' },
            'plan_signup': { weight: 100, category: 'conversion' }
        };

        // Auto-track common conversions
        this.setupAutoConversionTracking();
    }

    setupAutoConversionTracking() {
        // Track phone clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('a[href^="tel:"]')) {
                this.trackConversion('phone_click', {
                    number: e.target.href.replace('tel:', ''),
                    section: this.getCurrentSection(e.target)
                });
            }
        });

        // Track WhatsApp clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('a[href*="whatsapp"]')) {
                this.trackConversion('whatsapp_click', {
                    section: this.getCurrentSection(e.target)
                });
            }
        });

        // Track plan selections
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-plan]')) {
                const plan = e.target.closest('[data-plan]').dataset.plan;
                this.trackConversion('plan_selection', {
                    plan,
                    section: this.getCurrentSection(e.target)
                });
            }
        });
    }

    updateLeadProfile(formData) {
        // Progressive profiling - build user profile over time
        Object.assign(this.leadData, formData);
        
        // Calculate lead score
        const leadScore = this.calculateLeadScore();
        this.leadData.leadScore = leadScore;
        this.leadData.lastUpdate = Date.now();
        
        // Store in localStorage
        localStorage.setItem('gentech-lead-profile', JSON.stringify(this.leadData));
        
        this.trackEvent('lead_profile_updated', {
            fields: Object.keys(formData),
            leadScore,
            profileCompleteness: this.getProfileCompleteness()
        });
    }

    calculateLeadScore() {
        let score = 0;
        
        // Basic information
        if (this.leadData.name) score += 10;
        if (this.leadData.email) score += 15;
        if (this.leadData.phone) score += 15;
        
        // Engagement signals
        score += Math.min(this.maxScrollDepth / 10, 10); // Max 10 points for scroll
        score += Math.min(this.events.length, 20); // Max 20 points for interactions
        score += Math.min((Date.now() - this.pageStartTime) / 60000 * 2, 15); // Max 15 points for time on site
        
        // Conversion signals
        const conversionScore = this.conversions.reduce((sum, conv) => {
            return sum + (this.conversionGoals[conv.type]?.weight || 0);
        }, 0);
        score += Math.min(conversionScore, 50);
        
        return Math.round(score);
    }

    getProfileCompleteness() {
        const totalFields = ['name', 'email', 'phone', 'address', 'company', 'plan_interest'];
        const completedFields = totalFields.filter(field => this.leadData[field]);
        return Math.round((completedFields.length / totalFields.length) * 100);
    }

    trackEvent(eventType, data = {}) {
        const event = {
            id: this.generateEventId(),
            type: eventType,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            data: {
                ...data,
                url: window.location.href,
                userAgent: navigator.userAgent,
                screenResolution: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        };

        this.events.push(event);
        this.sendToAnalytics(event);
        
        console.log('📊 Event tracked:', eventType, data);
    }

    trackConversion(conversionType, data = {}) {
        const conversion = {
            id: this.generateEventId(),
            type: conversionType,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            value: this.conversionGoals[conversionType]?.weight || 0,
            data
        };

        this.conversions.push(conversion);
        this.sendToAnalytics(conversion, 'conversion');
        
        console.log('🎯 Conversion tracked:', conversionType, data);
    }

    generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }

    sendToAnalytics(data, type = 'event') {
        // In production, send to actual analytics service
        // For now, store locally and log
        try {
            const stored = JSON.parse(localStorage.getItem('gentech-analytics') || '[]');
            stored.push({ ...data, analyticsType: type });
            
            // Keep only last 1000 events
            if (stored.length > 1000) {
                stored.splice(0, stored.length - 1000);
            }
            
            localStorage.setItem('gentech-analytics', JSON.stringify(stored));
        } catch (error) {
            console.warn('Failed to store analytics:', error);
        }
    }

    getCurrentSection(element) {
        const section = element.closest('section');
        return section?.id || section?.className.split(' ')[0] || 'unknown';
    }

    getCurrentVisibleSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                return section.id;
            }
        }
        
        return 'unknown';
    }

    // Public API methods
    getAnalyticsData() {
        return {
            events: this.events,
            conversions: this.conversions,
            leadData: this.leadData,
            socialProof: this.socialProofData,
            session: {
                id: this.sessionId,
                duration: Date.now() - this.pageStartTime,
                maxScrollDepth: this.maxScrollDepth,
                eventCount: this.events.length,
                conversionCount: this.conversions.length
            }
        };
    }

    getLeadScore() {
        return this.leadData.leadScore || 0;
    }

    exportAnalytics() {
        const data = this.getAnalyticsData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `gentech-analytics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Initialize analytics
const analytics = new AnalyticsManager();

// Export for global access
window.analytics = analytics;

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
    
    .animate-scale-in {
        animation: scaleIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .social-proof-widget {
        transition: all 0.3s ease;
    }
    
    .social-proof-widget:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    .language-loading {
        cursor: wait;
    }
    
    .language-loading * {
        pointer-events: none;
    }
`;
document.head.appendChild(style);

console.log('📊 Analytics & Conversion system loaded');
