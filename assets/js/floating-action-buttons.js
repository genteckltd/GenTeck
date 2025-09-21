/**
 * GenTech ISP Floating Action Buttons System
 * Clean floating buttons that expand into widgets on click
 */

class FloatingActionButtons {
    constructor() {
        this.buttons = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.createFloatingContainer();
        this.setupButtons();
        this.isInitialized = true;
        
        console.log('✅ Floating Action Buttons initialized');
    }

    createFloatingContainer() {
        // Create container for floating buttons
        this.container = document.createElement('div');
        this.container.id = 'floatingButtonsContainer';
        this.container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-3';
        document.body.appendChild(this.container);
    }

    setupButtons() {
        // Currency Converter Button
        this.addButton({
            id: 'currencyButton',
            icon: '💱',
            title: 'Currency Converter',
            color: 'bg-green-600',
            delay: 3000,
            onClick: () => this.toggleCurrencyConverter()
        });

        // Analytics/Help Button
        this.addButton({
            id: 'helpButton',
            icon: '❓',
            title: 'Help & Support',
            color: 'bg-blue-600',
            delay: 5000,
            onClick: () => this.toggleHelpWidget()
        });

        // Coverage Map Button
        this.addButton({
            id: 'mapButton',
            icon: '🗺️',
            title: 'Coverage Map',
            color: 'bg-purple-600',
            delay: 7000,
            onClick: () => this.toggleCoverageMap()
        });

        // Contact Button
        this.addButton({
            id: 'contactButton',
            icon: '📞',
            title: 'Quick Contact',
            color: 'bg-orange-600',
            delay: 9000,
            onClick: () => this.toggleContactForm()
        });
    }

    addButton({ id, icon, title, color, delay, onClick }) {
        const button = document.createElement('button');
        button.id = id;
        button.className = `floating-action-btn ${color} hover:scale-110 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl shadow-lg transition-all duration-300 transform translate-y-20 opacity-0`;
        button.innerHTML = icon;
        button.title = title;
        button.style.fontSize = '24px';
        
        // Add click handler
        button.addEventListener('click', onClick);
        
        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        this.container.appendChild(button);
        this.buttons.push({ element: button, id });

        // Show with delay
        setTimeout(() => {
            button.style.transform = 'translateY(0)';
            button.style.opacity = '1';
        }, delay);
    }

    toggleCurrencyConverter() {
        const existingWidget = document.getElementById('currencyExpandedWidget');
        
        if (existingWidget) {
            this.closeCurrencyConverter();
        } else {
            this.openCurrencyConverter();
        }
    }

    openCurrencyConverter() {
        const widget = document.createElement('div');
        widget.id = 'currencyExpandedWidget';
        widget.className = 'fixed bottom-20 right-4 z-40 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg p-4 max-w-sm shadow-xl transition-all duration-300 transform scale-0';
        
        widget.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-white font-semibold flex items-center text-sm">
                    <i class="fas fa-money-bill-wave mr-2 text-green-400"></i>
                    Currency Converter
                </h3>
                <button id="closeCurrency" class="text-gray-400 hover:text-white text-sm">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label class="block text-xs text-gray-400 mb-1">Amount</label>
                    <input type="number" id="currencyAmount" value="2500" 
                           class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
                </div>
                <div>
                    <label class="block text-xs text-gray-400 mb-1">From</label>
                    <select id="currencyFrom" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
                        <option value="KSH">KSh (KES)</option>
                        <option value="USD">$ (USD)</option>
                        <option value="EUR">€ (EUR)</option>
                        <option value="GBP">£ (GBP)</option>
                        <option value="CAD">C$ (CAD)</option>
                        <option value="AUD">A$ (AUD)</option>
                        <option value="JPY">¥ (JPY)</option>
                        <option value="CHF">CHF</option>
                        <option value="CNY">¥ (CNY)</option>
                        <option value="INR">₹ (INR)</option>
                    </select>
                </div>
            </div>
            
            <div class="text-center mb-3">
                <button id="currencySwap" class="text-blue-400 hover:text-blue-300 transition-colors">
                    <i class="fas fa-exchange-alt"></i>
                </button>
            </div>
            
            <div class="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label class="block text-xs text-gray-400 mb-1">To</label>
                    <select id="currencyTo" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
                        <option value="USD">$ (USD)</option>
                        <option value="EUR">€ (EUR)</option>
                        <option value="GBP">£ (GBP)</option>
                        <option value="KSH">KSh (KES)</option>
                        <option value="CAD">C$ (CAD)</option>
                        <option value="AUD">A$ (AUD)</option>
                        <option value="JPY">¥ (JPY)</option>
                        <option value="CHF">CHF</option>
                        <option value="CNY">¥ (CNY)</option>
                        <option value="INR">₹ (INR)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs text-gray-400 mb-1">Result</label>
                    <div id="convertedAmount" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-green-400 text-sm font-mono">
                        $16.75
                    </div>
                </div>
            </div>
            
            <div class="flex items-center justify-between text-xs mb-3">
                <span id="exchangeRate" class="text-gray-400">1 KSH = 0.0067 USD</span>
                <button id="refreshRates" class="text-blue-400 hover:text-blue-300 flex items-center">
                    <i class="fas fa-sync-alt mr-1"></i>
                    Refresh
                </button>
            </div>
            
            <div class="p-2 bg-blue-900/30 rounded border border-blue-700/50">
                <p class="text-xs text-blue-300">
                    <i class="fas fa-info-circle mr-1"></i>
                    Live currency conversion for international visitors
                </p>
            </div>
        `;

        document.body.appendChild(widget);
        
        // Add event listeners
        document.getElementById('closeCurrency').addEventListener('click', () => this.closeCurrencyConverter());
        document.getElementById('currencyAmount').addEventListener('input', this.updateCurrencyConversion);
        document.getElementById('currencyFrom').addEventListener('change', this.updateCurrencyConversion);
        document.getElementById('currencyTo').addEventListener('change', this.updateCurrencyConversion);
        document.getElementById('currencySwap').addEventListener('click', this.swapCurrencies);
        
        // Show with animation
        setTimeout(() => {
            widget.style.transform = 'scale(1)';
        }, 50);
        
        // Initial conversion
        this.updateCurrencyConversion();
    }

    closeCurrencyConverter() {
        const widget = document.getElementById('currencyExpandedWidget');
        if (widget) {
            widget.style.transform = 'scale(0)';
            setTimeout(() => {
                widget.remove();
            }, 300);
        }
    }

    updateCurrencyConversion() {
        // Simple conversion logic - in production, use real exchange rates
        const amount = parseFloat(document.getElementById('currencyAmount')?.value || 0);
        const from = document.getElementById('currencyFrom')?.value || 'KSH';
        const to = document.getElementById('currencyTo')?.value || 'USD';
        
        const rates = {
            KSH: { USD: 0.0067, EUR: 0.0061, GBP: 0.0053 },
            USD: { KSH: 149.25, EUR: 0.91, GBP: 0.79 },
            EUR: { KSH: 163.93, USD: 1.10, GBP: 0.87 },
            GBP: { KSH: 188.68, USD: 1.26, EUR: 1.15 }
        };
        
        const rate = rates[from]?.[to] || 1;
        const converted = amount * rate;
        
        const resultElement = document.getElementById('convertedAmount');
        if (resultElement) {
            resultElement.textContent = this.formatCurrency(converted, to);
        }
        
        const rateElement = document.getElementById('exchangeRate');
        if (rateElement) {
            rateElement.textContent = `1 ${from} = ${rate} ${to}`;
        }
    }

    formatCurrency(amount, currency) {
        const symbols = { USD: '$', EUR: '€', GBP: '£', KSH: 'KSh' };
        const symbol = symbols[currency] || currency;
        return `${symbol}${amount.toFixed(2)}`;
    }

    swapCurrencies() {
        const fromSelect = document.getElementById('currencyFrom');
        const toSelect = document.getElementById('currencyTo');
        
        if (fromSelect && toSelect) {
            const temp = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = temp;
            this.updateCurrencyConversion();
        }
    }

    toggleHelpWidget() {
        const existingWidget = document.getElementById('helpExpandedWidget');
        
        if (existingWidget) {
            this.closeHelpWidget();
        } else {
            this.openHelpWidget();
        }
    }

    openHelpWidget() {
        const widget = document.createElement('div');
        widget.id = 'helpExpandedWidget';
        widget.className = 'fixed bottom-20 right-4 z-40 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg p-4 max-w-sm shadow-xl transition-all duration-300 transform scale-0';
        
        widget.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-white font-semibold flex items-center text-sm">
                    <i class="fas fa-question-circle mr-2 text-blue-400"></i>
                    Quick Help
                </h3>
                <button id="closeHelp" class="text-gray-400 hover:text-white text-sm">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-3">
                <a href="#pricing" class="block p-2 bg-gray-700/50 rounded hover:bg-gray-700 transition-colors">
                    <div class="text-white text-sm font-medium">📋 View Pricing Plans</div>
                    <div class="text-gray-400 text-xs">Compare all available packages</div>
                </a>
                
                <a href="#coverage" class="block p-2 bg-gray-700/50 rounded hover:bg-gray-700 transition-colors">
                    <div class="text-white text-sm font-medium">🗺️ Coverage Areas</div>
                    <div class="text-gray-400 text-xs">Check service availability in your area</div>
                </a>
                
                <a href="#contact" class="block p-2 bg-gray-700/50 rounded hover:bg-gray-700 transition-colors">
                    <div class="text-white text-sm font-medium">📞 Contact Support</div>
                    <div class="text-gray-400 text-xs">Get help from our support team</div>
                </a>
                
                <button class="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                    <div class="text-white text-sm font-medium">🚀 Get Started</div>
                    <div class="text-blue-100 text-xs">Choose your perfect plan</div>
                </button>
            </div>
        `;

        document.body.appendChild(widget);
        
        // Add event listeners
        document.getElementById('closeHelp').addEventListener('click', () => this.closeHelpWidget());
        
        // Show with animation
        setTimeout(() => {
            widget.style.transform = 'scale(1)';
        }, 50);
    }

    closeHelpWidget() {
        const widget = document.getElementById('helpExpandedWidget');
        if (widget) {
            widget.style.transform = 'scale(0)';
            setTimeout(() => {
                widget.remove();
            }, 300);
        }
    }

    toggleCoverageMap() {
        const existingWidget = document.getElementById('mapExpandedWidget');
        
        if (existingWidget) {
            this.closeCoverageMap();
        } else {
            this.openCoverageMap();
        }
    }

    openCoverageMap() {
        const widget = document.createElement('div');
        widget.id = 'mapExpandedWidget';
        widget.className = 'fixed bottom-20 right-4 z-40 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg p-4 max-w-xs shadow-xl transition-all duration-300 transform scale-0';
        
        widget.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-white font-semibold flex items-center text-sm">
                    <i class="fas fa-map mr-2 text-purple-400"></i>
                    Coverage Areas
                </h3>
                <button id="closeMap" class="text-gray-400 hover:text-white text-sm">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between p-2 bg-green-900/30 rounded border border-green-700/50">
                    <span class="text-green-300">✅ Kakamega County</span>
                    <span class="text-xs text-green-400">Full Service</span>
                </div>
                
                <div class="flex items-center justify-between p-2 bg-blue-900/30 rounded border border-blue-700/50">
                    <span class="text-blue-300">🌐 Bungoma</span>
                    <span class="text-xs text-blue-400">Fiber + 5G</span>
                </div>
                
                <div class="flex items-center justify-between p-2 bg-blue-900/30 rounded border border-blue-700/50">
                    <span class="text-blue-300">📡 Busia</span>
                    <span class="text-xs text-blue-400">Satellite</span>
                </div>
                
                <div class="flex items-center justify-between p-2 bg-blue-900/30 rounded border border-blue-700/50">
                    <span class="text-blue-300">📶 Trans Nzoia</span>
                    <span class="text-xs text-blue-400">Wireless</span>
                </div>
                
                <div class="flex items-center justify-between p-2 bg-blue-900/30 rounded border border-blue-700/50">
                    <span class="text-blue-300">🏙️ Kisumu</span>
                    <span class="text-xs text-blue-400">Fiber</span>
                </div>
            </div>
            
            <button class="w-full mt-3 p-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors text-white text-sm">
                View Full Coverage Map
            </button>
        `;

        document.body.appendChild(widget);
        
        // Add event listeners
        document.getElementById('closeMap').addEventListener('click', () => this.closeCoverageMap());
        
        // Show with animation
        setTimeout(() => {
            widget.style.transform = 'scale(1)';
        }, 50);
    }

    closeCoverageMap() {
        const widget = document.getElementById('mapExpandedWidget');
        if (widget) {
            widget.style.transform = 'scale(0)';
            setTimeout(() => {
                widget.remove();
            }, 300);
        }
    }

    toggleContactForm() {
        const existingWidget = document.getElementById('contactExpandedWidget');
        
        if (existingWidget) {
            this.closeContactForm();
        } else {
            this.openContactForm();
        }
    }

    openContactForm() {
        const widget = document.createElement('div');
        widget.id = 'contactExpandedWidget';
        widget.className = 'fixed bottom-20 right-4 z-40 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg p-4 max-w-sm shadow-xl transition-all duration-300 transform scale-0';
        
        widget.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-white font-semibold flex items-center text-sm">
                    <i class="fas fa-phone mr-2 text-orange-400"></i>
                    Quick Contact
                </h3>
                <button id="closeContact" class="text-gray-400 hover:text-white text-sm">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-3">
                <a href="tel:+254700123456" class="flex items-center p-2 bg-green-900/30 rounded border border-green-700/50 hover:bg-green-900/50 transition-colors">
                    <i class="fas fa-phone text-green-400 mr-3"></i>
                    <div>
                        <div class="text-white text-sm font-medium">Call Us Now</div>
                        <div class="text-green-300 text-xs">+254 700 123 456</div>
                    </div>
                </a>
                
                <a href="https://wa.me/254700123456" class="flex items-center p-2 bg-green-900/30 rounded border border-green-700/50 hover:bg-green-900/50 transition-colors">
                    <i class="fab fa-whatsapp text-green-400 mr-3"></i>
                    <div>
                        <div class="text-white text-sm font-medium">WhatsApp</div>
                        <div class="text-green-300 text-xs">Chat with support</div>
                    </div>
                </a>
                
                <a href="mailto:support@gentech.co.ke" class="flex items-center p-2 bg-blue-900/30 rounded border border-blue-700/50 hover:bg-blue-900/50 transition-colors">
                    <i class="fas fa-envelope text-blue-400 mr-3"></i>
                    <div>
                        <div class="text-white text-sm font-medium">Email Support</div>
                        <div class="text-blue-300 text-xs">support@gentech.co.ke</div>
                    </div>
                </a>
                
                <div class="text-center pt-2 border-t border-gray-700">
                    <div class="text-gray-400 text-xs">24/7 Emergency Support</div>
                    <div class="text-orange-300 text-sm font-medium">+254 700 EMERGENCY</div>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
        
        // Add event listeners
        document.getElementById('closeContact').addEventListener('click', () => this.closeContactForm());
        
        // Show with animation
        setTimeout(() => {
            widget.style.transform = 'scale(1)';
        }, 50);
    }

    closeContactForm() {
        const widget = document.getElementById('contactExpandedWidget');
        if (widget) {
            widget.style.transform = 'scale(0)';
            setTimeout(() => {
                widget.remove();
            }, 300);
        }
    }

    // Close all open widgets
    closeAllWidgets() {
        this.closeCurrencyConverter();
        this.closeHelpWidget();
        this.closeCoverageMap();
        this.closeContactForm();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only create if not already created
    if (!window.floatingActionButtons) {
        window.floatingActionButtons = new FloatingActionButtons();
    }
});

// Export for other modules
window.FloatingActionButtons = FloatingActionButtons;
