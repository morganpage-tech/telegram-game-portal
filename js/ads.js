// Ad Management System for Telegram Game Portal
// Supports Monetag SDK with easy ad network switching

class AdManager {
    constructor() {
        // CONFIGURATION: Replace with your actual zone IDs after signing up
        this.config = {
            // Monetag Zone IDs (get these from https://publishers.monetag.com/)
            zones: {
                interstitial: 'INTERSTITIAL_ZONE_ID',  // Between games
                banner: 'BANNER_ZONE_ID',              // In portal
                rewarded: 'REWARDED_ZONE_ID'            // For coin rewards (optional)
            },
            // Ad frequency settings
            frequency: {
                interstitial: 3,        // Show every N games
                banner: 'always',       // Always show banners
                rewarded: 'optional'     // User can choose to watch
            },
            // Time-based settings (in minutes)
            intervals: {
                minTimeBetweenAds: 1,    // Minimum time between interstitials
                rewardedCooldown: 5       // Cooldown for rewarded ads
            }
        };

        // State tracking
        this.state = {
            gamesPlayed: 0,
            lastAdTime: Date.now(),
            lastRewardedAdTime: 0,
            isAdShowing: false,
            adsEnabled: true
        };

        // Ad network selection (can be swapped)
        this.adNetwork = 'monetag'; // 'monetag' | 'richads' | 'custom'
        this.sdkLoaded = false;

        this.init();
    }

    async init() {
        console.log('📺 Ad Manager initializing...');

        // Load ad network SDK
        switch (this.adNetwork) {
            case 'monetag':
                await this.loadMonetagSDK();
                break;
            case 'richads':
                await this.loadRichAdsSDK();
                break;
            case 'custom':
                console.log('Using custom ad network');
                this.sdkLoaded = true;
                break;
        }

        // Create ad containers in DOM
        this.createAdContainers();

        // Set up event listeners
        this.setupEventListeners();

        console.log('✅ Ad Manager initialized');
    }

    // Monetag SDK Integration
    async loadMonetagSDK() {
        return new Promise((resolve) => {
            if (document.querySelector(`script[data-zone="${this.config.zones.interstitial}"]`)) {
                this.sdkLoaded = true;
                resolve();
                return;
            }

            // Load SDK script
            const script = document.createElement('script');
            script.src = 'https://domain.com/sdk.js';
            script.dataset.zone = this.config.zones.interstitial;
            script.dataset.sdk = `show_${this.config.zones.interstitial}`;
            script.onload = () => {
                this.sdkLoaded = true;
                console.log('✅ Monetag SDK loaded');
                resolve();
            };
            script.onerror = () => {
                console.warn('⚠️ Monetag SDK failed to load, ads will be disabled');
                this.sdkLoaded = false;
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    // RichAds SDK Integration (placeholder for future)
    async loadRichAdsSDK() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://www.richads.com/richads.js';
            script.dataset.publisher = 'YOUR_PUBLISHER_ID';
            script.dataset.widget = 'YOUR_WIDGET_ID';
            script.onload = () => {
                this.sdkLoaded = true;
                console.log('✅ RichAds SDK loaded');
                resolve();
            };
            script.onerror = () => {
                console.warn('⚠️ RichAds SDK failed to load');
                this.sdkLoaded = false;
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    createAdContainers() {
        // Banner ad container (in header)
        if (!document.getElementById('ad-banner')) {
            const bannerContainer = document.createElement('div');
            bannerContainer.id = 'ad-banner';
            bannerContainer.className = 'ad-banner';
            bannerContainer.innerHTML = '<div class="ad-placeholder">📺 Advertisement</div>';
            const header = document.querySelector('header');
            if (header) {
                header.insertAdjacentElement('afterend', bannerContainer);
            }
        }

        // Interstitial ad container (overlay)
        if (!document.getElementById('ad-interstitial')) {
            const interstitialContainer = document.createElement('div');
            interstitialContainer.id = 'ad-interstitial';
            interstitialContainer.className = 'ad-interstitial hidden';
            interstitialContainer.innerHTML = `
                <div class="ad-overlay">
                    <div class="ad-content">
                        <div class="ad-close-btn" onclick="adManager.closeInterstitial()">×</div>
                        <div id="ad-interstitial-slot"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(interstitialContainer);
        }
    }

    setupEventListeners() {
        // Listen for game start/end events
        document.addEventListener('gameStarted', () => {
            this.state.gamesPlayed++;
            this.checkInterstitialTrigger();
        });

        document.addEventListener('gameEnded', () => {
            this.checkInterstitialTrigger();
        });

        // Listen for portal navigation
        document.addEventListener('navigated', (e) => {
            if (e.detail?.view === 'profile') {
                this.showBannerAd();
            }
        });
    }

    // Show interstitial ad between games
    async showInterstitial() {
        if (!this.state.adsEnabled || !this.sdkLoaded || this.state.isAdShowing) {
            return false;
        }

        // Check frequency cap
        if (this.state.gamesPlayed < this.config.frequency.interstitial) {
            return false;
        }

        // Check time since last ad
        const timeSinceLastAd = (Date.now() - this.state.lastAdTime) / 1000 / 60;
        if (timeSinceLastAd < this.config.intervals.minTimeBetweenAds) {
            return false;
        }

        try {
            this.state.isAdShowing = true;
            const container = document.getElementById('ad-interstitial');
            const slot = document.getElementById('ad-interstitial-slot');

            container.classList.remove('hidden');

            // Call ad network SDK
            switch (this.adNetwork) {
                case 'monetag':
                    if (window[`show_${this.config.zones.interstitial}`]) {
                        await window[`show_${this.config.zones.interstitial}`]({
                            type: 'inApp',
                            inAppSettings: {
                                frequency: this.config.frequency.interstitial,
                                capping: 0.5,
                                interval: 30,
                                timeout: 10
                            }
                        });
                    } else {
                        this.showPlaceholderAd(slot);
                    }
                    break;

                case 'richads':
                    if (window.richads_showAd) {
                        await window.richads_showAd(this.config.zones.interstitial);
                    } else {
                        this.showPlaceholderAd(slot);
                    }
                    break;

                default:
                    this.showPlaceholderAd(slot);
            }

            this.state.lastAdTime = Date.now();
            this.state.gamesPlayed = 0;

            return true;

        } catch (error) {
            console.warn('⚠️ Ad failed to show:', error);
            this.closeInterstitial();
            return false;
        }
    }

    closeInterstitial() {
        const container = document.getElementById('ad-interstitial');
        container.classList.add('hidden');
        this.state.isAdShowing = false;
    }

    // Show banner ad
    showBannerAd() {
        if (!this.state.adsEnabled) return;

        const container = document.getElementById('ad-banner');
        container.classList.add('visible');

        // For now, show placeholder
        // In production, ad network will auto-fill this
    }

    // Show rewarded ad (for extra coins)
    async showRewardedAd() {
        if (!this.state.adsEnabled || !this.sdkLoaded) {
            return false;
        }

        const timeSinceLastAd = (Date.now() - this.state.lastRewardedAdTime) / 1000 / 60;
        if (timeSinceLastAd < this.config.intervals.rewardedCooldown) {
            const remaining = Math.ceil(this.config.intervals.rewardedCooldown - timeSinceLastAd);
            alert(`Please wait ${remaining} minutes before watching another ad`);
            return false;
        }

        try {
            this.state.isAdShowing = true;
            const container = document.getElementById('ad-interstitial');
            const slot = document.getElementById('ad-interstitial-slot');

            container.classList.remove('hidden');

            // Show rewarded ad
            if (window[`show_${this.config.zones.rewarded}`]) {
                const result = await window[`show_${this.config.zones.rewarded}`]({
                    type: 'rewarded',
                    reward: { coins: 50 }
                });

                if (result === 'completed') {
                    this.state.lastRewardedAdTime = Date.now();

                    // Award coins
                    if (window.app && window.app.coinManager) {
                        window.app.coinManager.addCoins(50, 'rewarded-ad');
                    }

                    return true;
                }
            }

            this.closeInterstitial();
            return false;

        } catch (error) {
            console.warn('⚠️ Rewarded ad failed:', error);
            this.closeInterstitial();
            return false;
        }
    }

    // Check if interstitial should be triggered
    checkInterstitialTrigger() {
        if (this.state.gamesPlayed >= this.config.frequency.interstitial) {
            setTimeout(() => this.showInterstitial(), 500);
        }
    }

    // Show placeholder ad (for testing or when no ad network is active)
    showPlaceholderAd(container) {
        container.innerHTML = `
            <div class="placeholder-ad">
                <div class="placeholder-ad-content">
                    <h3>📺 Advertisement</h3>
                    <p>Your ad will appear here</p>
                    <p>Sign up at monetag.com or richads.com to start earning!</p>
                    <button onclick="adManager.closeInterstitial()">Continue</button>
                </div>
            </div>
        `;
    }

    // Enable/disable ads
    setAdsEnabled(enabled) {
        this.state.adsEnabled = enabled;
        const container = document.getElementById('ad-banner');
        if (container) {
            if (enabled) {
                container.classList.add('visible');
            } else {
                container.classList.remove('visible');
            }
        }
    }

    // Update configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    // Get ad statistics
    getStats() {
        return {
            gamesPlayed: this.state.gamesPlayed,
            lastAdTime: new Date(this.state.lastAdTime),
            adsEnabled: this.state.adsEnabled,
            frequency: this.config.frequency
        };
    }
}

// Initialize ad manager
let adManager;
document.addEventListener('DOMContentLoaded', () => {
    adManager = new AdManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdManager;
}
