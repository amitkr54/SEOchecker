/**
 * AdUnit Component
 * Google AdSense wrapper for easy ad insertion
 */

/**
 * Creates an ad unit placeholder
 * @param {string} type - Ad type: 'banner', 'rectangle', 'leaderboard', 'skyscraper'
 * @param {string} slot - AdSense slot ID (optional for now)
 * @returns {string} HTML for ad unit
 */
export function createAdUnit(type = 'banner', slot = '') {
    const adConfig = {
        banner: {
            width: '728px',
            height: '90px',
            class: 'ad-banner',
            label: '728x90 Banner'
        },
        rectangle: {
            width: '300px',
            height: '250px',
            class: 'ad-rectangle',
            label: '300x250 Rectangle'
        },
        leaderboard: {
            width: '970px',
            height: '90px',
            class: 'ad-leaderboard',
            label: '970x90 Leaderboard'
        },
        skyscraper: {
            width: '300px',
            height: '600px',
            class: 'ad-skyscraper',
            label: '300x600 Skyscraper'
        },
        responsive: {
            width: '100%',
            height: 'auto',
            class: 'ad-responsive',
            label: 'Responsive Ad'
        }
    };

    const config = adConfig[type] || adConfig.banner;

    // For now, show placeholder. Replace with actual AdSense code when ready
    return `
    <div class="ad-container ${config.class}">
      <div class="ad-placeholder" style="min-height: ${config.height};" data-slot="${slot}">
        <div class="ad-label">Advertisement - ${config.label}</div>
        <!-- Google AdSense code will go here -->
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="${slot || 'XXXXXXXXXX'}"
             data-ad-format="${type === 'responsive' ? 'auto' : 'rectangle'}"
             ${type === 'responsive' ? 'data-full-width-responsive="true"' : ''}></ins>
      </div>
    </div>
  `;
}

/**
 * Initialize AdSense ads on page
 * Call this after DOM is loaded
 */
export function initAds() {
    // This will be called when AdSense is approved
    // (adsbygoogle = window.adsbygoogle || []).push({});
    console.log('Ad units initialized (placeholder mode)');
}

// Ad unit styles
export const adStyles = `
<style>
.ad-container {
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ad-placeholder {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(16, 185, 129, 0.05));
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 100%;
  padding: 1rem;
  position: relative;
}

.ad-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.ad-banner,
.ad-leaderboard {
  max-width: 728px;
}

.ad-rectangle {
  max-width: 300px;
}

.ad-skyscraper {
  max-width: 300px;
}

.ad-responsive {
  max-width: 100%;
}

/* Responsive behavior */
@media (max-width: 768px) {
  .ad-banner .ad-placeholder,
  .ad-leaderboard .ad-placeholder {
    min-height: 90px;
  }
  
  .ad-rectangle .ad-placeholder {
    min-height: 250px;
    max-width: 100%;
  }
  
  .ad-skyscraper {
    display: none; /* Hide tall ads on mobile */
  }
}

/* When AdSense is active, remove placeholder styles */
.ad-placeholder.adsense-active {
  background: none;
  border: none;
  padding: 0;
}

.ad-placeholder.adsense-active .ad-label {
  display: none;
}
</style>
`;
