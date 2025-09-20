/**
 * GenTech ISP Coverage Map & Regional System
 * Interactive map showing service coverage for Western Kenya regions
 */

class CoverageMap {
    constructor() {
        this.regions = {
            'kakamega': {
                id: 'kakamega',
                name: 'Kakamega County',
                coordinates: [0.2842, 34.7519],
                bounds: [[0.1, 34.6], [0.5, 34.9]], // [south, west], [north, east]
                coverage: 'full',
                status: 'operational',
                color: '#10b981', // Green for full coverage
                population: 1867579,
                towns: ['Kakamega', 'Mumias', 'Butere', 'Khwisero'],
                services: ['fiber', '5g', 'wireless'],
                description: 'Full operational coverage with fiber and 5G networks throughout the county',
                contact: {
                    phone: '+254 700 123 456',
                    email: 'kakamega@gentech.co.ke',
                    address: 'GenTech Plaza, Kakamega Town',
                    hours: '24/7 Service Available'
                },
                plans: {
                    basic: { price: 2500, installation: 'free', speed: '25 Mbps' },
                    premium: { price: 4500, installation: 'free', speed: '100 Mbps' },
                    business: { price: 8500, installation: 'free', speed: '500 Mbps' }
                }
            },
            'bungoma': {
                id: 'bungoma',
                name: 'Bungoma County',
                coordinates: [0.5692, 34.5606],
                bounds: [[0.4, 34.4], [0.8, 34.8]],
                coverage: 'expanding',
                status: 'expanding',
                color: '#f59e0b', // Orange for expanding
                population: 1670570,
                towns: ['Bungoma', 'Webuye', 'Chwele', 'Kimilili'],
                services: ['fiber', 'wireless'],
                description: 'Expanding fiber coverage with wireless backup solutions',
                contact: {
                    phone: '+254 700 234 567',
                    email: 'bungoma@gentech.co.ke',
                    address: 'Bungoma Technology Center',
                    hours: 'Mon-Sat 8AM-8PM, Emergency 24/7'
                },
                plans: {
                    basic: { price: 2800, installation: 'free', speed: '25 Mbps' },
                    premium: { price: 4800, installation: 'free', speed: '100 Mbps' },
                    business: { price: 9000, installation: 'free', speed: '500 Mbps' }
                }
            },
            'busia': {
                id: 'busia',
                name: 'Busia County',
                coordinates: [0.4601, 34.1115],
                bounds: [[0.2, 33.9], [0.7, 34.4]],
                coverage: 'satellite',
                status: 'satellite',
                color: '#8b5cf6', // Purple for satellite
                population: 893681,
                towns: ['Busia', 'Malaba', 'Funyula', 'Nambale'],
                services: ['satellite', 'wireless'],
                description: 'Border connectivity with satellite solutions and wireless networks',
                contact: {
                    phone: '+254 700 345 678',
                    email: 'busia@gentech.co.ke',
                    address: 'Busia Border Communications Hub',
                    hours: 'Mon-Fri 8AM-6PM, Emergency 24/7'
                },
                plans: {
                    basic: { price: 3200, installation: 1500, speed: '20 Mbps' },
                    premium: { price: 5500, installation: 1500, speed: '75 Mbps' },
                    business: { price: 10500, installation: 2000, speed: '300 Mbps' }
                }
            },
            'transnzoia': {
                id: 'transnzoia',
                name: 'Trans Nzoia County',
                coordinates: [1.0153, 35.0062],
                bounds: [[0.8, 34.8], [1.3, 35.3]],
                coverage: 'wireless',
                status: 'wireless',
                color: '#06b6d4', // Cyan for wireless
                population: 990341,
                towns: ['Kitale', 'Endebess', 'Saboti', 'Kiminini'],
                services: ['wireless', 'satellite'],
                description: 'Agricultural region coverage with reliable wireless connectivity',
                contact: {
                    phone: '+254 700 456 789',
                    email: 'transnzoia@gentech.co.ke',
                    address: 'Kitale Agricultural Tech Center',
                    hours: 'Mon-Sat 7AM-7PM, Emergency 24/7'
                },
                plans: {
                    basic: { price: 3000, installation: 1000, speed: '20 Mbps' },
                    premium: { price: 5200, installation: 1000, speed: '75 Mbps' },
                    business: { price: 9800, installation: 1500, speed: '400 Mbps' }
                }
            },
            'kisumu': {
                id: 'kisumu',
                name: 'Kisumu City',
                coordinates: [-0.1022, 34.7617],
                bounds: [[-0.2, 34.6], [0.0, 34.9]],
                coverage: 'fiber',
                status: 'operational',
                color: '#3b82f6', // Blue for urban fiber
                population: 610082,
                towns: ['Kisumu', 'Maseno', 'Ahero', 'Muhoroni'],
                services: ['fiber', '5g', 'wireless'],
                description: 'Urban fiber network with high-speed options and 5G coverage',
                contact: {
                    phone: '+254 700 567 890',
                    email: 'kisumu@gentech.co.ke',
                    address: 'Kisumu Innovation Hub, Oginga Odinga Street',
                    hours: '24/7 Service Available'
                },
                plans: {
                    basic: { price: 2200, installation: 'free', speed: '30 Mbps' },
                    premium: { price: 4200, installation: 'free', speed: '150 Mbps' },
                    business: { price: 8200, installation: 'free', speed: '1 Gbps' }
                }
            }
        };

        this.currentRegion = null;
        this.mapContainer = null;
        this.svgMap = null;
        
        this.init();
    }

    async init() {
        try {
            this.createMapContainer();
            this.createInteractiveMap();
            this.createRegionSelector();
            this.setupEventListeners();
            
            // Auto-detect user region if possible
            this.detectUserRegion();
            
            console.log('🗺️ Coverage map initialized');
        } catch (error) {
            console.error('❌ Coverage map initialization failed:', error);
        }
    }

    createMapContainer() {
        // Find existing map container or create new one
        this.mapContainer = document.getElementById('coverage-map-container');
        
        if (!this.mapContainer) {
            this.mapContainer = document.createElement('div');
            this.mapContainer.id = 'coverage-map-container';
            this.mapContainer.className = 'coverage-map-container w-full h-96 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden relative';
            
            // Add to page (you can modify where this gets inserted)
            const targetSection = document.querySelector('#coverage') || document.querySelector('#about');
            if (targetSection) {
                targetSection.appendChild(this.mapContainer);
            } else {
                document.body.appendChild(this.mapContainer);
            }
        }

        this.mapContainer.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                <div class="absolute top-4 left-4 z-10">
                    <h3 class="text-white font-bold text-lg mb-2">Service Coverage Areas</h3>
                    <div class="flex flex-wrap gap-2 text-xs">
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span class="text-gray-300">Full Coverage</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                            <span class="text-gray-300">Expanding</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <span class="text-gray-300">Fiber Network</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                            <span class="text-gray-300">Wireless</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            <span class="text-gray-300">Satellite</span>
                        </div>
                    </div>
                </div>
                
                <div class="absolute top-4 right-4 z-10">
                    <select id="regionSelector" class="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 text-sm">
                        <option value="">Select Region</option>
                        ${Object.values(this.regions).map(region => 
                            `<option value="${region.id}">${region.name}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <svg id="coverage-map-svg" class="w-full h-full" viewBox="0 0 800 600">
                    <!-- Map will be rendered here -->
                </svg>
                
                <div id="region-info" class="absolute bottom-4 left-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 text-white transform translate-y-full transition-transform duration-300">
                    <!-- Region info will be displayed here -->
                </div>
            </div>
        `;

        this.svgMap = document.getElementById('coverage-map-svg');
    }

    createInteractiveMap() {
        // Create simplified map representation of Western Kenya
        const mapData = this.generateMapData();
        
        // Clear existing content
        this.svgMap.innerHTML = '';
        
        // Add background
        const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        background.setAttribute('width', '100%');
        background.setAttribute('height', '100%');
        background.setAttribute('fill', '#1f2937');
        this.svgMap.appendChild(background);
        
        // Add regions
        Object.values(this.regions).forEach(region => {
            this.createRegionElement(region);
        });
        
        // Add labels
        Object.values(this.regions).forEach(region => {
            this.createRegionLabel(region);
        });
        
        // Add connection lines (representing network infrastructure)
        this.createNetworkConnections();
    }

    generateMapData() {
        // Convert real coordinates to SVG coordinates
        // Western Kenya roughly: 33.9°E to 35.3°E, -0.2°N to 1.3°N
        const bounds = {
            west: 33.9,
            east: 35.3,
            south: -0.2,
            north: 1.3
        };
        
        return {
            bounds,
            width: 800,
            height: 600
        };
    }

    coordsToSVG(lat, lon) {
        // Convert lat/lon to SVG coordinates
        const bounds = {
            west: 33.9,
            east: 35.3,
            south: -0.2,
            north: 1.3
        };
        
        const x = ((lon - bounds.west) / (bounds.east - bounds.west)) * 800;
        const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 600;
        
        return [x, y];
    }

    createRegionElement(region) {
        const [x, y] = this.coordsToSVG(region.coordinates[0], region.coordinates[1]);
        
        // Create region circle (simplified representation)
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', region.coverage === 'full' ? '50' : '35');
        circle.setAttribute('fill', `${region.color}40`); // 40 = 25% opacity
        circle.setAttribute('stroke', region.color);
        circle.setAttribute('stroke-width', '3');
        circle.setAttribute('class', 'region-area cursor-pointer transition-all duration-300 hover:opacity-80');
        circle.setAttribute('data-region', region.id);
        
        // Add pulse animation for operational regions
        if (region.status === 'operational') {
            circle.setAttribute('class', circle.getAttribute('class') + ' animate-pulse');
        }
        
        this.svgMap.appendChild(circle);
        
        // Add coverage area
        const coverageArea = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        coverageArea.setAttribute('cx', x);
        coverageArea.setAttribute('cy', y);
        coverageArea.setAttribute('r', region.coverage === 'full' ? '80' : '60');
        coverageArea.setAttribute('fill', 'none');
        coverageArea.setAttribute('stroke', region.color);
        coverageArea.setAttribute('stroke-width', '1');
        coverageArea.setAttribute('stroke-dasharray', '5,5');
        coverageArea.setAttribute('opacity', '0.5');
        coverageArea.setAttribute('class', 'coverage-outline');
        
        this.svgMap.appendChild(coverageArea);
    }

    createRegionLabel(region) {
        const [x, y] = this.coordsToSVG(region.coordinates[0], region.coordinates[1]);
        
        // Region name
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y - 60);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('class', 'pointer-events-none');
        text.textContent = region.name;
        
        this.svgMap.appendChild(text);
        
        // Status indicator
        const statusText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        statusText.setAttribute('x', x);
        statusText.setAttribute('y', y - 45);
        statusText.setAttribute('text-anchor', 'middle');
        statusText.setAttribute('fill', region.color);
        statusText.setAttribute('font-size', '10');
        statusText.setAttribute('class', 'pointer-events-none');
        statusText.textContent = region.status.toUpperCase();
        
        this.svgMap.appendChild(statusText);
    }

    createNetworkConnections() {
        // Create lines representing network backbone connections
        const connections = [
            ['kakamega', 'bungoma'],
            ['kakamega', 'kisumu'],
            ['bungoma', 'transnzoia'],
            ['kakamega', 'busia']
        ];
        
        connections.forEach(([from, to]) => {
            const fromRegion = this.regions[from];
            const toRegion = this.regions[to];
            
            const [x1, y1] = this.coordsToSVG(fromRegion.coordinates[0], fromRegion.coordinates[1]);
            const [x2, y2] = this.coordsToSVG(toRegion.coordinates[0], toRegion.coordinates[1]);
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#6b7280');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-dasharray', '10,5');
            line.setAttribute('opacity', '0.6');
            line.setAttribute('class', 'network-connection');
            
            this.svgMap.appendChild(line);
        });
    }

    createRegionSelector() {
        const selector = document.getElementById('regionSelector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                const regionId = e.target.value;
                if (regionId) {
                    this.showRegionInfo(regionId);
                } else {
                    this.hideRegionInfo();
                }
            });
        }
    }

    setupEventListeners() {
        // Click on regions
        this.svgMap.addEventListener('click', (e) => {
            const regionElement = e.target.closest('[data-region]');
            if (regionElement) {
                const regionId = regionElement.dataset.region;
                this.showRegionInfo(regionId);
                
                // Update selector
                const selector = document.getElementById('regionSelector');
                if (selector) {
                    selector.value = regionId;
                }
            }
        });
        
        // Hover effects
        this.svgMap.addEventListener('mouseover', (e) => {
            const regionElement = e.target.closest('[data-region]');
            if (regionElement) {
                regionElement.setAttribute('stroke-width', '5');
                regionElement.style.filter = 'brightness(1.2)';
            }
        });
        
        this.svgMap.addEventListener('mouseout', (e) => {
            const regionElement = e.target.closest('[data-region]');
            if (regionElement) {
                regionElement.setAttribute('stroke-width', '3');
                regionElement.style.filter = 'brightness(1)';
            }
        });
    }

    showRegionInfo(regionId) {
        const region = this.regions[regionId];
        if (!region) return;
        
        this.currentRegion = regionId;
        const infoPanel = document.getElementById('region-info');
        
        if (infoPanel) {
            infoPanel.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="text-lg font-bold mb-2 flex items-center">
                            <div class="w-4 h-4 rounded-full mr-2" style="background-color: ${region.color}"></div>
                            ${region.name}
                        </h4>
                        <p class="text-gray-300 text-sm mb-3">${region.description}</p>
                        
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center">
                                <i class="fas fa-users w-4 mr-2 text-blue-400"></i>
                                <span>Population: ${region.population.toLocaleString()}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-wifi w-4 mr-2 text-green-400"></i>
                                <span>Services: ${region.services.join(', ')}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-map-marker-alt w-4 mr-2 text-red-400"></i>
                                <span>Towns: ${region.towns.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h5 class="font-semibold mb-2">Contact Information</h5>
                        <div class="space-y-1 text-sm text-gray-300">
                            <div class="flex items-center">
                                <i class="fas fa-phone w-4 mr-2 text-green-400"></i>
                                <a href="tel:${region.contact.phone}" class="hover:text-white">${region.contact.phone}</a>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-envelope w-4 mr-2 text-blue-400"></i>
                                <a href="mailto:${region.contact.email}" class="hover:text-white">${region.contact.email}</a>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-clock w-4 mr-2 text-yellow-400"></i>
                                <span>${region.contact.hours}</span>
                            </div>
                        </div>
                        
                        <div class="mt-3 flex gap-2">
                            <button onclick="window.analytics?.trackConversion('region_contact', {region: '${regionId}'}); window.open('tel:${region.contact.phone}')" 
                                    class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
                                <i class="fas fa-phone mr-1"></i>Call
                            </button>
                            <button onclick="window.analytics?.trackConversion('region_whatsapp', {region: '${regionId}'}); window.open('https://wa.me/${region.contact.phone.replace(/[^0-9]/g, '')}')" 
                                    class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs">
                                <i class="fab fa-whatsapp mr-1"></i>WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-gray-700">
                    <h5 class="font-semibold mb-2">Available Plans</h5>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        ${Object.entries(region.plans).map(([plan, details]) => `
                            <div class="bg-gray-700 rounded p-3 text-center">
                                <div class="font-semibold capitalize">${plan}</div>
                                <div class="text-lg font-bold text-blue-400">${window.localization?.formatCurrency(details.price) || 'KSh ' + details.price}</div>
                                <div class="text-xs text-gray-400">${details.speed} • ${details.installation === 'free' ? 'Free Setup' : 'Setup: KSh ' + details.installation}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <button onclick="this.parentElement.style.transform = 'translateY(100%)'" 
                        class="absolute top-2 right-2 text-gray-400 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Show panel
            infoPanel.style.transform = 'translateY(0)';
            
            // Track region view
            if (window.analytics) {
                window.analytics.trackEvent('region_viewed', {
                    region: regionId,
                    regionName: region.name
                });
            }
        }
    }

    hideRegionInfo() {
        const infoPanel = document.getElementById('region-info');
        if (infoPanel) {
            infoPanel.style.transform = 'translateY(100%)';
        }
        this.currentRegion = null;
    }

    detectUserRegion() {
        // In a real implementation, use IP geolocation
        // For now, default to Kakamega as main operational center
        setTimeout(() => {
            this.showRegionInfo('kakamega');
            const selector = document.getElementById('regionSelector');
            if (selector) {
                selector.value = 'kakamega';
            }
        }, 1000);
    }

    // Public API methods
    getRegions() {
        return this.regions;
    }

    getCurrentRegion() {
        return this.currentRegion ? this.regions[this.currentRegion] : null;
    }

    setRegion(regionId) {
        if (this.regions[regionId]) {
            this.showRegionInfo(regionId);
            const selector = document.getElementById('regionSelector');
            if (selector) {
                selector.value = regionId;
            }
        }
    }

    getRegionalPricing(regionId, currency = 'KSH') {
        const region = this.regions[regionId];
        if (!region) return null;
        
        const plans = { ...region.plans };
        
        // Convert currency if needed
        if (currency !== 'KSH' && window.currencyConverter) {
            Object.keys(plans).forEach(plan => {
                if (typeof plans[plan].price === 'number') {
                    plans[plan].price = window.currencyConverter.convertCurrency(plans[plan].price, 'KSH', currency);
                }
                if (typeof plans[plan].installation === 'number') {
                    plans[plan].installation = window.currencyConverter.convertCurrency(plans[plan].installation, 'KSH', currency);
                }
            });
        }
        
        return plans;
    }
}

// Initialize coverage map
const coverageMap = new CoverageMap();

// Export for global access
window.coverageMap = coverageMap;

console.log('🗺️ Coverage map system loaded');
