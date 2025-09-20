// Live Chat Support System for GenTeck ISP
class LiveChatSupport {
    constructor() {
        this.isOpen = false;
        this.isConnected = false;
        this.messages = [];
        this.currentAgent = null;
        this.typingIndicator = false;
        this.init();
    }

    init() {
        this.createChatHTML();
        this.attachEventListeners();
        this.simulateAgentAvailability();
    }

    createChatHTML() {
        const chatHTML = `
            <!-- Live Chat Widget -->
            <div id="live-chat-widget" class="fixed bottom-6 right-6 z-50">
                <!-- Chat Toggle Button -->
                <div id="chat-toggle" class="bg-primary text-white p-4 rounded-full shadow-2xl cursor-pointer hover:bg-primary-dark transition-all duration-300 hover:scale-110">
                    <i class="fas fa-comments text-xl"></i>
                    <div id="unread-badge" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hidden">1</div>
                </div>

                <!-- Chat Window -->
                <div id="chat-window" class="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-2xl shadow-2xl hidden flex-col overflow-hidden">
                    <!-- Chat Header -->
                    <div class="bg-primary text-white p-4 flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                                <i class="fas fa-headset text-sm"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold">GenTech Support</h4>
                                <div id="agent-status" class="text-xs opacity-75">Connecting...</div>
                            </div>
                        </div>
                        <button id="minimize-chat" class="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>

                    <!-- Chat Messages -->
                    <div id="chat-messages" class="flex-1 p-4 overflow-y-auto bg-gray-50">
                        <div class="welcome-message mb-4">
                            <div class="bg-white p-3 rounded-lg shadow-sm">
                                <div class="flex items-start">
                                    <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">
                                        GT
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-sm text-gray-800">Welcome to GenTech Support! How can we help you today?</p>
                                        <div class="text-xs text-gray-500 mt-1">Just now</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div id="quick-actions" class="space-y-2 mb-4">
                            <button class="quick-action w-full text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm border" data-action="billing">
                                💳 Billing & Payments
                            </button>
                            <button class="quick-action w-full text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm border" data-action="technical">
                                🔧 Technical Support
                            </button>
                            <button class="quick-action w-full text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm border" data-action="packages">
                                📦 Package Information
                            </button>
                            <button class="quick-action w-full text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm border" data-action="installation">
                                🏠 New Installation
                            </button>
                        </div>

                        <!-- Typing Indicator -->
                        <div id="typing-indicator" class="hidden mb-4">
                            <div class="bg-white p-3 rounded-lg shadow-sm">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">
                                        GT
                                    </div>
                                    <div class="flex space-x-1">
                                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Chat Input -->
                    <div class="p-4 border-t bg-white">
                        <div class="flex items-center space-x-2">
                            <input type="text" id="chat-input" placeholder="Type your message..." 
                                   class="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:border-primary">
                            <button id="send-message" class="bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-colors">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="text-xs text-gray-500 mt-2 text-center">
                            Powered by GenTech AI Assistant
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    attachEventListeners() {
        // Toggle chat window
        document.getElementById('chat-toggle').addEventListener('click', () => this.toggleChat());
        document.getElementById('minimize-chat').addEventListener('click', () => this.closeChat());

        // Send message
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Auto-typing detection
        document.getElementById('chat-input').addEventListener('input', () => {
            this.handleTyping();
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const unreadBadge = document.getElementById('unread-badge');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
            unreadBadge.classList.add('hidden');
        }
    }

    openChat() {
        this.isOpen = true;
        document.getElementById('chat-window').classList.remove('hidden');
        document.getElementById('chat-window').classList.add('flex');
        document.getElementById('chat-input').focus();
        
        // Simulate connection
        if (!this.isConnected) {
            this.simulateConnection();
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('chat-window').classList.add('hidden');
        document.getElementById('chat-window').classList.remove('flex');
    }

    simulateConnection() {
        const agentStatus = document.getElementById('agent-status');
        agentStatus.textContent = 'Connecting...';
        
        setTimeout(() => {
            this.isConnected = true;
            this.currentAgent = 'Sarah Johnson';
            agentStatus.innerHTML = `<i class="fas fa-circle text-green-400 text-xs mr-1"></i>Agent: ${this.currentAgent}`;
            
            this.addMessage('agent', 'Hello! I\'m Sarah from GenTech support. I\'m here to help you with any questions about our internet services. How can I assist you today?');
        }, 2000);
    }

    simulateAgentAvailability() {
        // Simulate new messages occasionally when chat is closed
        setInterval(() => {
            if (!this.isOpen && Math.random() > 0.95) {
                this.showNotification();
            }
        }, 30000);
    }

    showNotification() {
        const unreadBadge = document.getElementById('unread-badge');
        unreadBadge.classList.remove('hidden');
        
        // Show a subtle animation
        const toggle = document.getElementById('chat-toggle');
        toggle.style.animation = 'pulse 2s infinite';
        
        setTimeout(() => {
            toggle.style.animation = '';
        }, 6000);
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage('user', message);
        input.value = '';
        
        // Hide quick actions after first message
        document.getElementById('quick-actions').style.display = 'none';
        
        // Simulate agent response
        this.simulateAgentResponse(message);
    }

    addMessage(sender, text, timestamp = null) {
        const messagesContainer = document.getElementById('chat-messages');
        const time = timestamp || this.getCurrentTime();
        
        const messageHTML = `
            <div class="message mb-4 ${sender === 'user' ? 'text-right' : ''}">
                <div class="flex items-start ${sender === 'user' ? 'justify-end' : ''}">
                    ${sender === 'agent' ? `
                        <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm flex-shrink-0">
                            GT
                        </div>
                    ` : ''}
                    <div class="max-w-xs lg:max-w-md">
                        <div class="p-3 rounded-lg ${sender === 'user' ? 'bg-primary text-white' : 'bg-white shadow-sm'}">
                            <p class="text-sm">${text}</p>
                        </div>
                        <div class="text-xs text-gray-500 mt-1 ${sender === 'user' ? 'text-right' : ''}">${time}</div>
                    </div>
                    ${sender === 'user' ? `
                        <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center ml-3 text-sm flex-shrink-0">
                            <i class="fas fa-user text-xs"></i>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ sender, text, timestamp: time });
    }

    simulateAgentResponse(userMessage) {
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            
            const response = this.generateResponse(userMessage);
            this.addMessage('agent', response);
        }, 1500 + Math.random() * 2000);
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Predefined responses based on keywords
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('package')) {
            return 'Our packages start from KSH 2,999/month for HomeConnect Basic with 25 Mbps. We also have Enterprise and BizPlus options. Would you like me to send you our complete pricing details?';
        }
        
        if (lowerMessage.includes('speed') || lowerMessage.includes('fast') || lowerMessage.includes('mbps')) {
            return 'We offer speeds from 25 Mbps up to 1 Gbps depending on your package. Our fiber network ensures consistent high-speed connectivity. What speed would work best for your needs?';
        }
        
        if (lowerMessage.includes('installation') || lowerMessage.includes('setup')) {
            return 'Our installation process is quick and professional. We can typically have you connected within 24-48 hours. Would you like to schedule a site survey for your location?';
        }
        
        if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('slow')) {
            return 'I\'m sorry to hear you\'re experiencing issues. Let me help troubleshoot this. Can you tell me more about what specific problems you\'re facing with your connection?';
        }
        
        if (lowerMessage.includes('coverage') || lowerMessage.includes('area') || lowerMessage.includes('location')) {
            return 'We have extensive coverage across Kenya with fiber in major cities and 4G/LTE in rural areas. Could you share your location so I can check specific availability for you?';
        }
        
        // Default responses
        const defaultResponses = [
            'Thank you for your question. Let me get you connected with the right information. Could you provide more details about what you\'re looking for?',
            'I\'d be happy to help you with that. Can you tell me a bit more about your specific needs or situation?',
            'That\'s a great question! To give you the most accurate information, could you share a few more details about what you\'re interested in?'
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    handleQuickAction(action) {
        const responses = {
            billing: 'I can help you with billing questions. You can view your bill, make payments, or update your payment method. What specifically do you need help with regarding your account?',
            technical: 'I\'m here to help with any technical issues. Are you experiencing slow speeds, connection drops, or other connectivity problems?',
            packages: 'We have several packages available:\n\n📦 HomeConnect: 25-100 Mbps\n🏢 BizPlus: 100-500 Mbps\n🏛️ Enterprise: 500 Mbps - 1 Gbps\n🎓 EduConnect: Specialized for schools\n\nWhich type of service are you interested in?',
            installation: 'Great! I can help you get started with a new installation. We offer free site surveys and professional installation. What\'s your location and preferred package?'
        };
        
        document.getElementById('quick-actions').style.display = 'none';
        this.addMessage('user', document.querySelector(`[data-action="${action}"]`).textContent);
        
        setTimeout(() => {
            this.addMessage('agent', responses[action]);
        }, 1000);
    }

    showTypingIndicator() {
        this.typingIndicator = true;
        document.getElementById('typing-indicator').classList.remove('hidden');
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        this.typingIndicator = false;
        document.getElementById('typing-indicator').classList.add('hidden');
    }

    handleTyping() {
        // Show that user is typing (could be sent to server in real implementation)
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Package Comparison Tool
class PackageComparison {
    constructor() {
        this.packages = {
            homeconnect: {
                basic: { name: 'HomeConnect Basic', speed: '25 Mbps', price: 2999, features: ['Unlimited Data', 'Free Installation', '24/7 Support', 'WiFi Router'] },
                standard: { name: 'HomeConnect Standard', speed: '50 Mbps', price: 4999, features: ['Unlimited Data', 'Free Installation', '24/7 Support', 'WiFi Router', 'Parental Controls'] },
                premium: { name: 'HomeConnect Premium', speed: '100 Mbps', price: 7999, features: ['Unlimited Data', 'Free Installation', '24/7 Support', 'WiFi Router', 'Parental Controls', 'Static IP'] }
            },
            bizplus: {
                starter: { name: 'BizPlus Starter', speed: '100 Mbps', price: 9999, features: ['Unlimited Data', 'Business Support', 'Static IP', 'SLA Guarantee', 'Backup Connection'] },
                professional: { name: 'BizPlus Professional', speed: '250 Mbps', price: 19999, features: ['Unlimited Data', 'Business Support', 'Static IP', 'SLA Guarantee', 'Backup Connection', 'Dedicated Account Manager'] },
                enterprise: { name: 'BizPlus Enterprise', speed: '500 Mbps', price: 39999, features: ['Unlimited Data', 'Business Support', 'Static IP', 'SLA Guarantee', 'Backup Connection', 'Dedicated Account Manager', 'VPN Setup'] }
            }
        };
        this.init();
    }

    init() {
        this.createComparisonHTML();
        this.attachEventListeners();
    }

    createComparisonHTML() {
        const comparisonHTML = `
            <div id="package-comparison-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                    <div class="p-6 border-b">
                        <h3 class="text-2xl font-bold text-gray-800">Compare Packages</h3>
                        <p class="text-gray-600 mt-2">Find the perfect internet plan for your needs</p>
                        <button id="close-comparison" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="p-6 overflow-y-auto max-h-[75vh]">
                        <!-- Package Category Selector -->
                        <div class="mb-6">
                            <div class="flex space-x-4">
                                <button id="compare-home" class="package-category-btn active px-6 py-2 rounded-lg border-2 border-primary bg-primary text-white">
                                    Home Packages
                                </button>
                                <button id="compare-business" class="package-category-btn px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-primary">
                                    Business Packages
                                </button>
                            </div>
                        </div>
                        
                        <!-- Comparison Table -->
                        <div id="comparison-content" class="overflow-x-auto">
                            <!-- Content will be populated by JavaScript -->
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="mt-8 text-center">
                            <button id="get-quote" class="btn-primary px-8 py-3 rounded-lg mr-4">
                                Get Custom Quote
                            </button>
                            <button id="contact-sales" class="btn-secondary px-8 py-3 rounded-lg">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', comparisonHTML);
    }

    attachEventListeners() {
        // Comparison trigger
        const compareBtn = document.querySelector('[data-feature="package-comparison"]');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.openComparison());
        }

        // Modal controls
        document.getElementById('close-comparison').addEventListener('click', () => this.closeComparison());
        document.getElementById('compare-home').addEventListener('click', () => this.showCategory('home'));
        document.getElementById('compare-business').addEventListener('click', () => this.showCategory('business'));
        
        // Action buttons
        document.getElementById('get-quote').addEventListener('click', () => this.getQuote());
        document.getElementById('contact-sales').addEventListener('click', () => this.contactSales());

        // Close on backdrop click
        document.getElementById('package-comparison-modal').addEventListener('click', (e) => {
            if (e.target.id === 'package-comparison-modal') {
                this.closeComparison();
            }
        });
    }

    openComparison() {
        document.getElementById('package-comparison-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this.showCategory('home');
    }

    closeComparison() {
        document.getElementById('package-comparison-modal').classList.add('hidden');
        document.body.style.overflow = '';
    }

    showCategory(category) {
        // Update active button
        document.querySelectorAll('.package-category-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-primary', 'text-white');
            btn.classList.add('border-gray-300', 'text-gray-600');
        });
        
        const activeBtn = document.getElementById(`compare-${category}`);
        activeBtn.classList.add('active', 'bg-primary', 'text-white');
        activeBtn.classList.remove('border-gray-300', 'text-gray-600');

        // Show packages
        const packages = category === 'home' ? this.packages.homeconnect : this.packages.bizplus;
        this.renderComparison(packages);
    }

    renderComparison(packages) {
        const packageNames = Object.keys(packages);
        const content = document.getElementById('comparison-content');
        
        const tableHTML = `
            <table class="w-full">
                <thead>
                    <tr class="border-b-2">
                        <th class="text-left p-4 font-semibold text-gray-800">Features</th>
                        ${packageNames.map(key => `
                            <th class="text-center p-4">
                                <div class="bg-gray-50 rounded-lg p-4">
                                    <h4 class="font-bold text-primary text-lg">${packages[key].name}</h4>
                                    <div class="text-2xl font-bold text-gray-800 mt-2">KSH ${packages[key].price.toLocaleString()}</div>
                                    <div class="text-sm text-gray-600">per month</div>
                                    <div class="text-primary font-semibold mt-2">${packages[key].speed}</div>
                                </div>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b">
                        <td class="p-4 font-semibold">Speed</td>
                        ${packageNames.map(key => `
                            <td class="text-center p-4">
                                <span class="text-primary font-bold">${packages[key].speed}</span>
                            </td>
                        `).join('')}
                    </tr>
                    <tr class="border-b">
                        <td class="p-4 font-semibold">Monthly Price</td>
                        ${packageNames.map(key => `
                            <td class="text-center p-4">
                                <span class="text-2xl font-bold text-gray-800">KSH ${packages[key].price.toLocaleString()}</span>
                            </td>
                        `).join('')}
                    </tr>
                    ${this.getAllFeatures(packages).map(feature => `
                        <tr class="border-b">
                            <td class="p-4">${feature}</td>
                            ${packageNames.map(key => `
                                <td class="text-center p-4">
                                    ${packages[key].features.includes(feature) ? 
                                        '<i class="fas fa-check text-green-500 text-xl"></i>' : 
                                        '<i class="fas fa-times text-gray-300 text-xl"></i>'}
                                </td>
                            `).join('')}
                        </tr>
                    `).join('')}
                    <tr>
                        <td class="p-4"></td>
                        ${packageNames.map(key => `
                            <td class="text-center p-4">
                                <button class="btn-primary w-full py-2 rounded-lg select-package" data-package="${packages[key].name}">
                                    Choose Plan
                                </button>
                            </td>
                        `).join('')}
                    </tr>
                </tbody>
            </table>
        `;
        
        content.innerHTML = tableHTML;
        
        // Attach select package listeners
        document.querySelectorAll('.select-package').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const packageName = e.target.dataset.package;
                this.selectPackage(packageName);
            });
        });
    }

    getAllFeatures(packages) {
        const allFeatures = new Set();
        Object.values(packages).forEach(pkg => {
            pkg.features.forEach(feature => allFeatures.add(feature));
        });
        return Array.from(allFeatures);
    }

    selectPackage(packageName) {
        this.closeComparison();
        // Scroll to contact or show quote form
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }

    getQuote() {
        // Open custom quote form or redirect
        alert('Custom quote form will be displayed here. Please contact our sales team for personalized pricing.');
    }

    contactSales() {
        this.closeComparison();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new LiveChatSupport();
    new PackageComparison();
});
