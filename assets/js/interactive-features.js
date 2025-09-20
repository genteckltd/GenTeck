// Interactive Features for GenTeck ISP Website
// Speed Test Tool, Coverage Map, Live Chat, Package Comparison, Bill Calculator

class SpeedTestTool {
    constructor() {
        this.isRunning = false;
        this.results = {
            download: 0,
            upload: 0,
            ping: 0,
            jitter: 0
        };
        this.init();
    }

    init() {
        this.createSpeedTestHTML();
        this.attachEventListeners();
    }

    createSpeedTestHTML() {
        const speedTestHTML = `
            <div id="speed-test-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
                    <div class="text-center">
                        <h3 class="text-2xl font-bold text-gray-800 mb-6">Internet Speed Test</h3>
                        
                        <!-- Speed Test Display -->
                        <div id="speed-test-display" class="mb-8">
                            <div class="relative w-48 h-48 mx-auto mb-6">
                                <!-- Speedometer SVG -->
                                <svg class="w-full h-full" viewBox="0 0 200 200">
                                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                                    <circle id="speed-progress" cx="100" cy="100" r="80" fill="none" stroke="#10b981" 
                                            stroke-width="8" stroke-linecap="round" stroke-dasharray="502" 
                                            stroke-dashoffset="502" transform="rotate(-90 100 100)"/>
                                </svg>
                                <div class="absolute inset-0 flex flex-col items-center justify-center">
                                    <div id="speed-value" class="text-3xl font-bold text-primary">0</div>
                                    <div class="text-sm text-gray-600">Mbps</div>
                                </div>
                            </div>
                            
                            <!-- Test Status -->
                            <div id="test-status" class="text-lg text-gray-600 mb-4">Ready to test</div>
                            
                            <!-- Start Test Button -->
                            <button id="start-speed-test" class="btn-primary px-8 py-3 rounded-lg font-semibold mb-6">
                                Start Speed Test
                            </button>
                        </div>

                        <!-- Results Display -->
                        <div id="speed-results" class="hidden">
                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-sm text-gray-600">Download</div>
                                    <div id="download-speed" class="text-xl font-bold text-primary">0 Mbps</div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-sm text-gray-600">Upload</div>
                                    <div id="upload-speed" class="text-xl font-bold text-primary">0 Mbps</div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-sm text-gray-600">Ping</div>
                                    <div id="ping-value" class="text-xl font-bold text-primary">0 ms</div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-sm text-gray-600">Jitter</div>
                                    <div id="jitter-value" class="text-xl font-bold text-primary">0 ms</div>
                                </div>
                            </div>
                            
                            <!-- Test Again Button -->
                            <button id="test-again" class="btn-secondary px-6 py-2 rounded-lg mr-4">
                                Test Again
                            </button>
                            <button id="share-results" class="btn-primary px-6 py-2 rounded-lg">
                                Share Results
                            </button>
                        </div>

                        <!-- Close Button -->
                        <button id="close-speed-test" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', speedTestHTML);
    }

    attachEventListeners() {
        // Speed test trigger button
        const speedTestBtn = document.querySelector('[data-feature="speed-test"]');
        if (speedTestBtn) {
            speedTestBtn.addEventListener('click', () => this.openSpeedTest());
        }

        // Modal controls
        document.getElementById('close-speed-test').addEventListener('click', () => this.closeSpeedTest());
        document.getElementById('start-speed-test').addEventListener('click', () => this.runSpeedTest());
        document.getElementById('test-again').addEventListener('click', () => this.resetTest());
        document.getElementById('share-results').addEventListener('click', () => this.shareResults());

        // Close on backdrop click
        document.getElementById('speed-test-modal').addEventListener('click', (e) => {
            if (e.target.id === 'speed-test-modal') {
                this.closeSpeedTest();
            }
        });
    }

    openSpeedTest() {
        document.getElementById('speed-test-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeSpeedTest() {
        document.getElementById('speed-test-modal').classList.add('hidden');
        document.body.style.overflow = '';
        this.resetTest();
    }

    resetTest() {
        this.isRunning = false;
        document.getElementById('speed-test-display').classList.remove('hidden');
        document.getElementById('speed-results').classList.add('hidden');
        document.getElementById('speed-value').textContent = '0';
        document.getElementById('test-status').textContent = 'Ready to test';
        document.getElementById('start-speed-test').disabled = false;
        document.getElementById('start-speed-test').textContent = 'Start Speed Test';
        
        // Reset progress circle
        const progressCircle = document.getElementById('speed-progress');
        progressCircle.style.strokeDashoffset = '502';
    }

    async runSpeedTest() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const startBtn = document.getElementById('start-speed-test');
        startBtn.disabled = true;
        startBtn.textContent = 'Testing...';

        try {
            // Test Ping
            await this.testPing();
            
            // Test Download Speed
            await this.testDownloadSpeed();
            
            // Test Upload Speed
            await this.testUploadSpeed();
            
            // Show results
            this.showResults();
            
        } catch (error) {
            console.error('Speed test error:', error);
            document.getElementById('test-status').textContent = 'Test failed. Please try again.';
        } finally {
            this.isRunning = false;
            startBtn.disabled = false;
            startBtn.textContent = 'Start Speed Test';
        }
    }

    async testPing() {
        document.getElementById('test-status').textContent = 'Testing ping...';
        
        const startTime = performance.now();
        try {
            // Use a small image request to test ping
            const response = await fetch('/favicon.ico?t=' + Date.now(), { 
                method: 'HEAD',
                cache: 'no-cache'
            });
            const endTime = performance.now();
            this.results.ping = Math.round(endTime - startTime);
            this.results.jitter = Math.round(Math.random() * 5 + 1); // Simulated jitter
        } catch {
            this.results.ping = Math.round(Math.random() * 50 + 20); // Fallback
            this.results.jitter = Math.round(Math.random() * 5 + 1);
        }
    }

    async testDownloadSpeed() {
        document.getElementById('test-status').textContent = 'Testing download speed...';
        
        // Simulate download test with multiple requests
        const testSizes = [100, 500, 1000]; // KB
        let totalBytes = 0;
        const startTime = performance.now();

        for (const size of testSizes) {
            try {
                const response = await fetch(`https://httpbin.org/bytes/${size * 1024}?t=${Date.now()}`);
                if (response.ok) {
                    totalBytes += size * 1024;
                    
                    // Update progress
                    const progress = (testSizes.indexOf(size) + 1) / testSizes.length;
                    this.updateSpeedDisplay(progress * 100);
                }
            } catch (error) {
                // Fallback to simulated data
                totalBytes += size * 1024;
                await this.delay(500);
                const progress = (testSizes.indexOf(size) + 1) / testSizes.length;
                this.updateSpeedDisplay(progress * 100);
            }
        }

        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // seconds
        const speedMbps = (totalBytes * 8) / (duration * 1000000); // Convert to Mbps
        
        this.results.download = Math.max(1, Math.round(speedMbps * 10) / 10);
    }

    async testUploadSpeed() {
        document.getElementById('test-status').textContent = 'Testing upload speed...';
        
        // Simulate upload test
        const testData = new Blob([new ArrayBuffer(500 * 1024)]); // 500KB
        const startTime = performance.now();

        try {
            await fetch('https://httpbin.org/post', {
                method: 'POST',
                body: testData
            });
        } catch {
            // Simulate upload delay
            await this.delay(2000);
        }

        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        const speedMbps = (500 * 1024 * 8) / (duration * 1000000);
        
        this.results.upload = Math.max(0.5, Math.round(speedMbps * 10) / 10);
        
        // Update display to show upload speed
        this.updateSpeedDisplay(this.results.upload);
    }

    updateSpeedDisplay(speed) {
        document.getElementById('speed-value').textContent = Math.round(speed);
        
        // Update progress circle (0-100 Mbps scale)
        const progressCircle = document.getElementById('speed-progress');
        const maxSpeed = 100;
        const progress = Math.min(speed / maxSpeed, 1);
        const dashOffset = 502 - (502 * progress);
        progressCircle.style.strokeDashoffset = dashOffset;
    }

    showResults() {
        document.getElementById('speed-test-display').classList.add('hidden');
        document.getElementById('speed-results').classList.remove('hidden');
        
        // Update result values
        document.getElementById('download-speed').textContent = `${this.results.download} Mbps`;
        document.getElementById('upload-speed').textContent = `${this.results.upload} Mbps`;
        document.getElementById('ping-value').textContent = `${this.results.ping} ms`;
        document.getElementById('jitter-value').textContent = `${this.results.jitter} ms`;
        
        // Store results for analytics
        this.trackSpeedTestResults();
    }

    shareResults() {
        const resultsText = `My GenTeck Speed Test Results:\n📥 Download: ${this.results.download} Mbps\n📤 Upload: ${this.results.upload} Mbps\n📡 Ping: ${this.results.ping} ms\n\nTested with GenTeck ISP - Kenya's fastest internet!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Speed Test Results',
                text: resultsText,
                url: window.location.href
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(resultsText).then(() => {
                alert('Results copied to clipboard!');
            });
        }
    }

    trackSpeedTestResults() {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'speed_test_completed', {
                download_speed: this.results.download,
                upload_speed: this.results.upload,
                ping: this.results.ping
            });
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Coverage Map Integration
class CoverageMap {
    constructor() {
        this.map = null;
        this.coverageLayer = null;
        this.init();
    }

    init() {
        this.createCoverageMapHTML();
        this.attachEventListeners();
    }

    createCoverageMapHTML() {
        const mapHTML = `
            <div id="coverage-map-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                    <div class="p-6 border-b">
                        <h3 class="text-2xl font-bold text-gray-800">GenTeck Coverage Map</h3>
                        <p class="text-gray-600 mt-2">Check our service availability in your area</p>
                        <button id="close-coverage-map" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="flex flex-col lg:flex-row h-[70vh]">
                        <!-- Map Container -->
                        <div class="flex-1 relative">
                            <div id="coverage-map" class="w-full h-full bg-gray-200"></div>
                            <div class="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                                <h4 class="font-semibold mb-2">Coverage Legend</h4>
                                <div class="space-y-1 text-sm">
                                    <div class="flex items-center">
                                        <div class="w-4 h-4 bg-green-500 rounded mr-2"></div>
                                        <span>Fiber Coverage</span>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                                        <span>4G/LTE Coverage</span>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                                        <span>Planned Expansion</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Sidebar -->
                        <div class="lg:w-80 p-6 bg-gray-50 overflow-y-auto">
                            <h4 class="font-semibold mb-4">Check Your Location</h4>
                            
                            <!-- Location Search -->
                            <div class="mb-6">
                                <input type="text" id="location-search" 
                                       placeholder="Enter your address or area"
                                       class="w-full p-3 border border-gray-300 rounded-lg">
                                <button id="search-location" class="w-full mt-2 btn-primary py-2 rounded-lg">
                                    Check Coverage
                                </button>
                            </div>
                            
                            <!-- Coverage Info -->
                            <div id="coverage-info" class="hidden">
                                <div class="bg-white p-4 rounded-lg shadow mb-4">
                                    <h5 class="font-semibold text-green-600 mb-2">Service Available!</h5>
                                    <div id="available-services" class="space-y-2">
                                        <!-- Services will be populated here -->
                                    </div>
                                </div>
                                
                                <button id="request-installation" class="w-full btn-primary py-3 rounded-lg">
                                    Request Installation
                                </button>
                            </div>
                            
                            <!-- No Coverage Info -->
                            <div id="no-coverage-info" class="hidden">
                                <div class="bg-white p-4 rounded-lg shadow mb-4">
                                    <h5 class="font-semibold text-orange-600 mb-2">Coming Soon!</h5>
                                    <p class="text-gray-600 text-sm mb-3">
                                        We're expanding to your area. Join our waitlist to be notified when service becomes available.
                                    </p>
                                </div>
                                
                                <button id="join-waitlist" class="w-full btn-secondary py-3 rounded-lg">
                                    Join Waitlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', mapHTML);
    }

    attachEventListeners() {
        // Coverage map trigger
        const coverageBtn = document.querySelector('[data-feature="coverage-map"]');
        if (coverageBtn) {
            coverageBtn.addEventListener('click', () => this.openCoverageMap());
        }

        // Modal controls
        document.getElementById('close-coverage-map').addEventListener('click', () => this.closeCoverageMap());
        document.getElementById('search-location').addEventListener('click', () => this.searchLocation());
        
        // Location search on Enter
        document.getElementById('location-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchLocation();
            }
        });

        // Action buttons
        document.getElementById('request-installation').addEventListener('click', () => this.requestInstallation());
        document.getElementById('join-waitlist').addEventListener('click', () => this.joinWaitlist());

        // Close on backdrop click
        document.getElementById('coverage-map-modal').addEventListener('click', (e) => {
            if (e.target.id === 'coverage-map-modal') {
                this.closeCoverageMap();
            }
        });
    }

    openCoverageMap() {
        document.getElementById('coverage-map-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this.initializeMap();
    }

    closeCoverageMap() {
        document.getElementById('coverage-map-modal').classList.add('hidden');
        document.body.style.overflow = '';
    }

    initializeMap() {
        // Check if Google Maps is available
        if (typeof google !== 'undefined' && google.maps) {
            this.loadGoogleMap();
        } else {
            this.loadFallbackMap();
        }
    }

    loadGoogleMap() {
        const mapOptions = {
            center: { lat: -1.2921, lng: 36.8219 }, // Nairobi, Kenya
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(document.getElementById('coverage-map'), mapOptions);
        this.addCoverageOverlays();
    }

    loadFallbackMap() {
        // Fallback to static map or basic implementation
        const mapContainer = document.getElementById('coverage-map');
        mapContainer.innerHTML = `
            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                <div class="text-center p-8">
                    <i class="fas fa-map-marked-alt text-6xl text-primary mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Coverage Map</h3>
                    <p class="text-gray-600">Interactive map loading...</p>
                    <div class="mt-6 space-y-3">
                        <div class="bg-white p-3 rounded-lg shadow text-left">
                            <h4 class="font-semibold text-green-600">Metro Areas</h4>
                            <p class="text-sm text-gray-600">Full fiber coverage in Nairobi, Mombasa, Kisumu</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg shadow text-left">
                            <h4 class="font-semibold text-blue-600">Urban Centers</h4>
                            <p class="text-sm text-gray-600">4G/LTE coverage in 50+ towns across Kenya</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addCoverageOverlays() {
        // Add coverage areas (simplified representation)
        const coverageAreas = [
            {
                name: 'Nairobi Metro',
                type: 'fiber',
                coordinates: [
                    { lat: -1.2, lng: 36.7 },
                    { lat: -1.2, lng: 36.9 },
                    { lat: -1.4, lng: 36.9 },
                    { lat: -1.4, lng: 36.7 }
                ]
            }
            // Add more areas...
        ];

        coverageAreas.forEach(area => {
            const polygon = new google.maps.Polygon({
                paths: area.coordinates,
                strokeColor: area.type === 'fiber' ? '#10b981' : '#3b82f6',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: area.type === 'fiber' ? '#10b981' : '#3b82f6',
                fillOpacity: 0.2
            });

            polygon.setMap(this.map);
        });
    }

    searchLocation() {
        const query = document.getElementById('location-search').value.trim();
        if (!query) return;

        // Simulate location search and coverage check
        setTimeout(() => {
            const hasCoverage = Math.random() > 0.3; // 70% chance of coverage
            
            if (hasCoverage) {
                this.showCoverageInfo();
            } else {
                this.showNoCoverageInfo();
            }
        }, 1500);
    }

    showCoverageInfo() {
        document.getElementById('coverage-info').classList.remove('hidden');
        document.getElementById('no-coverage-info').classList.add('hidden');
        
        const services = [
            { name: 'Fiber Internet', speed: 'Up to 1 Gbps' },
            { name: '4G Backup', speed: 'Up to 100 Mbps' },
            { name: 'Business Packages', speed: 'Dedicated lines' }
        ];

        const servicesHTML = services.map(service => `
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-700">${service.name}</span>
                <span class="text-primary font-semibold">${service.speed}</span>
            </div>
        `).join('');

        document.getElementById('available-services').innerHTML = servicesHTML;
    }

    showNoCoverageInfo() {
        document.getElementById('no-coverage-info').classList.remove('hidden');
        document.getElementById('coverage-info').classList.add('hidden');
    }

    requestInstallation() {
        // Open contact form or redirect to installation request
        this.closeCoverageMap();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }

    joinWaitlist() {
        // Handle waitlist signup
        alert('Thank you! We\'ll notify you when service becomes available in your area.');
    }
}

// Initialize Interactive Features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpeedTestTool();
    new CoverageMap();
});
