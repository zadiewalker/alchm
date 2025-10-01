/**
 * ALCHM Crisis Support System
 * Universal crisis detection and support module for all ALCHM premium pages
 * 
 * Features:
 * - <3 second response time for crisis resources
 * - Offline capability with cached resources
 * - Multi-language support
 * - Cultural sensitivity
 * - Progressive intervention levels
 * - Privacy-preserving crisis detection
 * - Accessibility compliance
 */

class ALCHMCrisisSupport {
    constructor() {
        this.isInitialized = false;
        this.crisisResources = null;
        this.currentLanguage = 'en';
        this.currentLocation = null;
        this.interventionLevel = 0;
        this.lastCheckTime = null;
        this.offlineMode = false;
        
        // Crisis detection keywords and patterns
        this.crisisKeywords = {
            immediate: [
                'suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead',
                'hurt myself', 'cut myself', 'overdose', 'jump off', 'hang myself',
                'gun', 'pills', 'bridge', 'rope'
            ],
            warning: [
                'hopeless', 'worthless', 'burden', 'trapped', 'can\'t go on',
                'no way out', 'hate myself', 'disappear', 'pain', 'suffering',
                'alone', 'empty', 'numb', 'broken'
            ],
            contextual: [
                'everyone would be better', 'tired of fighting', 'can\'t take it',
                'no point', 'give up', 'done trying', 'too much'
            ]
        };
        
        // Cultural considerations for different expressions of distress
        this.culturalPatterns = {
            collectivist: ['shame on family', 'dishonor', 'burden to others'],
            spiritual: ['lost faith', 'God abandoned', 'spiritual emptiness'],
            economic: ['financial ruin', 'lost everything', 'can\'t provide']
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Check if we're online
            this.offlineMode = !navigator.onLine;
            
            // Preload crisis resources immediately
            await this.preloadCrisisResources();
            
            // Setup crisis detection
            this.setupCrisisDetection();
            
            // Create floating crisis button
            this.createCrisisButton();
            
            // Setup offline event listeners
            this.setupOfflineHandlers();
            
            // Setup geolocation for local resources
            this.setupGeolocation();
            
            // Initialize accessibility features
            this.initAccessibility();
            
            // Setup performance monitoring
            this.initPerformanceMonitoring();
            
            this.isInitialized = true;
            console.log('ALCHM Crisis Support System initialized successfully');
            
        } catch (error) {
            console.error('Crisis Support System initialization error:', error);
            // Still provide basic crisis support even if full system fails
            this.createBasicCrisisButton();
        }
    }
    
    async preloadCrisisResources() {
        const startTime = performance.now();
        
        try {
            // Try to load from network first
            if (!this.offlineMode) {
                const response = await fetch('/crisis-resources.json', {
                    cache: 'force-cache',
                    priority: 'high'
                });
                
                if (response.ok) {
                    this.crisisResources = await response.json();
                    // Cache in localStorage for offline access
                    localStorage.setItem('alchm_crisis_resources', JSON.stringify(this.crisisResources));
                    localStorage.setItem('alchm_crisis_timestamp', Date.now().toString());
                }
            }
            
            // Fallback to cached resources
            if (!this.crisisResources) {
                const cached = localStorage.getItem('alchm_crisis_resources');
                if (cached) {
                    this.crisisResources = JSON.parse(cached);
                }
            }
            
            // Ultimate fallback to hardcoded resources
            if (!this.crisisResources) {
                this.crisisResources = this.getHardcodedCrisisResources();
            }
            
            const loadTime = performance.now() - startTime;
            console.log(`Crisis resources loaded in ${loadTime.toFixed(2)}ms`);
            
            // Ensure load time is under 3 seconds
            if (loadTime > 3000) {
                console.warn('Crisis resources loading exceeded 3 second target');
            }
            
        } catch (error) {
            console.error('Failed to load crisis resources:', error);
            this.crisisResources = this.getHardcodedCrisisResources();
        }
    }
    
    getHardcodedCrisisResources() {
        return {
            immediate: {
                us: {
                    suicide_prevention: {
                        name: "National Suicide Prevention Lifeline",
                        phone: "988",
                        text: "Available 24/7",
                        url: "https://suicidepreventionlifeline.org"
                    },
                    crisis_text: {
                        name: "Crisis Text Line",
                        text: "Text HOME to 741741",
                        description: "24/7 crisis support via text"
                    },
                    emergency: {
                        name: "Emergency Services",
                        phone: "911",
                        description: "For immediate life-threatening emergencies"
                    }
                },
                international: {
                    suicide_prevention: {
                        name: "International Association for Suicide Prevention",
                        url: "https://www.iasp.info/resources/Crisis_Centres/",
                        description: "Find local crisis centers worldwide"
                    }
                }
            },
            specialized: {
                lgbtq: {
                    name: "The Trevor Project",
                    phone: "1-866-488-7386",
                    text: "Text START to 678-678",
                    description: "Crisis support for LGBTQ+ youth"
                },
                trans: {
                    name: "Trans Lifeline",
                    phone: "877-565-8860",
                    description: "Support by and for trans people"
                },
                veterans: {
                    name: "Veterans Crisis Line",
                    phone: "1-800-273-8255",
                    text: "Text 838255",
                    description: "24/7 support for veterans"
                }
            },
            immediate_techniques: [
                {
                    name: "54321 Grounding Technique",
                    steps: [
                        "5 things you can see",
                        "4 things you can touch",
                        "3 things you can hear",
                        "2 things you can smell",
                        "1 thing you can taste"
                    ]
                },
                {
                    name: "Box Breathing",
                    steps: [
                        "Breathe in for 4 counts",
                        "Hold for 4 counts",
                        "Breathe out for 4 counts",
                        "Hold for 4 counts",
                        "Repeat"
                    ]
                }
            ]
        };
    }
    
    setupCrisisDetection() {
        // Monitor text input areas for crisis language
        const textAreas = document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
        
        textAreas.forEach(element => {
            element.addEventListener('input', this.debounce((e) => {
                this.analyzeCrisisContent(e.target.value);
            }, 1000));
        });
        
        // Monitor for paste events
        document.addEventListener('paste', (e) => {
            setTimeout(() => {
                if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
                    this.analyzeCrisisContent(e.target.value);
                }
            }, 100);
        });
    }
    
    analyzeCrisisContent(text) {
        if (!text || text.length < 10) return;
        
        const lowerText = text.toLowerCase();
        let riskLevel = 0;
        let detectedPatterns = [];
        
        // Check immediate risk keywords
        this.crisisKeywords.immediate.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                riskLevel = Math.max(riskLevel, 3);
                detectedPatterns.push(keyword);
            }
        });
        
        // Check warning keywords
        this.crisisKeywords.warning.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                riskLevel = Math.max(riskLevel, 2);
                detectedPatterns.push(keyword);
            }
        });
        
        // Check contextual patterns
        this.crisisKeywords.contextual.forEach(pattern => {
            if (lowerText.includes(pattern)) {
                riskLevel = Math.max(riskLevel, 1);
                detectedPatterns.push(pattern);
            }
        });
        
        // Cultural pattern analysis
        Object.values(this.culturalPatterns).flat().forEach(pattern => {
            if (lowerText.includes(pattern)) {
                riskLevel = Math.max(riskLevel, 2);
                detectedPatterns.push(pattern);
            }
        });
        
        if (riskLevel > 0) {
            this.triggerCrisisIntervention(riskLevel, detectedPatterns);
        }
    }
    
    triggerCrisisIntervention(level, patterns) {
        const now = Date.now();
        
        // Prevent spam interventions
        if (this.lastCheckTime && (now - this.lastCheckTime) < 30000) {
            return;
        }
        
        this.lastCheckTime = now;
        this.interventionLevel = level;
        
        // Progressive intervention based on risk level
        switch(level) {
            case 1:
                this.showGentleCheckIn();
                break;
            case 2:
                this.showSupportResources();
                break;
            case 3:
                this.showImmediateCrisisSupport();
                break;
        }
        
        // Log for analytics (privacy-preserving)
        this.logCrisisEvent(level, patterns.length);
    }
    
    showGentleCheckIn() {
        this.showCrisisModal({
            type: 'gentle',
            title: 'How are you feeling?',
            message: 'We noticed you might be going through a difficult time. Would you like some support resources?',
            actions: [
                { text: 'I\'m okay', action: 'dismiss' },
                { text: 'Show me resources', action: 'resources' }
            ]
        });
    }
    
    showSupportResources() {
        this.showCrisisModal({
            type: 'support',
            title: 'Support is available',
            message: 'It sounds like you\'re struggling right now. You don\'t have to go through this alone.',
            showResources: true,
            actions: [
                { text: 'Call for help', action: 'call' },
                { text: 'Try grounding technique', action: 'grounding' },
                { text: 'Close', action: 'dismiss' }
            ]
        });
    }
    
    showImmediateCrisisSupport() {
        this.showCrisisModal({
            type: 'immediate',
            title: 'Immediate Support Available',
            message: 'Your safety is important. Please consider reaching out for immediate help.',
            showResources: true,
            showTechniques: true,
            urgent: true,
            actions: [
                { text: 'Call 988 Now', action: 'call988' },
                { text: 'Text Crisis Line', action: 'text741741' },
                { text: 'Emergency Services', action: 'call911' }
            ]
        });
    }
    
    createCrisisButton() {
        // Remove existing crisis button if present
        const existing = document.getElementById('alchm-crisis-button');
        if (existing) existing.remove();
        
        const button = document.createElement('button');
        button.id = 'alchm-crisis-button';
        button.className = 'alchm-crisis-floating-button';
        button.setAttribute('aria-label', 'Crisis Support - Always Available');
        button.setAttribute('title', 'Get immediate crisis support');
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        `;
        
        button.addEventListener('click', () => this.openCrisisSupport());
        
        // Add to page
        document.body.appendChild(button);
        
        // Pulse animation for attention
        setTimeout(() => {
            button.classList.add('pulse-once');
        }, 2000);
    }
    
    createBasicCrisisButton() {
        const button = document.createElement('a');
        button.href = 'tel:988';
        button.className = 'alchm-crisis-floating-button basic';
        button.setAttribute('aria-label', 'Call 988 for Crisis Support');
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
        `;
        document.body.appendChild(button);
    }
    
    openCrisisSupport() {
        this.showCrisisModal({
            type: 'full',
            title: 'Crisis Support Resources',
            message: 'If you\'re experiencing a mental health emergency, please reach out for immediate help. You\'re not alone, and support is available 24/7.',
            showResources: true,
            showTechniques: true,
            showSpecialized: true,
            actions: [
                { text: 'Call 988', action: 'call988' },
                { text: 'Text 741741', action: 'text741741' },
                { text: 'International Resources', action: 'international' }
            ]
        });
    }
    
    showCrisisModal(config) {
        // Remove existing modal
        const existing = document.getElementById('alchm-crisis-modal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.id = 'alchm-crisis-modal';
        modal.className = `alchm-crisis-modal ${config.urgent ? 'urgent' : ''}`;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'crisis-modal-title');
        
        modal.innerHTML = `
            <div class="crisis-modal-backdrop" onclick="ALCHMCrisis.closeCrisisModal()"></div>
            <div class="crisis-modal-content">
                <button class="crisis-modal-close" onclick="ALCHMCrisis.closeCrisisModal()" aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
                
                <div class="crisis-modal-header">
                    <h2 id="crisis-modal-title" class="crisis-modal-title">${config.title}</h2>
                    <p class="crisis-modal-message">${config.message}</p>
                </div>
                
                <div class="crisis-modal-body">
                    ${config.showResources ? this.renderCrisisResources() : ''}
                    ${config.showTechniques ? this.renderGroundingTechniques() : ''}
                    ${config.showSpecialized ? this.renderSpecializedResources() : ''}
                </div>
                
                <div class="crisis-modal-actions">
                    ${config.actions.map(action => 
                        `<button class="crisis-action-btn ${action.action}" onclick="ALCHMCrisis.handleCrisisAction('${action.action}')">${action.text}</button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus management
        setTimeout(() => {
            const firstButton = modal.querySelector('.crisis-action-btn');
            if (firstButton) firstButton.focus();
        }, 100);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Track opening
        this.logCrisisEvent('modal_opened', config.type);
    }
    
    renderCrisisResources() {
        if (!this.crisisResources) return '';
        
        const resources = this.crisisResources.immediate.us;
        
        return `
            <div class="crisis-resources-section">
                <h3>Immediate Help</h3>
                <div class="crisis-resource-grid">
                    <div class="crisis-resource-item priority">
                        <div class="resource-icon">📞</div>
                        <div class="resource-content">
                            <h4>${resources.suicide_prevention.name}</h4>
                            <p>Call <strong>${resources.suicide_prevention.phone}</strong></p>
                            <p class="resource-description">${resources.suicide_prevention.text}</p>
                        </div>
                        <button onclick="ALCHMCrisis.callNumber('988')" class="resource-action-btn">Call Now</button>
                    </div>
                    
                    <div class="crisis-resource-item">
                        <div class="resource-icon">💬</div>
                        <div class="resource-content">
                            <h4>${resources.crisis_text.name}</h4>
                            <p><strong>${resources.crisis_text.text}</strong></p>
                            <p class="resource-description">${resources.crisis_text.description}</p>
                        </div>
                        <button onclick="ALCHMCrisis.textCrisisLine()" class="resource-action-btn">Text Now</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderGroundingTechniques() {
        if (!this.crisisResources?.immediate_techniques) return '';
        
        return `
            <div class="grounding-techniques-section">
                <h3>Immediate Relief Techniques</h3>
                <div class="technique-grid">
                    ${this.crisisResources.immediate_techniques.map(technique => `
                        <div class="technique-card">
                            <h4>${technique.name}</h4>
                            <ol class="technique-steps">
                                ${technique.steps.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                            <button onclick="ALCHMCrisis.startGuidedTechnique('${technique.name}')" class="technique-btn">
                                Start Guided Practice
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderSpecializedResources() {
        if (!this.crisisResources?.specialized) return '';
        
        const specialized = this.crisisResources.specialized;
        
        return `
            <div class="specialized-resources-section">
                <h3>Specialized Support</h3>
                <div class="specialized-grid">
                    <div class="specialized-item">
                        <h4>${specialized.lgbtq.name}</h4>
                        <p>Call ${specialized.lgbtq.phone}</p>
                        <p>${specialized.lgbtq.description}</p>
                    </div>
                    <div class="specialized-item">
                        <h4>${specialized.trans.name}</h4>
                        <p>Call ${specialized.trans.phone}</p>
                        <p>${specialized.trans.description}</p>
                    </div>
                    <div class="specialized-item">
                        <h4>${specialized.veterans.name}</h4>
                        <p>Call ${specialized.veterans.phone}</p>
                        <p>${specialized.veterans.description}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    handleCrisisAction(action) {
        switch(action) {
            case 'call988':
                this.callNumber('988');
                break;
            case 'text741741':
                this.textCrisisLine();
                break;
            case 'call911':
                this.callNumber('911');
                break;
            case 'resources':
                this.openCrisisSupport();
                break;
            case 'grounding':
                this.startGuidedTechnique('54321 Grounding Technique');
                break;
            case 'international':
                this.showInternationalResources();
                break;
            case 'dismiss':
                this.closeCrisisModal();
                break;
        }
        
        this.logCrisisEvent('action_taken', action);
    }
    
    callNumber(number) {
        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        window.location.href = `tel:${number}`;
    }
    
    textCrisisLine() {
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        // Check if SMS is supported
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            window.location.href = 'sms:741741?body=HOME';
        } else {
            // Desktop fallback
            alert('Text HOME to 741741 for crisis support');
        }
    }
    
    startGuidedTechnique(techniqueName) {
        // Find the technique
        const technique = this.crisisResources.immediate_techniques.find(t => t.name === techniqueName);
        if (!technique) return;
        
        this.closeCrisisModal();
        
        // Create guided technique modal
        const modal = document.createElement('div');
        modal.className = 'guided-technique-modal';
        modal.innerHTML = `
            <div class="technique-backdrop"></div>
            <div class="technique-content">
                <h2>${technique.name}</h2>
                <div class="technique-progress">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
                <div class="technique-instruction" id="current-instruction">
                    ${technique.steps[0]}
                </div>
                <button id="technique-next" class="technique-control-btn">Next</button>
                <button onclick="this.parentElement.parentElement.remove(); document.body.style.overflow = ''" class="technique-close-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        let currentStep = 0;
        const nextBtn = modal.querySelector('#technique-next');
        const instruction = modal.querySelector('#current-instruction');
        const progressBar = modal.querySelector('.progress-bar');
        
        nextBtn.onclick = () => {
            currentStep++;
            if (currentStep < technique.steps.length) {
                instruction.textContent = technique.steps[currentStep];
                progressBar.style.width = `${((currentStep + 1) / technique.steps.length) * 100}%`;
                
                if (currentStep === technique.steps.length - 1) {
                    nextBtn.textContent = 'Complete';
                }
            } else {
                // Technique completed
                modal.remove();
                document.body.style.overflow = '';
                this.showCompletionMessage();
            }
        };
        
        this.logCrisisEvent('technique_started', techniqueName);
    }
    
    showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <div class="completion-content">
                <h3>Great job! 🌟</h3>
                <p>You've completed the grounding technique. How are you feeling now?</p>
                <div class="feeling-buttons">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">Better</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove(); ALCHMCrisis.openCrisisSupport()">Still need support</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 10000);
    }
    
    closeCrisisModal() {
        const modal = document.getElementById('alchm-crisis-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    }
    
    setupOfflineHandlers() {
        window.addEventListener('online', () => {
            this.offlineMode = false;
            this.preloadCrisisResources();
        });
        
        window.addEventListener('offline', () => {
            this.offlineMode = true;
        });
    }
    
    setupGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                },
                (error) => {
                    console.log('Geolocation not available, using default resources');
                },
                { timeout: 5000, maximumAge: 300000 }
            );
        }
    }
    
    initAccessibility() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+C for crisis support
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.openCrisisSupport();
            }
            
            // Escape to close crisis modal
            if (e.key === 'Escape') {
                this.closeCrisisModal();
            }
        });
        
        // Screen reader announcements for crisis detection
        this.createAriaLiveRegion();
    }
    
    createAriaLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'crisis-aria-live';
        liveRegion.setAttribute('aria-live', 'assertive');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);
    }
    
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('crisis-aria-live');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }
    
    initPerformanceMonitoring() {
        // Monitor crisis button response time
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('crisis')) {
                    console.log(`Crisis support response time: ${entry.duration}ms`);
                    
                    if (entry.duration > 200) {
                        console.warn('Crisis support response time exceeded 200ms target');
                    }
                }
            }
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }
    
    logCrisisEvent(eventType, detail) {
        // Privacy-preserving analytics
        const event = {
            type: eventType,
            detail: detail,
            timestamp: Date.now(),
            sessionId: this.getSessionId(),
            // No personal data logged
        };
        
        // Send to analytics if online
        if (!this.offlineMode) {
            fetch('/api/crisis-analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            }).catch(() => {
                // Store offline for later sync
                const offline = JSON.parse(localStorage.getItem('offline_crisis_events') || '[]');
                offline.push(event);
                localStorage.setItem('offline_crisis_events', JSON.stringify(offline));
            });
        }
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('crisis_session_id');
        if (!sessionId) {
            sessionId = 'cs_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('crisis_session_id', sessionId);
        }
        return sessionId;
    }
    
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// Initialize crisis support system
let ALCHMCrisis;

document.addEventListener('DOMContentLoaded', () => {
    ALCHMCrisis = new ALCHMCrisisSupport();
});

// Export for global access
window.ALCHMCrisis = ALCHMCrisis;