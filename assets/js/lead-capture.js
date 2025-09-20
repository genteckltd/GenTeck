/**
 * GenTech ISP Progressive Lead Capture Forms
 * Smart forms that adapt based on user behavior and progressive profiling
 */

class ProgressiveLeadCapture {
    constructor() {
        this.leadProfile = JSON.parse(localStorage.getItem('gentech-lead-profile') || '{}');
        this.currentStep = 1;
        this.maxSteps = 3;
        this.formHistory = [];
        this.triggers = [];
        this.activeForms = new Set();
        
        this.init();
    }

    async init() {
        try {
            // Setup form triggers
            this.setupTriggers();
            
            // Setup smart forms
            this.enhanceExistingForms();
            
            // Setup progressive profiling
            this.setupProgressiveProfiling();
            
            // Setup lead scoring
            this.setupLeadScoring();
            
            console.log('📝 Progressive lead capture initialized');
        } catch (error) {
            console.error('❌ Progressive lead capture initialization failed:', error);
        }
    }

    setupTriggers() {
        this.triggers = [
            {
                id: 'time_on_page',
                condition: () => Date.now() - window.analytics?.pageStartTime > 30000, // 30 seconds
                priority: 1,
                form: 'quick_interest',
                triggered: false
            },
            {
                id: 'scroll_depth',
                condition: () => window.analytics?.maxScrollDepth > 60,
                priority: 2,
                form: 'engagement_capture',
                triggered: false
            },
            {
                id: 'plan_interaction',
                condition: () => this.hasInteractedWithPlans(),
                priority: 3,
                form: 'plan_specific',
                triggered: false
            },
            {
                id: 'exit_intent',
                condition: () => window.analytics?.exitIntentTriggered,
                priority: 4,
                form: 'retention_offer',
                triggered: false
            },
            {
                id: 'repeat_visitor',
                condition: () => this.isRepeatVisitor(),
                priority: 5,
                form: 'returning_visitor',
                triggered: false
            }
        ];

        // Check triggers periodically
        setInterval(() => {
            this.checkTriggers();
        }, 5000);
    }

    checkTriggers() {
        if (this.activeForms.size > 0) return; // Don't show multiple forms

        const eligibleTriggers = this.triggers
            .filter(trigger => !trigger.triggered && trigger.condition())
            .sort((a, b) => b.priority - a.priority);

        if (eligibleTriggers.length > 0) {
            const trigger = eligibleTriggers[0];
            trigger.triggered = true;
            this.showProgressiveForm(trigger.form, trigger.id);
        }
    }

    hasInteractedWithPlans() {
        return window.analytics?.events.some(event => 
            event.type === 'click' && 
            (event.data.section === 'plans' || event.data.action === 'plan_selection')
        ) || false;
    }

    isRepeatVisitor() {
        const visitCount = parseInt(localStorage.getItem('gentech-visit-count') || '0');
        return visitCount > 1;
    }

    showProgressiveForm(formType, triggerId) {
        if (this.activeForms.has(formType)) return;

        const formConfig = this.getFormConfig(formType);
        const form = this.createProgressiveForm(formConfig, triggerId);
        
        document.body.appendChild(form);
        this.activeForms.add(formType);
        
        // Track form shown
        if (window.analytics) {
            window.analytics.trackEvent('lead_form_shown', {
                formType,
                triggerId,
                leadScore: this.calculateLeadScore()
            });
        }
        
        // Show with animation
        setTimeout(() => {
            form.classList.add('opacity-100');
            form.classList.remove('opacity-0');
        }, 100);
    }

    getFormConfig(formType) {
        const configs = {
            quick_interest: {
                title: '🚀 Quick Question',
                subtitle: 'Help us understand your internet needs',
                fields: [
                    {
                        type: 'select',
                        name: 'interest_type',
                        label: 'What brings you here today?',
                        options: [
                            { value: 'home', label: 'Home Internet' },
                            { value: 'business', label: 'Business Solutions' },
                            { value: 'upgrade', label: 'Upgrade Current Plan' },
                            { value: 'compare', label: 'Compare Providers' },
                            { value: 'info', label: 'Just Looking Around' }
                        ],
                        required: true
                    }
                ],
                cta: 'Continue',
                nextStep: 'contact_basic'
            },
            
            engagement_capture: {
                title: '💡 Interested in Our Services?',
                subtitle: 'Get personalized recommendations',
                fields: [
                    {
                        type: 'select',
                        name: 'current_speed',
                        label: 'What\'s your current internet speed?',
                        options: [
                            { value: 'no_internet', label: 'No Internet Currently' },
                            { value: 'slow', label: 'Less than 10 Mbps' },
                            { value: 'medium', label: '10-50 Mbps' },
                            { value: 'fast', label: '50-100 Mbps' },
                            { value: 'very_fast', label: 'Over 100 Mbps' },
                            { value: 'unsure', label: 'Not Sure' }
                        ],
                        required: true
                    },
                    {
                        type: 'checkbox',
                        name: 'usage_needs',
                        label: 'How do you primarily use the internet?',
                        options: [
                            { value: 'browsing', label: 'Web Browsing & Email' },
                            { value: 'streaming', label: 'Video Streaming' },
                            { value: 'gaming', label: 'Online Gaming' },
                            { value: 'work', label: 'Work from Home' },
                            { value: 'business', label: 'Business Operations' },
                            { value: 'education', label: 'Online Learning' }
                        ]
                    }
                ],
                cta: 'Get Recommendations',
                nextStep: 'contact_basic'
            },
            
            plan_specific: {
                title: '📋 Interested in This Plan?',
                subtitle: 'Let\'s get you connected!',
                fields: [
                    {
                        type: 'email',
                        name: 'email',
                        label: 'Email Address',
                        placeholder: 'your@email.com',
                        required: true
                    },
                    {
                        type: 'tel',
                        name: 'phone',
                        label: 'Phone Number',
                        placeholder: '+254 700 000 000',
                        required: true
                    },
                    {
                        type: 'select',
                        name: 'installation_timeline',
                        label: 'When would you like installation?',
                        options: [
                            { value: 'asap', label: 'As Soon As Possible' },
                            { value: 'week', label: 'Within a Week' },
                            { value: 'month', label: 'Within a Month' },
                            { value: 'flexible', label: 'I\'m Flexible' }
                        ],
                        required: true
                    }
                ],
                cta: 'Request Quote',
                nextStep: 'installation_details'
            },
            
            contact_basic: {
                title: '📞 Stay Connected',
                subtitle: 'Get updates and special offers',
                fields: [
                    {
                        type: 'text',
                        name: 'name',
                        label: 'Full Name',
                        placeholder: 'John Doe',
                        required: true
                    },
                    {
                        type: 'email',
                        name: 'email',
                        label: 'Email Address',
                        placeholder: 'your@email.com',
                        required: true
                    },
                    {
                        type: 'tel',
                        name: 'phone',
                        label: 'Phone Number (Optional)',
                        placeholder: '+254 700 000 000'
                    }
                ],
                cta: 'Get Updates',
                benefits: [
                    'Exclusive promotions and discounts',
                    'Service updates and maintenance notifications',
                    'Priority customer support'
                ]
            },
            
            installation_details: {
                title: '🏠 Installation Details',
                subtitle: 'Help us prepare for your installation',
                fields: [
                    {
                        type: 'text',
                        name: 'address',
                        label: 'Installation Address',
                        placeholder: 'Street address, town',
                        required: true
                    },
                    {
                        type: 'select',
                        name: 'property_type',
                        label: 'Property Type',
                        options: [
                            { value: 'apartment', label: 'Apartment' },
                            { value: 'house', label: 'House' },
                            { value: 'office', label: 'Office' },
                            { value: 'shop', label: 'Shop/Business' },
                            { value: 'other', label: 'Other' }
                        ],
                        required: true
                    },
                    {
                        type: 'textarea',
                        name: 'special_requirements',
                        label: 'Special Requirements (Optional)',
                        placeholder: 'Any specific installation needs or access requirements...'
                    }
                ],
                cta: 'Schedule Installation'
            }
        };

        return configs[formType] || configs.quick_interest;
    }

    createProgressiveForm(config, triggerId) {
        const form = document.createElement('div');
        form.className = 'progressive-form fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300';
        form.dataset.formType = config.title;
        
        form.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-md mx-4 transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                <div class="relative p-6">
                    <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10" onclick="this.closest('.progressive-form').remove(); window.leadCapture?.activeForms?.delete('${config.title}')">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                    
                    <div class="text-center mb-6">
                        <div class="text-2xl mb-2">${config.title}</div>
                        <p class="text-gray-600">${config.subtitle}</p>
                        
                        ${config.benefits ? `
                            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div class="text-sm font-medium text-blue-800 mb-2">You'll get:</div>
                                <ul class="text-xs text-blue-700 space-y-1">
                                    ${config.benefits.map(benefit => `<li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>${benefit}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                    
                    <form class="progressive-form-content space-y-4" data-trigger="${triggerId}">
                        ${this.renderFormFields(config.fields)}
                        
                        <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200">
                            <i class="fas fa-arrow-right mr-2"></i>
                            ${config.cta}
                        </button>
                    </form>
                    
                    <div class="mt-4 text-center">
                        <div class="text-xs text-gray-500">
                            <i class="fas fa-shield-alt mr-1"></i>
                            Your information is secure and will not be shared
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Attach form handler
        const formElement = form.querySelector('form');
        formElement.addEventListener('submit', (e) => this.handleFormSubmission(e, config, triggerId));

        return form;
    }

    renderFormFields(fields) {
        return fields.map(field => {
            switch (field.type) {
                case 'select':
                    return `
                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>
                            <select name="${field.name}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" ${field.required ? 'required' : ''}>
                                <option value="">Choose an option...</option>
                                ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                            </select>
                        </div>
                    `;
                
                case 'checkbox':
                    return `
                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">${field.label}</label>
                            <div class="space-y-2 max-h-32 overflow-y-auto">
                                ${field.options.map(opt => `
                                    <label class="flex items-center text-sm">
                                        <input type="checkbox" name="${field.name}" value="${opt.value}" class="mr-2 rounded border-gray-300 focus:ring-blue-500">
                                        ${opt.label}
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `;
                
                case 'textarea':
                    return `
                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>
                            <textarea name="${field.name}" rows="3" placeholder="${field.placeholder || ''}" 
                                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                                      ${field.required ? 'required' : ''}></textarea>
                        </div>
                    `;
                
                default: // text, email, tel, etc.
                    return `
                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>
                            <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder || ''}" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                   ${field.required ? 'required' : ''}
                                   ${this.getFieldValue(field.name) ? `value="${this.getFieldValue(field.name)}"` : ''}>
                        </div>
                    `;
            }
        }).join('');
    }

    getFieldValue(fieldName) {
        return this.leadProfile[fieldName] || '';
    }

    handleFormSubmission(e, config, triggerId) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {};
        
        // Handle regular fields
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        // Handle checkboxes that might have multiple values
        const checkboxes = e.target.querySelectorAll('input[type="checkbox"]:checked');
        const checkboxGroups = {};
        checkboxes.forEach(cb => {
            if (!checkboxGroups[cb.name]) {
                checkboxGroups[cb.name] = [];
            }
            checkboxGroups[cb.name].push(cb.value);
        });
        
        Object.assign(data, checkboxGroups);
        
        // Update lead profile
        this.updateLeadProfile(data);
        
        // Track conversion
        if (window.analytics) {
            window.analytics.trackConversion('lead_form_submit', {
                formType: config.title,
                triggerId,
                leadScore: this.calculateLeadScore(),
                fields: Object.keys(data)
            });
        }
        
        // Show success and potentially next step
        this.showFormSuccess(e.target.closest('.progressive-form'), config, data);
    }

    updateLeadProfile(newData) {
        Object.assign(this.leadProfile, newData);
        this.leadProfile.lastUpdate = Date.now();
        this.leadProfile.leadScore = this.calculateLeadScore();
        
        localStorage.setItem('gentech-lead-profile', JSON.stringify(this.leadProfile));
        
        // Update global analytics if available
        if (window.analytics && typeof window.analytics.updateLeadProfile === 'function') {
            window.analytics.updateLeadProfile(newData);
        }
    }

    calculateLeadScore() {
        let score = 0;
        
        // Basic contact information
        if (this.leadProfile.name) score += 15;
        if (this.leadProfile.email) score += 20;
        if (this.leadProfile.phone) score += 20;
        if (this.leadProfile.address) score += 15;
        
        // Interest indicators
        if (this.leadProfile.interest_type) score += 10;
        if (this.leadProfile.current_speed) score += 8;
        if (this.leadProfile.usage_needs) score += 12;
        if (this.leadProfile.installation_timeline) score += 15;
        
        // Engagement signals
        const sessionTime = window.analytics ? Date.now() - window.analytics.pageStartTime : 0;
        score += Math.min(sessionTime / 60000 * 2, 10); // 2 points per minute, max 10
        
        const scrollDepth = window.analytics ? window.analytics.maxScrollDepth : 0;
        score += Math.min(scrollDepth / 10, 10); // 1 point per 10% scroll, max 10
        
        return Math.round(score);
    }

    showFormSuccess(formElement, config, submittedData) {
        const successContent = `
            <div class="text-center p-6">
                <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-check text-white text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p class="text-gray-600 mb-4">
                    ${this.getSuccessMessage(config, submittedData)}
                </p>
                
                ${this.shouldShowNextStep(config) ? `
                    <button onclick="window.leadCapture.showNextStep('${config.nextStep}')" 
                            class="bg-blue-600 text-white px-6 py-2 rounded-lg mr-3 hover:bg-blue-700">
                        Continue
                    </button>
                ` : ''}
                
                <button onclick="this.closest('.progressive-form').remove(); window.leadCapture?.activeForms?.delete('${config.title}')" 
                        class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                    Close
                </button>
                
                ${this.getRecommendations(submittedData)}
            </div>
        `;
        
        formElement.innerHTML = successContent;
        
        // Auto-close after delay
        setTimeout(() => {
            if (formElement.parentElement) {
                formElement.remove();
                this.activeForms.delete(config.title);
            }
        }, 8000);
    }

    getSuccessMessage(config, data) {
        if (data.email) {
            return `We've received your information and will send personalized recommendations to ${data.email} shortly.`;
        }
        
        return 'Your information has been received. Our team will get back to you soon with personalized recommendations.';
    }

    shouldShowNextStep(config) {
        return config.nextStep && !this.leadProfile[config.nextStep + '_completed'];
    }

    showNextStep(stepType) {
        // Mark current step as completed
        this.leadProfile[stepType + '_completed'] = true;
        this.updateLeadProfile({});
        
        // Close current form
        const currentForm = document.querySelector('.progressive-form');
        if (currentForm) {
            currentForm.remove();
        }
        
        // Show next step
        setTimeout(() => {
            this.showProgressiveForm(stepType, 'progressive_flow');
        }, 500);
    }

    getRecommendations(data) {
        if (!data.interest_type && !data.current_speed) return '';
        
        let recommendations = '<div class="mt-4 p-3 bg-blue-50 rounded-lg text-left"><div class="text-sm font-medium text-blue-800 mb-2">Recommended for you:</div>';
        
        if (data.interest_type === 'home') {
            recommendations += '<div class="text-xs text-blue-700">✓ Home Premium Plan - Perfect for households</div>';
        } else if (data.interest_type === 'business') {
            recommendations += '<div class="text-xs text-blue-700">✓ Business Pro Plan - Reliable for operations</div>';
        }
        
        if (data.current_speed === 'slow' || data.current_speed === 'no_internet') {
            recommendations += '<div class="text-xs text-blue-700">✓ Free speed upgrade available</div>';
        }
        
        recommendations += '</div>';
        return recommendations;
    }

    enhanceExistingForms() {
        // Find existing forms and enhance them
        const existingForms = document.querySelectorAll('form[id*="contact"], form[id*="inquiry"]');
        
        existingForms.forEach(form => {
            this.enhanceForm(form);
        });
    }

    enhanceForm(form) {
        // Add progressive enhancement to existing forms
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Pre-fill with known data
            if (this.leadProfile[input.name]) {
                input.value = this.leadProfile[input.name];
            }
            
            // Add smart validation
            input.addEventListener('blur', () => {
                this.smartValidation(input);
            });
            
            // Track field interactions
            input.addEventListener('focus', () => {
                if (window.analytics) {
                    window.analytics.trackEvent('form_field_focus', {
                        fieldName: input.name,
                        fieldType: input.type,
                        hasExistingData: !!this.leadProfile[input.name]
                    });
                }
            });
        });
        
        // Enhance form submission
        form.addEventListener('submit', (e) => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            this.updateLeadProfile(data);
        });
    }

    smartValidation(input) {
        // Remove existing validation messages
        const existingMessage = input.parentElement.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        let isValid = true;
        let message = '';
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }
        
        // Phone validation (Kenyan format)
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^(\+254|254|0)[17]\d{8}$/;
            if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
                isValid = false;
                message = 'Please enter a valid Kenyan phone number';
            }
        }
        
        // Show validation message
        if (!isValid) {
            const messageElement = document.createElement('div');
            messageElement.className = 'validation-message text-xs text-red-600 mt-1';
            messageElement.textContent = message;
            input.parentElement.appendChild(messageElement);
            
            input.classList.add('border-red-500');
        } else {
            input.classList.remove('border-red-500');
            input.classList.add('border-green-500');
        }
        
        return isValid;
    }

    setupProgressiveProfiling() {
        // Track user behavior to build profile
        document.addEventListener('click', (e) => {
            const planElement = e.target.closest('[data-plan]');
            if (planElement) {
                this.leadProfile.planInterest = planElement.dataset.plan;
                this.leadProfile.lastPlanView = Date.now();
                this.updateLeadProfile({});
            }
        });
        
        // Track page engagement
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - (window.analytics?.pageStartTime || Date.now());
            this.leadProfile.totalTimeOnSite = (this.leadProfile.totalTimeOnSite || 0) + timeOnPage;
            this.leadProfile.visitCount = (this.leadProfile.visitCount || 0) + 1;
            this.updateLeadProfile({});
        });
    }

    setupLeadScoring() {
        // Update lead score periodically
        setInterval(() => {
            const newScore = this.calculateLeadScore();
            if (newScore !== this.leadProfile.leadScore) {
                this.leadProfile.leadScore = newScore;
                this.updateLeadProfile({});
                
                // Trigger high-value lead actions
                if (newScore > 75 && !this.leadProfile.highValueTriggered) {
                    this.triggerHighValueLeadAction();
                    this.leadProfile.highValueTriggered = true;
                }
            }
        }, 30000); // Check every 30 seconds
    }

    triggerHighValueLeadAction() {
        // Show special offer for high-value leads
        if (this.activeForms.size === 0) {
            this.showSpecialOfferForm();
        }
    }

    showSpecialOfferForm() {
        const specialConfig = {
            title: '🎉 Exclusive Offer',
            subtitle: 'You qualify for our premium customer benefits!',
            fields: [
                {
                    type: 'text',
                    name: 'preferred_contact_time',
                    label: 'Best time to reach you',
                    placeholder: 'e.g., Mornings, Afternoons, Evenings'
                }
            ],
            cta: 'Claim Benefits',
            benefits: [
                'Priority installation scheduling',
                '50% off first month',
                'Free premium router upgrade',
                'Dedicated customer success manager'
            ]
        };
        
        this.showProgressiveForm('special_offer', 'high_value_lead');
    }

    // Public API methods
    getLeadProfile() {
        return { ...this.leadProfile };
    }

    getLeadScore() {
        return this.leadProfile.leadScore || 0;
    }

    updateProfile(data) {
        this.updateLeadProfile(data);
    }

    showForm(formType) {
        this.showProgressiveForm(formType, 'manual_trigger');
    }

    exportLeadData() {
        const data = {
            profile: this.leadProfile,
            history: this.formHistory,
            score: this.calculateLeadScore(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `lead-profile-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Initialize progressive lead capture
const leadCapture = new ProgressiveLeadCapture();

// Export for global access
window.leadCapture = leadCapture;

console.log('📝 Progressive lead capture system loaded');
