/**
 * ALCHM Demo Platform Automation Scripts
 * Handles demo interactions, data visualization, and presentation automation
 */

class ALCHMDemoAutomation {
    constructor() {
        this.demoData = null;
        this.activeDemo = null;
        this.animationQueue = [];
        this.presentationMode = false;
        
        this.initializeDemoSystem();
    }
    
    async initializeDemoSystem() {
        try {
            // Load demo data
            const response = await fetch('/demo/assets/demo-data.json');
            this.demoData = await response.json();
            
            // Initialize event listeners
            this.setupEventListeners();
            
            // Initialize presentation controls
            this.setupPresentationControls();
            
            console.log('ALCHM Demo System Initialized');
        } catch (error) {
            console.error('Failed to initialize demo system:', error);
        }
    }
    
    setupEventListeners() {
        // Demo navigation
        document.addEventListener('demo-navigate', (event) => {
            this.navigateToDemo(event.detail.demo, event.detail.audience);
        });
        
        // Presentation mode toggle
        document.addEventListener('keydown', (event) => {
            if (event.key === 'F11' || (event.key === 'p' && event.ctrlKey)) {
                event.preventDefault();
                this.togglePresentationMode();
            }
            
            // Demo shortcuts
            if (this.presentationMode) {
                this.handlePresentationKeyboard(event);
            }
        });
        
        // Auto-scroll for presentations
        document.addEventListener('scroll', () => {
            if (this.presentationMode) {
                this.updatePresentationProgress();
            }
        });
    }
    
    setupPresentationControls() {
        // Create presentation control panel
        const controlPanel = document.createElement('div');
        controlPanel.id = 'demo-control-panel';
        controlPanel.className = 'fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-lg rounded-lg p-4 space-y-2';
        controlPanel.style.display = 'none';
        
        controlPanel.innerHTML = `
            <div class="text-white text-sm font-medium mb-3">Demo Controls</div>
            <button id="toggle-presentation" class="demo-control-btn">Toggle Fullscreen</button>
            <button id="next-section" class="demo-control-btn">Next Section</button>
            <button id="prev-section" class="demo-control-btn">Previous Section</button>
            <button id="reset-demo" class="demo-control-btn">Reset Demo</button>
            <div class="demo-progress-bar">
                <div id="demo-progress" class="h-2 bg-purple-500 rounded transition-all duration-300" style="width: 0%"></div>
            </div>
        `;
        
        document.body.appendChild(controlPanel);
        
        // Add control panel styles
        const style = document.createElement('style');
        style.textContent = `
            .demo-control-btn {
                display: block;
                width: 100%;
                padding: 8px 12px;
                background: rgba(139, 92, 246, 0.2);
                color: white;
                border: 1px solid rgba(139, 92, 246, 0.3);
                rounded: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .demo-control-btn:hover {
                background: rgba(139, 92, 246, 0.4);
            }
            .demo-progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                overflow: hidden;
                margin-top: 12px;
            }
        `;
        document.head.appendChild(style);
        
        // Bind control events
        this.bindControlEvents();
    }
    
    bindControlEvents() {
        document.getElementById('toggle-presentation')?.addEventListener('click', () => {
            this.togglePresentationMode();
        });
        
        document.getElementById('next-section')?.addEventListener('click', () => {
            this.navigateToNextSection();
        });
        
        document.getElementById('prev-section')?.addEventListener('click', () => {
            this.navigateToPreviousSection();
        });
        
        document.getElementById('reset-demo')?.addEventListener('click', () => {
            this.resetDemo();
        });
    }
    
    navigateToDemo(demo, audience) {
        this.activeDemo = { demo, audience };
        
        // Update URL without page reload
        const url = new URL(window.location);
        url.searchParams.set('demo', demo);
        url.searchParams.set('audience', audience);
        window.history.pushState({}, '', url);
        
        // Trigger demo-specific animations and interactions
        this.initializeDemoAnimations(demo, audience);
        
        console.log(`Navigated to ${demo} demo for ${audience} audience`);
    }
    
    initializeDemoAnimations(demo, audience) {
        // Clear existing animations
        this.animationQueue = [];
        
        switch (demo) {
            case 'crisis':
                this.initializeCrisisDemo();
                break;
            case 'mobile':
                this.initializeMobileDemo();
                break;
            case 'ai':
                this.initializeAIDemo();
                break;
            case 'cultural':
                this.initializeCulturalDemo();
                break;
            default:
                this.initializeGeneralDemo();
        }
        
        // Execute animations
        this.executeAnimationQueue();
    }
    
    initializeCrisisDemo() {
        this.animationQueue.push(
            () => this.animateElement('.crisis-level-indicator', 'slideInRight'),
            () => this.simulateTyping('#crisisInput', this.demoData?.sample_entries?.crisis || 'Sample crisis text'),
            () => this.animateElement('.khepera-response', 'fadeInUp'),
            () => this.highlightElement('.crisis-resources', 2000)
        );
    }
    
    initializeMobileDemo() {
        this.animationQueue.push(
            () => this.animateElement('.mobile-frame', 'zoomIn'),
            () => this.simulateDeviceInteraction(),
            () => this.animateElement('.performance-metrics', 'fadeInUp'),
            () => this.highlightAccessibilityFeatures()
        );
    }
    
    initializeAIDemo() {
        this.animationQueue.push(
            () => this.animateElement('.ai-brain', 'pulse'),
            () => this.simulateEmotionalAnalysis(),
            () => this.animateInsightsGeneration(),
            () => this.updatePredictionCharts()
        );
    }
    
    initializeCulturalDemo() {
        this.animationQueue.push(
            () => this.animateElement('.community-selector', 'fadeInUp'),
            () => this.highlightCulturalFeatures(),
            () => this.simulateCulturalResponse(),
            () => this.showHealingTraditions()
        );
    }
    
    executeAnimationQueue() {
        let delay = 0;
        this.animationQueue.forEach((animation, index) => {
            setTimeout(() => {
                animation();
            }, delay);
            delay += 800; // 800ms between animations
        });
    }
    
    animateElement(selector, animationType) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        const animations = {
            fadeInUp: 'animate__animated animate__fadeInUp',
            slideInRight: 'animate__animated animate__slideInRight', 
            zoomIn: 'animate__animated animate__zoomIn',
            pulse: 'animate__animated animate__pulse animate__infinite'
        };
        
        element.className += ` ${animations[animationType] || animations.fadeInUp}`;
        
        setTimeout(() => {
            element.className = element.className.replace(/animate__\w+/g, '').trim();
        }, 1000);
    }
    
    simulateTyping(selector, text, speed = 50) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        element.value = '';
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.value += text[index];
                index++;
                
                // Trigger input events for reactive frameworks
                element.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }
    
    highlightElement(selector, duration = 1000) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        element.style.outline = '3px solid #8B5CF6';
        element.style.outlineOffset = '4px';
        element.style.transition = 'outline 0.3s ease';
        
        setTimeout(() => {
            element.style.outline = 'none';
        }, duration);
    }
    
    simulateDeviceInteraction() {
        const mobileFrame = document.querySelector('.mobile-frame');
        if (!mobileFrame) return;
        
        // Add interaction class
        mobileFrame.classList.add('active');
        
        setTimeout(() => {
            mobileFrame.classList.remove('active');
        }, 2000);
    }
    
    simulateEmotionalAnalysis() {
        // Simulate AI analysis process
        const analysisSteps = [
            'Processing natural language...',
            'Identifying emotional patterns...',
            'Analyzing cultural context...',
            'Generating insights...',
            'Preparing response...'
        ];
        
        const statusElement = document.querySelector('.ai-status');
        if (!statusElement) return;
        
        let stepIndex = 0;
        const stepInterval = setInterval(() => {
            if (stepIndex < analysisSteps.length) {
                statusElement.textContent = analysisSteps[stepIndex];
                stepIndex++;
            } else {
                clearInterval(stepInterval);
                statusElement.textContent = 'Analysis complete';
            }
        }, 600);
    }
    
    animateInsightsGeneration() {
        const insightCards = document.querySelectorAll('.insight-card');
        insightCards.forEach((card, index) => {
            setTimeout(() => {
                this.animateElement(card, 'fadeInUp');
            }, index * 200);
        });
    }
    
    updatePredictionCharts() {
        // Animate chart updates
        const chartElements = document.querySelectorAll('[id$="Chart"]');
        chartElements.forEach(chart => {
            if (chart && typeof Chart !== 'undefined') {
                const chartInstance = Chart.getChart(chart);
                if (chartInstance) {
                    chartInstance.update('active');
                }
            }
        });
    }
    
    highlightCulturalFeatures() {
        const culturalElements = document.querySelectorAll('.cultural-card, .healing-tradition');
        culturalElements.forEach((element, index) => {
            setTimeout(() => {
                this.highlightElement(element, 1500);
            }, index * 300);
        });
    }
    
    simulateCulturalResponse() {
        const responseContainer = document.querySelector('.cultural-response');
        if (!responseContainer) return;
        
        // Simulate culturally-aware response generation
        const responses = this.demoData?.cultural_responses || {};
        const communities = ['bipoc', 'lgbtq', 'indigenous', 'youth', 'elder'];
        
        communities.forEach((community, index) => {
            setTimeout(() => {
                this.highlightElement(`.community-${community}`, 1000);
            }, index * 800);
        });
    }
    
    showHealingTraditions() {
        const traditions = document.querySelectorAll('.healing-tradition');
        traditions.forEach((tradition, index) => {
            setTimeout(() => {
                tradition.style.transform = 'translateX(5px)';
                tradition.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.3)';
                
                setTimeout(() => {
                    tradition.style.transform = 'translateX(0)';
                    tradition.style.boxShadow = 'none';
                }, 1000);
            }, index * 400);
        });
    }
    
    togglePresentationMode() {
        this.presentationMode = !this.presentationMode;
        const controlPanel = document.getElementById('demo-control-panel');
        
        if (this.presentationMode) {
            // Enter presentation mode
            document.documentElement.requestFullscreen?.();
            controlPanel.style.display = 'block';
            document.body.classList.add('presentation-mode');
            
            // Add presentation styles
            this.addPresentationStyles();
        } else {
            // Exit presentation mode
            document.exitFullscreen?.();
            controlPanel.style.display = 'none';
            document.body.classList.remove('presentation-mode');
            
            // Remove presentation styles
            this.removePresentationStyles();
        }
    }
    
    addPresentationStyles() {
        const style = document.createElement('style');
        style.id = 'presentation-styles';
        style.textContent = `
            .presentation-mode {
                cursor: none;
            }
            .presentation-mode * {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .presentation-mode .demo-card:hover,
            .presentation-mode .user-journey-step:hover {
                transform: translateY(-10px) scale(1.02);
            }
        `;
        document.head.appendChild(style);
    }
    
    removePresentationStyles() {
        const style = document.getElementById('presentation-styles');
        if (style) {
            style.remove();
        }
    }
    
    handlePresentationKeyboard(event) {
        switch (event.key) {
            case 'ArrowRight':
            case ' ':
                event.preventDefault();
                this.navigateToNextSection();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.navigateToPreviousSection();
                break;
            case 'Home':
                event.preventDefault();
                this.resetDemo();
                break;
            case 'Escape':
                event.preventDefault();
                this.togglePresentationMode();
                break;
        }
    }
    
    navigateToNextSection() {
        const sections = document.querySelectorAll('section, .glass-morphism');
        const currentScroll = window.scrollY;
        
        let nextSection = null;
        for (const section of sections) {
            if (section.offsetTop > currentScroll + 100) {
                nextSection = section;
                break;
            }
        }
        
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    navigateToPreviousSection() {
        const sections = Array.from(document.querySelectorAll('section, .glass-morphism')).reverse();
        const currentScroll = window.scrollY;
        
        let prevSection = null;
        for (const section of sections) {
            if (section.offsetTop < currentScroll - 100) {
                prevSection = section;
                break;
            }
        }
        
        if (prevSection) {
            prevSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    resetDemo() {
        // Reset all demo states
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Clear any active animations
        this.animationQueue = [];
        
        // Reset form elements
        document.querySelectorAll('input, textarea, select').forEach(element => {
            if (element.type !== 'button' && element.type !== 'submit') {
                element.value = '';
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        
        // Reset demo-specific states
        this.resetDemoStates();
    }
    
    resetDemoStates() {
        // Reset crisis demo
        const crisisInput = document.getElementById('crisisInput');
        if (crisisInput) {
            crisisInput.value = '';
        }
        
        // Reset AI demo
        const journalInput = document.querySelector('[x-model="journalInput"]');
        if (journalInput) {
            journalInput.value = '';
        }
        
        // Reset mobile demo
        const mobileFrame = document.querySelector('.mobile-frame');
        if (mobileFrame) {
            mobileFrame.classList.remove('active');
        }
        
        // Reset cultural demo
        const communitySelectors = document.querySelectorAll('.community-selector');
        communitySelectors.forEach(selector => {
            selector.classList.remove('active');
        });
    }
    
    updatePresentationProgress() {
        const progressBar = document.getElementById('demo-progress');
        if (!progressBar) return;
        
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = Math.min(100, (scrolled / documentHeight) * 100);
        
        progressBar.style.width = `${progress}%`;
    }
    
    // Public API methods
    startAutomatedDemo(demoType, audienceType) {
        this.navigateToDemo(demoType, audienceType);
        
        // Auto-advance through demo sections
        this.automatedDemoInterval = setInterval(() => {
            this.navigateToNextSection();
        }, 10000); // 10 seconds per section
    }
    
    stopAutomatedDemo() {
        if (this.automatedDemoInterval) {
            clearInterval(this.automatedDemoInterval);
            this.automatedDemoInterval = null;
        }
    }
    
    exportDemoData() {
        // Export demo interaction data for analysis
        const data = {
            timestamp: new Date().toISOString(),
            activeDemo: this.activeDemo,
            presentationMode: this.presentationMode,
            demoData: this.demoData,
            userInteractions: this.trackUserInteractions()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `alchm-demo-data-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
    
    trackUserInteractions() {
        // Return basic interaction metrics
        return {
            timeOnPage: Date.now() - this.initTime,
            sectionsViewed: this.getSectionViews(),
            demosAccessed: this.getAccessedDemos(),
            interactionCount: this.getInteractionCount()
        };
    }
    
    getSectionViews() {
        // Track which sections have been scrolled into view
        const sections = document.querySelectorAll('section, .glass-morphism');
        return Array.from(sections).filter(section => {
            const rect = section.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        }).length;
    }
    
    getAccessedDemos() {
        return this.accessedDemos || [];
    }
    
    getInteractionCount() {
        return this.interactionCount || 0;
    }
}

// Initialize the demo automation system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.alchmDemo = new ALCHMDemoAutomation();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ALCHMDemoAutomation;
}