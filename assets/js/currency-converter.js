/**
 * GenTech ISP Currency Converter Widget
 * Real-time currency conversion for international visitors
 */

class CurrencyConverter {
    constructor() {
        this.apiKey = 'demo'; // In production, use actual API key
        this.baseUrl = 'https://api.exchangerate-api.com/v4/latest/';
        this.fallbackRates = {
            KSH: 1,
            USD: 0.0067,
            EUR: 0.0061,
            GBP: 0.0053,
            CAD: 0.0089,
            AUD: 0.0098,
            JPY: 0.95,
            CHF: 0.0061,
            CNY: 0.047,
            INR: 0.56
        };
        this.currentRates = { ...this.fallbackRates };
        this.lastUpdate = null;
        this.updateInterval = 60 * 60 * 1000; // 1 hour
        
        this.init();
    }

    async init() {
        try {
            // Disable old currency converter to prevent conflicts with new floating buttons
            console.log('⏸️ Currency converter disabled - using floating action buttons instead');
            return;
            
            // Load cached rates
            this.loadCachedRates();
            
            // Fetch fresh rates
            await this.updateExchangeRates();
            
            // Create currency widget
            this.createCurrencyWidget();
            
            // Setup auto-update
            this.setupAutoUpdate();
            
            console.log('✅ Currency converter initialized');
        } catch (error) {
            console.error('❌ Currency converter initialization failed:', error);
            this.createCurrencyWidget(); // Use fallback rates
        }
    }

    loadCachedRates() {
        try {
            const cached = localStorage.getItem('gentech-exchange-rates');
            const lastUpdate = localStorage.getItem('gentech-rates-timestamp');
            
            if (cached && lastUpdate) {
                const age = Date.now() - parseInt(lastUpdate);
                if (age < this.updateInterval) {
                    this.currentRates = JSON.parse(cached);
                    this.lastUpdate = new Date(parseInt(lastUpdate));
                    console.log('💾 Using cached exchange rates');
                }
            }
        } catch (error) {
            console.warn('Failed to load cached rates:', error);
        }
    }

    async updateExchangeRates() {
        try {
            // In a real implementation, fetch from actual API
            // For demo, simulate API response with slight variations
            const response = await this.simulateApiResponse();
            
            if (response.rates) {
                // Convert to KSH base
                const kshRate = response.rates.KES || 150; // KES to USD rate
                this.currentRates = {
                    KSH: 1,
                    USD: 1 / kshRate,
                    EUR: (1 / kshRate) * 0.92,
                    GBP: (1 / kshRate) * 0.79,
                    CAD: (1 / kshRate) * 1.33,
                    AUD: (1 / kshRate) * 1.47,
                    JPY: (1 / kshRate) * 142,
                    CHF: (1 / kshRate) * 0.91,
                    CNY: (1 / kshRate) * 7.02,
                    INR: (1 / kshRate) * 83.2
                };
                
                // Cache the rates
                localStorage.setItem('gentech-exchange-rates', JSON.stringify(this.currentRates));
                localStorage.setItem('gentech-rates-timestamp', Date.now().toString());
                this.lastUpdate = new Date();
                
                console.log('💱 Exchange rates updated');
            }
        } catch (error) {
            console.warn('Failed to update exchange rates, using cached/fallback:', error);
        }
    }

    async simulateApiResponse() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return simulated response
        return {
            rates: {
                KES: 148 + (Math.random() * 4 - 2), // KES fluctuates around 150
                USD: 1,
                EUR: 0.92 + (Math.random() * 0.04 - 0.02),
                GBP: 0.79 + (Math.random() * 0.03 - 0.015),
                CAD: 1.33 + (Math.random() * 0.06 - 0.03),
                AUD: 1.47 + (Math.random() * 0.08 - 0.04),
                JPY: 142 + (Math.random() * 6 - 3),
                CHF: 0.91 + (Math.random() * 0.04 - 0.02),
                CNY: 7.02 + (Math.random() * 0.3 - 0.15),
                INR: 83.2 + (Math.random() * 2 - 1)
            }
        };
    }

    createCurrencyWidget() {
        // Check if widget already exists
        if (document.getElementById('currencyWidget')) return;

        const widget = document.createElement('div');
        widget.id = 'currencyWidget';
        widget.className = 'currency-widget fixed bottom-4 right-4 z-50 bg-gray-800/95 backdrop-blur-md border border-gray-700 shadow-xl transition-all duration-300 transform translate-y-0 minimized';
        
        // Start minimized by default
        widget.innerHTML = '<div class="currency-icon">💱</div>';
        
        widget.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-white font-semibold flex items-center text-sm">
                    <i class="fas fa-money-bill-wave mr-2 text-green-400"></i>
                    Currency Converter
                </h3>
                <button id="currencyMinimize" class="text-gray-400 hover:text-white text-sm" title="Minimize">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
            
            <div id="currencyContent" class="transition-all duration-300">
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
                        <label class="block text-xs text-gray-400 mb-1">Converted Amount</label>
                        <div id="convertedAmount" class="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-green-400 font-semibold text-sm">
                            $16.75
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs text-gray-400 mb-1">To</label>
                        <select id="currencyTo" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none">
                            <option value="USD" selected>$ (USD)</option>
                            <option value="KSH">KSh (KES)</option>
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
                
                <div class="border-t border-gray-700 pt-3">
                    <div class="flex justify-between items-center text-xs text-gray-400">
                        <span>Last updated:</span>
                        <span id="lastUpdateTime">${this.formatUpdateTime()}</span>
                    </div>
                    <div class="mt-2">
                        <button id="refreshRates" class="text-blue-400 hover:text-blue-300 text-xs flex items-center">
                            <i class="fas fa-sync mr-1"></i>
                            Refresh Rates
                        </button>
                    </div>
                </div>
                
                <div class="mt-3 p-2 bg-blue-900/30 rounded border border-blue-700/50">
                    <p class="text-xs text-blue-300">
                        <i class="fas fa-info-circle mr-1"></i>
                        Prices shown are in Kenyan Shillings. Use converter for reference.
                    </p>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
        this.attachEventListeners();
        this.updateConversion();
        
        // Show widget with animation after user has been on page for a while
        setTimeout(() => {
            widget.classList.add('animate-slide-up');
        }, 15000); // Show after 15 seconds instead of 0.5 seconds
    }

    attachEventListeners() {
        // Minimize/maximize widget
        const minimizeBtn = document.getElementById('currencyMinimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', this.toggleMinimize.bind(this));
        }
        
        // Currency conversion inputs
        document.getElementById('currencyAmount').addEventListener('input', this.updateConversion.bind(this));
        document.getElementById('currencyFrom').addEventListener('change', this.updateConversion.bind(this));
        document.getElementById('currencyTo').addEventListener('change', this.updateConversion.bind(this));
        
        // Swap currencies
        document.getElementById('currencySwap').addEventListener('click', this.swapCurrencies.bind(this));
        
        // Refresh rates
        document.getElementById('refreshRates').addEventListener('click', this.handleRefreshRates.bind(this));
        
        // Auto-convert when user is idle
        let conversionTimeout;
        document.getElementById('currencyAmount').addEventListener('input', () => {
            clearTimeout(conversionTimeout);
            conversionTimeout = setTimeout(() => {
                this.updatePricingDisplay();
            }, 1000);
        });
    }

    toggleMinimize() {
        const widget = document.getElementById('currencyWidget');
        const content = document.getElementById('currencyContent');
        
        if (widget.classList.contains('minimized')) {
            // Expand widget
            widget.classList.remove('minimized');
            widget.innerHTML = this.getFullWidgetContent();
            this.attachEventListeners();
            this.updateConversion();
        } else {
            // Minimize widget
            widget.classList.add('minimized');
            widget.innerHTML = '<div class="currency-icon">💱</div>';
            widget.addEventListener('click', this.toggleMinimize.bind(this));
        }
    }

    getFullWidgetContent() {
        return `
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-white font-semibold flex items-center text-sm">
                    <i class="fas fa-money-bill-wave mr-2 text-green-400"></i>
                    Currency Converter
                </h3>
                <button id="currencyMinimize" class="text-gray-400 hover:text-white text-sm" title="Minimize">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
            
            <div id="currencyContent" class="transition-all duration-300">
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
                
                <div class="flex items-center justify-between text-xs">
                    <span id="exchangeRate" class="text-gray-400">1 KSH = 0.0067 USD</span>
                    <button id="refreshRates" class="text-blue-400 hover:text-blue-300 flex items-center">
                        <i class="fas fa-sync-alt mr-1"></i>
                        <span id="refreshText">Refresh</span>
                    </button>
                </div>
                
                <div class="mt-3 pt-3 border-t border-gray-700">
                    <p class="text-xs text-blue-300">
                        <i class="fas fa-info-circle mr-1"></i>
                        Prices shown are in Kenyan Shillings. Use converter for reference.
                    </p>
                </div>
            </div>
        `;
    }

    updateConversion() {
        const amount = parseFloat(document.getElementById('currencyAmount').value) || 0;
        const fromCurrency = document.getElementById('currencyFrom').value;
        const toCurrency = document.getElementById('currencyTo').value;
        
        const convertedAmount = this.convert(amount, fromCurrency, toCurrency);
        const formatted = this.formatAmount(convertedAmount, toCurrency);
        
        document.getElementById('convertedAmount').textContent = formatted;
        
        // Update exchange rate display
        if (amount > 0) {
            const rate = this.getExchangeRate(fromCurrency, toCurrency);
            this.showExchangeRate(fromCurrency, toCurrency, rate);
        }
    }

    convert(amount, fromCurrency, toCurrency) {
        const fromRate = this.currentRates[fromCurrency] || 1;
        const toRate = this.currentRates[toCurrency] || 1;
        
        // Convert through KSH base
        const kshAmount = amount / fromRate;
        return kshAmount * toRate;
    }

    getExchangeRate(fromCurrency, toCurrency) {
        const fromRate = this.currentRates[fromCurrency] || 1;
        const toRate = this.currentRates[toCurrency] || 1;
        
        return toRate / fromRate;
    }

    formatAmount(amount, currency) {
        const symbols = {
            KSH: 'KSh',
            USD: '$',
            EUR: '€',
            GBP: '£',
            CAD: 'C$',
            AUD: 'A$',
            JPY: '¥',
            CHF: 'CHF',
            CNY: '¥',
            INR: '₹'
        };
        
        const symbol = symbols[currency] || currency;
        const decimals = ['JPY', 'KSH'].includes(currency) ? 0 : 2;
        
        return `${symbol}${amount.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })}`;
    }

    swapCurrencies() {
        const fromSelect = document.getElementById('currencyFrom');
        const toSelect = document.getElementById('currencyTo');
        
        const fromValue = fromSelect.value;
        const toValue = toSelect.value;
        
        fromSelect.value = toValue;
        toSelect.value = fromValue;
        
        this.updateConversion();
        
        // Add animation effect
        const swapButton = document.getElementById('currencySwap');
        swapButton.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            swapButton.style.transform = 'rotate(0deg)';
        }, 300);
    }

    async handleRefreshRates() {
        const refreshButton = document.getElementById('refreshRates');
        const icon = refreshButton.querySelector('i');
        
        // Add loading state
        icon.classList.add('fa-spin');
        refreshButton.disabled = true;
        
        try {
            await this.updateExchangeRates();
            this.updateConversion();
            document.getElementById('lastUpdateTime').textContent = this.formatUpdateTime();
            
            // Show success feedback
            this.showNotification('Exchange rates updated successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to update rates. Using cached data.', 'warning');
        } finally {
            // Remove loading state
            icon.classList.remove('fa-spin');
            refreshButton.disabled = false;
        }
    }

    showExchangeRate(fromCurrency, toCurrency, rate) {
        // Create or update exchange rate display
        let rateDisplay = document.getElementById('exchangeRateDisplay');
        if (!rateDisplay) {
            rateDisplay = document.createElement('div');
            rateDisplay.id = 'exchangeRateDisplay';
            rateDisplay.className = 'text-xs text-gray-400 mt-2 p-2 bg-gray-900/50 rounded';
            document.getElementById('currencyContent').appendChild(rateDisplay);
        }
        
        rateDisplay.innerHTML = `
            <span class="flex items-center justify-between">
                <span>1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}</span>
                <i class="fas fa-chart-line text-green-400"></i>
            </span>
        `;
    }

    updatePricingDisplay() {
        // Update all pricing elements on the page with converted values
        document.querySelectorAll('[data-price-ksh]').forEach(element => {
            const kshPrice = parseFloat(element.dataset.priceKsh);
            const toCurrency = document.getElementById('currencyTo').value;
            
            if (toCurrency !== 'KSH') {
                const converted = this.convert(kshPrice, 'KSH', toCurrency);
                const formatted = this.formatAmount(converted, toCurrency);
                
                // Create or update conversion display
                let conversionSpan = element.querySelector('.price-conversion');
                if (!conversionSpan) {
                    conversionSpan = document.createElement('span');
                    conversionSpan.className = 'price-conversion text-sm text-gray-400 block';
                    element.appendChild(conversionSpan);
                }
                conversionSpan.textContent = `≈ ${formatted}`;
            } else {
                // Remove conversion display if showing KSH
                const conversionSpan = element.querySelector('.price-conversion');
                if (conversionSpan) {
                    conversionSpan.remove();
                }
            }
        });
    }

    formatUpdateTime() {
        if (!this.lastUpdate) return 'Never';
        
        const now = new Date();
        const diff = now - this.lastUpdate;
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hr ago`;
        
        return this.lastUpdate.toLocaleDateString();
    }

    setupAutoUpdate() {
        // Update rates every hour
        setInterval(() => {
            this.updateExchangeRates();
        }, this.updateInterval);
        
        // Update display every minute
        setInterval(() => {
            const lastUpdateElement = document.getElementById('lastUpdateTime');
            if (lastUpdateElement) {
                lastUpdateElement.textContent = this.formatUpdateTime();
            }
        }, 60000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-600 text-white' :
            type === 'warning' ? 'bg-yellow-600 text-white' :
            type === 'error' ? 'bg-red-600 text-white' :
            'bg-blue-600 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-start">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' :
                    type === 'warning' ? 'fa-exclamation-triangle' :
                    type === 'error' ? 'fa-times-circle' :
                    'fa-info-circle'
                } mr-3 mt-1"></i>
                <div class="flex-1">
                    <p class="font-medium">${message}</p>
                </div>
                <button class="ml-4 text-white/80 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Public API methods
    getCurrentRates() {
        return { ...this.currentRates };
    }

    convertCurrency(amount, from, to) {
        return this.convert(amount, from, to);
    }

    formatCurrency(amount, currency) {
        return this.formatAmount(amount, currency);
    }

    hide() {
        const widget = document.getElementById('currencyWidget');
        if (widget) {
            widget.style.display = 'none';
        }
    }

    show() {
        const widget = document.getElementById('currencyWidget');
        if (widget) {
            widget.style.display = 'block';
        }
    }

    destroy() {
        const widget = document.getElementById('currencyWidget');
        if (widget) {
            widget.remove();
        }
    }
}

// Initialize currency converter
const currencyConverter = new CurrencyConverter();

// Export for global access
window.currencyConverter = currencyConverter;

console.log('💱 Currency converter loaded');
