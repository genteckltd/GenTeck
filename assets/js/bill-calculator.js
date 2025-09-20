// Bill Calculator for GenTeck ISP
class BillCalculator {
    constructor() {
        this.basePackages = {
            homeconnect: {
                basic: { name: 'HomeConnect Basic', speed: '25 Mbps', basePrice: 2999 },
                standard: { name: 'HomeConnect Standard', speed: '50 Mbps', basePrice: 4999 },
                premium: { name: 'HomeConnect Premium', speed: '100 Mbps', basePrice: 7999 }
            },
            bizplus: {
                starter: { name: 'BizPlus Starter', speed: '100 Mbps', basePrice: 9999 },
                professional: { name: 'BizPlus Professional', speed: '250 Mbps', basePrice: 19999 },
                enterprise: { name: 'BizPlus Enterprise', speed: '500 Mbps', basePrice: 39999 }
            },
            enterprise: {
                basic: { name: 'Enterprise Basic', speed: '500 Mbps', basePrice: 39999 },
                premium: { name: 'Enterprise Premium', speed: '1 Gbps', basePrice: 79999 },
                ultimate: { name: 'Enterprise Ultimate', speed: '2 Gbps', basePrice: 149999 }
            },
            educonnect: {
                school: { name: 'EduConnect School', speed: '100 Mbps', basePrice: 7999 },
                campus: { name: 'EduConnect Campus', speed: '500 Mbps', basePrice: 29999 }
            }
        };

        this.addOns = {
            staticIP: { name: 'Static IP Address', price: 1000 },
            vpnService: { name: 'VPN Service', price: 1500 },
            emailHosting: { name: 'Email Hosting (10 accounts)', price: 2000 },
            websiteHosting: { name: 'Website Hosting', price: 2500 },
            cloudBackup: { name: 'Cloud Backup (100GB)', price: 1500 },
            securityPackage: { name: 'Advanced Security Package', price: 3000 },
            prioritySupport: { name: 'Priority Support', price: 2000 },
            extendedWarranty: { name: 'Extended Equipment Warranty', price: 1000 }
        };

        this.discounts = {
            annual: { name: 'Annual Payment', discount: 0.15, description: '15% off for yearly payment' },
            student: { name: 'Student Discount', discount: 0.10, description: '10% off for students' },
            senior: { name: 'Senior Citizen', discount: 0.10, description: '10% off for seniors (60+)' },
            business: { name: 'Multiple Locations', discount: 0.12, description: '12% off for 3+ locations' }
        };

        this.currentCalculation = {
            package: null,
            addOns: [],
            discounts: [],
            term: 'monthly'
        };

        this.init();
    }

    init() {
        this.createCalculatorHTML();
        this.attachEventListeners();
    }

    createCalculatorHTML() {
        const calculatorHTML = `
            <div id="bill-calculator-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                    <div class="p-6 border-b">
                        <h3 class="text-2xl font-bold text-gray-800">Bill Calculator</h3>
                        <p class="text-gray-600 mt-2">Calculate your monthly internet costs with add-ons and discounts</p>
                        <button id="close-calculator" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="flex flex-col lg:flex-row h-[75vh]">
                        <!-- Configuration Panel -->
                        <div class="lg:w-2/3 p-6 overflow-y-auto">
                            <!-- Package Selection -->
                            <div class="mb-8">
                                <h4 class="text-lg font-semibold text-gray-800 mb-4">1. Choose Your Package</h4>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Package Category</label>
                                        <select id="package-category" class="w-full p-3 border border-gray-300 rounded-lg focus:border-primary">
                                            <option value="">Select Category</option>
                                            <option value="homeconnect">HomeConnect (Residential)</option>
                                            <option value="bizplus">BizPlus (Small Business)</option>
                                            <option value="enterprise">Enterprise (Large Business)</option>
                                            <option value="educonnect">EduConnect (Educational)</option>
                                        </select>
                                    </div>
                                    
                                    <div id="package-options" class="hidden">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Package Plan</label>
                                        <div id="package-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <!-- Package options will be populated here -->
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Add-ons Selection -->
                            <div class="mb-8">
                                <h4 class="text-lg font-semibold text-gray-800 mb-4">2. Select Add-ons (Optional)</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    ${Object.entries(this.addOns).map(([key, addon]) => `
                                        <label class="flex items-center p-4 border border-gray-300 rounded-lg hover:border-primary cursor-pointer">
                                            <input type="checkbox" class="addon-checkbox mr-3" data-addon="${key}" data-price="${addon.price}">
                                            <div class="flex-1">
                                                <div class="font-medium text-gray-800">${addon.name}</div>
                                                <div class="text-sm text-gray-600">+KSH ${addon.price.toLocaleString()}/month</div>
                                            </div>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Payment Term -->
                            <div class="mb-8">
                                <h4 class="text-lg font-semibold text-gray-800 mb-4">3. Payment Term</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label class="flex items-center p-4 border border-gray-300 rounded-lg hover:border-primary cursor-pointer">
                                        <input type="radio" name="payment-term" value="monthly" class="mr-3" checked>
                                        <div>
                                            <div class="font-medium text-gray-800">Monthly Payment</div>
                                            <div class="text-sm text-gray-600">Pay monthly, no commitment</div>
                                        </div>
                                    </label>
                                    <label class="flex items-center p-4 border border-gray-300 rounded-lg hover:border-primary cursor-pointer">
                                        <input type="radio" name="payment-term" value="annual" class="mr-3">
                                        <div>
                                            <div class="font-medium text-gray-800">Annual Payment</div>
                                            <div class="text-sm text-green-600">Save 15% with yearly payment!</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Discounts -->
                            <div class="mb-8">
                                <h4 class="text-lg font-semibold text-gray-800 mb-4">4. Available Discounts</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    ${Object.entries(this.discounts).filter(([key]) => key !== 'annual').map(([key, discount]) => `
                                        <label class="flex items-center p-4 border border-gray-300 rounded-lg hover:border-primary cursor-pointer">
                                            <input type="checkbox" class="discount-checkbox mr-3" data-discount="${key}" data-percent="${discount.discount}">
                                            <div>
                                                <div class="font-medium text-gray-800">${discount.name}</div>
                                                <div class="text-sm text-green-600">${discount.description}</div>
                                            </div>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Bill Summary Panel -->
                        <div class="lg:w-1/3 bg-gray-50 p-6 overflow-y-auto">
                            <h4 class="text-lg font-semibold text-gray-800 mb-6">Bill Summary</h4>
                            
                            <div id="bill-summary">
                                <div class="text-center text-gray-500 py-8">
                                    Select a package to see pricing
                                </div>
                            </div>
                            
                            <div id="bill-breakdown" class="hidden">
                                <!-- Base Package -->
                                <div class="bg-white p-4 rounded-lg mb-4">
                                    <h5 class="font-semibold text-gray-800 mb-3">Package Details</h5>
                                    <div id="selected-package" class="space-y-2">
                                        <!-- Package details will be populated here -->
                                    </div>
                                </div>

                                <!-- Add-ons -->
                                <div id="addons-summary" class="bg-white p-4 rounded-lg mb-4 hidden">
                                    <h5 class="font-semibold text-gray-800 mb-3">Add-ons</h5>
                                    <div id="selected-addons" class="space-y-2">
                                        <!-- Add-on details will be populated here -->
                                    </div>
                                </div>

                                <!-- Discounts -->
                                <div id="discounts-summary" class="bg-white p-4 rounded-lg mb-4 hidden">
                                    <h5 class="font-semibold text-gray-800 mb-3">Discounts Applied</h5>
                                    <div id="applied-discounts" class="space-y-2">
                                        <!-- Discount details will be populated here -->
                                    </div>
                                </div>

                                <!-- Total -->
                                <div class="bg-primary text-white p-4 rounded-lg mb-6">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-sm opacity-75">Subtotal</span>
                                        <span id="subtotal">KSH 0</span>
                                    </div>
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-sm opacity-75">Discounts</span>
                                        <span id="total-discount" class="text-green-300">-KSH 0</span>
                                    </div>
                                    <div class="border-t border-white border-opacity-20 pt-2">
                                        <div class="flex justify-between items-center">
                                            <span class="font-semibold">Monthly Total</span>
                                            <span id="monthly-total" class="text-xl font-bold">KSH 0</span>
                                        </div>
                                    </div>
                                    <div id="annual-savings" class="text-xs text-green-300 mt-2 hidden">
                                        Annual savings: KSH <span id="annual-savings-amount">0</span>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="space-y-3">
                                    <button id="subscribe-now" class="w-full bg-white text-primary py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                        Subscribe Now
                                    </button>
                                    <button id="save-quote" class="w-full border border-white text-white py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                                        Save Quote
                                    </button>
                                    <button id="email-quote" class="w-full border border-white text-white py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                                        Email Quote
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', calculatorHTML);
    }

    attachEventListeners() {
        // Calculator trigger
        const calculatorBtn = document.querySelector('[data-feature="bill-calculator"]');
        if (calculatorBtn) {
            calculatorBtn.addEventListener('click', () => this.openCalculator());
        }

        // Modal controls
        document.getElementById('close-calculator').addEventListener('click', () => this.closeCalculator());

        // Package selection
        document.getElementById('package-category').addEventListener('change', (e) => {
            this.showPackageOptions(e.target.value);
        });

        // Payment term
        document.querySelectorAll('input[name="payment-term"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentCalculation.term = e.target.value;
                this.updateBillSummary();
            });
        });

        // Add-ons
        document.querySelectorAll('.addon-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateAddOns());
        });

        // Discounts
        document.querySelectorAll('.discount-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateDiscounts());
        });

        // Action buttons
        document.getElementById('subscribe-now').addEventListener('click', () => this.subscribeNow());
        document.getElementById('save-quote').addEventListener('click', () => this.saveQuote());
        document.getElementById('email-quote').addEventListener('click', () => this.emailQuote());

        // Close on backdrop click
        document.getElementById('bill-calculator-modal').addEventListener('click', (e) => {
            if (e.target.id === 'bill-calculator-modal') {
                this.closeCalculator();
            }
        });
    }

    openCalculator() {
        document.getElementById('bill-calculator-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeCalculator() {
        document.getElementById('bill-calculator-modal').classList.add('hidden');
        document.body.style.overflow = '';
    }

    showPackageOptions(category) {
        const packageOptions = document.getElementById('package-options');
        const packageList = document.getElementById('package-list');
        
        if (!category) {
            packageOptions.classList.add('hidden');
            return;
        }

        const packages = this.basePackages[category];
        packageOptions.classList.remove('hidden');
        
        const optionsHTML = Object.entries(packages).map(([key, pkg]) => `
            <label class="package-option flex flex-col p-4 border border-gray-300 rounded-lg hover:border-primary cursor-pointer transition-colors">
                <input type="radio" name="package" value="${category}-${key}" class="mb-3" data-package='${JSON.stringify(pkg)}'>
                <div class="flex-1">
                    <h5 class="font-semibold text-gray-800">${pkg.name}</h5>
                    <div class="text-primary font-bold text-lg">${pkg.speed}</div>
                    <div class="text-2xl font-bold text-gray-800 mt-2">KSH ${pkg.basePrice.toLocaleString()}</div>
                    <div class="text-sm text-gray-600">per month</div>
                </div>
            </label>
        `).join('');
        
        packageList.innerHTML = optionsHTML;
        
        // Attach package selection listeners
        document.querySelectorAll('input[name="package"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentCalculation.package = JSON.parse(e.target.dataset.package);
                this.updateBillSummary();
            });
        });
    }

    updateAddOns() {
        this.currentCalculation.addOns = [];
        document.querySelectorAll('.addon-checkbox:checked').forEach(checkbox => {
            const addonKey = checkbox.dataset.addon;
            const addon = this.addOns[addonKey];
            this.currentCalculation.addOns.push({
                key: addonKey,
                name: addon.name,
                price: addon.price
            });
        });
        this.updateBillSummary();
    }

    updateDiscounts() {
        this.currentCalculation.discounts = [];
        document.querySelectorAll('.discount-checkbox:checked').forEach(checkbox => {
            const discountKey = checkbox.dataset.discount;
            const discount = this.discounts[discountKey];
            this.currentCalculation.discounts.push({
                key: discountKey,
                name: discount.name,
                discount: discount.discount,
                description: discount.description
            });
        });
        this.updateBillSummary();
    }

    updateBillSummary() {
        const billBreakdown = document.getElementById('bill-breakdown');
        const billSummary = document.getElementById('bill-summary');
        
        if (!this.currentCalculation.package) {
            billBreakdown.classList.add('hidden');
            billSummary.innerHTML = '<div class="text-center text-gray-500 py-8">Select a package to see pricing</div>';
            return;
        }

        billBreakdown.classList.remove('hidden');
        billSummary.innerHTML = '';
        
        // Update package details
        const selectedPackage = document.getElementById('selected-package');
        selectedPackage.innerHTML = `
            <div class="flex justify-between">
                <span class="font-medium">${this.currentCalculation.package.name}</span>
                <span>KSH ${this.currentCalculation.package.basePrice.toLocaleString()}</span>
            </div>
            <div class="text-sm text-gray-600">${this.currentCalculation.package.speed}</div>
        `;

        // Update add-ons
        const addonsContainer = document.getElementById('addons-summary');
        const selectedAddons = document.getElementById('selected-addons');
        
        if (this.currentCalculation.addOns.length > 0) {
            addonsContainer.classList.remove('hidden');
            selectedAddons.innerHTML = this.currentCalculation.addOns.map(addon => `
                <div class="flex justify-between text-sm">
                    <span>${addon.name}</span>
                    <span>+KSH ${addon.price.toLocaleString()}</span>
                </div>
            `).join('');
        } else {
            addonsContainer.classList.add('hidden');
        }

        // Update discounts
        const discountsContainer = document.getElementById('discounts-summary');
        const appliedDiscounts = document.getElementById('applied-discounts');
        
        let allDiscounts = [...this.currentCalculation.discounts];
        if (this.currentCalculation.term === 'annual') {
            allDiscounts.push(this.discounts.annual);
        }

        if (allDiscounts.length > 0) {
            discountsContainer.classList.remove('hidden');
            appliedDiscounts.innerHTML = allDiscounts.map(discount => `
                <div class="flex justify-between text-sm text-green-600">
                    <span>${discount.name || discount.description}</span>
                    <span>-${Math.round(discount.discount * 100)}%</span>
                </div>
            `).join('');
        } else {
            discountsContainer.classList.add('hidden');
        }

        // Calculate totals
        this.calculateTotals();
    }

    calculateTotals() {
        const basePrice = this.currentCalculation.package.basePrice;
        const addOnsTotal = this.currentCalculation.addOns.reduce((sum, addon) => sum + addon.price, 0);
        const subtotal = basePrice + addOnsTotal;
        
        // Calculate discount percentage
        let totalDiscountPercent = 0;
        this.currentCalculation.discounts.forEach(discount => {
            totalDiscountPercent += discount.discount;
        });
        
        // Add annual discount if applicable
        if (this.currentCalculation.term === 'annual') {
            totalDiscountPercent += this.discounts.annual.discount;
        }
        
        // Apply discounts (max 50% total discount)
        totalDiscountPercent = Math.min(totalDiscountPercent, 0.5);
        const discountAmount = subtotal * totalDiscountPercent;
        const monthlyTotal = subtotal - discountAmount;
        
        // Update display
        document.getElementById('subtotal').textContent = `KSH ${subtotal.toLocaleString()}`;
        document.getElementById('total-discount').textContent = `-KSH ${Math.round(discountAmount).toLocaleString()}`;
        document.getElementById('monthly-total').textContent = `KSH ${Math.round(monthlyTotal).toLocaleString()}`;
        
        // Show annual savings if applicable
        const annualSavings = document.getElementById('annual-savings');
        const annualSavingsAmount = document.getElementById('annual-savings-amount');
        
        if (this.currentCalculation.term === 'annual') {
            const monthlyCost = subtotal;
            const annualCost = monthlyTotal * 12;
            const savings = (monthlyCost * 12) - annualCost;
            
            annualSavings.classList.remove('hidden');
            annualSavingsAmount.textContent = Math.round(savings).toLocaleString();
        } else {
            annualSavings.classList.add('hidden');
        }
    }

    subscribeNow() {
        // Redirect to contact or subscription form
        this.closeCalculator();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }

    saveQuote() {
        const quote = {
            package: this.currentCalculation.package,
            addOns: this.currentCalculation.addOns,
            discounts: this.currentCalculation.discounts,
            term: this.currentCalculation.term,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('gentech_quote', JSON.stringify(quote));
        alert('Quote saved successfully! You can return to it anytime.');
    }

    emailQuote() {
        const monthlyTotal = document.getElementById('monthly-total').textContent;
        const subject = 'GenTech Internet Quote Request';
        const body = `Hello GenTech Team,

I'm interested in the following internet package:

Package: ${this.currentCalculation.package?.name}
Speed: ${this.currentCalculation.package?.speed}
Monthly Cost: ${monthlyTotal}

Please contact me with more information.

Thank you!`;
        
        const mailtoLink = `mailto:sales@gentech.co.ke?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    }
}

// Initialize Bill Calculator
document.addEventListener('DOMContentLoaded', () => {
    new BillCalculator();
});
