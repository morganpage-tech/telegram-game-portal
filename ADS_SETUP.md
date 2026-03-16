# Ad Network Integration Setup Guide

This guide will help you integrate an ad network (Monetag or RichAds) into your Telegram Game Portal to start earning revenue.

---

## 📺 Ad System Overview

Your portal now includes a complete ad management system with:

### Ad Formats Supported
| Format | Placement | Purpose |
|--------|-----------|---------|
| **Banner Ads** | Portal header/footer | Non-intrusive, always visible |
| **Interstitial Ads** | Between games | Full-screen, higher CPM |
| **Rewarded Ads** | Optional user choice | Trade ad view for coins |

### Current Ad Placements
- **Banner Ad**: Between header and game grid
- **Interstitial Ads**: After every 3 games (configurable)
- **Rewarded Ads**: Button in profile (future feature)

---

## 🚀 Quick Start (3 Steps)

### Step 1: Sign Up for an Ad Network

Choose one of these options:

#### Option A: Monetag (Recommended)
- **Website**: https://publishers.monetag.com/
- **Pros**: Better SDK control, higher CPM (~$2-4), more formats
- **Best for**: Telegram Mini Apps with SDK support

#### Option B: RichAds
- **Website**: https://publishers.richads.com/
- **Pros**: Simple integration, fast payments
- **Best for**: Quick setup, less technical

---

### Step 2: Get Your Ad Zone IDs

#### For Monetag:
1. After signing up, go to **Dashboard** → **Websites/Zones**
2. Click **+ New Zone**
3. Select format: **Telegram Mini App** or **Interstitial**
4. Create zones for:
   - Banner (display ads)
   - Interstitial (full-screen)
   - Rewarded (optional)
5. **Copy each Zone ID** (looks like: `123456`)

#### For RichAds:
1. Go to **Dashboard** → **Websites**
2. Click **+ Add Website**
3. Select **Telegram Mini App** as resource type
4. Enter your TMA URL: `https://morganpage-tech.github.io/telegram-game-portal/`
5. **Copy Publisher ID and Widget ID**

---

### Step 3: Update Your Configuration

Open `js/ads.js` and replace the placeholder IDs:

```javascript
// Find this section in js/ads.js (around line 10)
this.config = {
    zones: {
        interstitial: 'INTERSTITIAL_ZONE_ID',  // ← Replace this
        banner: 'BANNER_ZONE_ID',              // ← Replace this
        rewarded: 'REWARDED_ZONE_ID'            // ← Replace this
    },
    // ...
};
```

**Example with real Monetag IDs:**
```javascript
this.config = {
    zones: {
        interstitial: '123456',
        banner: '789012',
        rewarded: '345678'
    },
    // ...
};
```

**Example with RichAds IDs:**
```javascript
this.config = {
    zones: {
        interstitial: '12345',  // Your Widget ID
        banner: '12345',
        rewarded: '12345'
    },
    // ...
};
```

**Save the file and you're done!** 🎉

---

## ⚙️ Ad Configuration Options

You can customize ad behavior by editing `js/ads.js`:

### Frequency Settings
```javascript
this.config = {
    frequency: {
        interstitial: 3,        // Show every N games
        banner: 'always',       // Always show banners
        rewarded: 'optional'     // User can choose
    }
};
```

### Time-Based Settings
```javascript
this.config = {
    intervals: {
        minTimeBetweenAds: 1,    // Minimum minutes between ads
        rewardedCooldown: 5       // Cooldown for rewarded ads
    }
};
```

### Ad Network Selection
```javascript
// Switch between networks in init() method
this.adNetwork = 'monetag'; // 'monetag' | 'richads' | 'custom'
```

---

## 🧪 Testing Your Ads

### Before Publishing
1. Open `index.html` in your browser
2. Play a few games
3. Check if banner ads appear
4. Play 3 games to trigger interstitial

### Expected Behavior
- **Banner Ads**: Should appear between header and game grid
- **Interstitial Ads**: Should appear after 3 games
- **Placeholder Ads**: Will show until real ads are configured

---

## 📊 Monitoring Performance

### Monetag Dashboard
- **URL**: https://publishers.monetag.com/dashboard
- **Track**: Impressions, CPM, Revenue
- **Payment**: Bi-weekly, min $10

### RichAds Dashboard
- **URL**: https://publishers.richads.com/dashboard
- **Track**: Clicks, CTR, Earnings
- **Payment**: Every 2 weeks, min $10

---

## 💰 Revenue Expectations

### Conservative Estimates
| Metric | Expected Value |
|--------|----------------|
| CPM (Banner) | $0.50 - $1.00 |
| CPM (Interstitial) | $2.00 - $4.00 |
| CTR | 1.5% - 3.5% |
| **Revenue per User** | $0.05 - $0.15 |

### Example Earnings
With 10,000 monthly users:
- Banner ads (100K impressions @ $0.75 CPM): **$75**
- Interstitial (50K impressions @ $3 CPM): **$150**
- **Total: ~$225/month**

With 100,000 monthly users: **~$2,250/month**

---

## 🔧 Troubleshooting

### Ads Not Showing?
1. Check console for errors: `F12` → **Console**
2. Verify Zone IDs are correct
3. Check if SDK is loading (look for "Ad Manager initializing")
4. Ensure domain is whitelisted in ad network dashboard

### Ads Showing Too Frequently?
- Increase `interstitial` frequency value (line ~22)
- Increase `minTimeBetweenAds` interval (line ~26)

### Want to Disable Ads Temporarily?
```javascript
// In js/ads.js, set adsEnabled to false
this.state.adsEnabled = false;
```

---

## 🎯 Best Practices

### User Experience
- ✅ Don't show ads on first game launch
- ✅ Use frequency caps to prevent annoyance
- ✅ Allow users to skip ads after 5 seconds
- ✅ Test ad placements before going live

### Revenue Optimization
- ✅ Start with lower frequency, increase gradually
- ✅ Monitor user engagement metrics
- ✅ A/B test different ad placements
- ✅ Consider rewarded ads for higher revenue

### Compliance
- ✅ Only show ads from approved categories
- ✅ Don't show ads in inappropriate games (kids games)
- ✅ Follow Telegram's ad policies
- ✅ Be transparent with users about ads

---

## 🚀 Advanced Features

### A/B Testing Ad Frequency
Test different frequencies to find optimal balance:

```javascript
// In js/ads.js, try different values
this.config.frequency.interstitial = 2;  // More ads, more revenue
// vs
this.config.frequency.interstitial = 5;  // Fewer ads, better UX
```

### Geo-Based Ad Targeting
Many ad networks support showing different ads based on user location (automatically handled).

### Ad Blocker Detection
Add detection logic to encourage users to whitelist:

```javascript
// Add to js/ads.js after init()
setTimeout(() => {
    if (!this.sdkLoaded) {
        console.log('Ad blocker detected');
        // Show message to user
    }
}, 3000);
```

---

## 📞 Support

### Monetag Support
- **Email**: support@monetag.com
- **Telegram**: @MonetagSupport
- **Documentation**: https://docs.monetag.com

### RichAds Support
- **Telegram**: @RichAds_TgAds
- **Documentation**: https://richads.com/blog

---

## 📋 Checklist

- [ ] Sign up for Monetag or RichAds
- [ ] Create ad zones (banner, interstitial)
- [ ] Copy Zone IDs
- [ ] Update `js/ads.js` with real IDs
- [ ] Test ads locally
- [ ] Push to GitHub
- [ ] Monitor performance in dashboard
- [ ] Adjust frequency based on user feedback

---

## 🎉 Next Steps

After ads are working:

1. **Monitor Performance**: Check dashboard daily
2. **Gather Feedback**: Ask users about ad experience
3. **Optimize**: Adjust frequency based on retention
4. **Scale**: Consider adding more games to increase impressions
5. **Diversify**: Add Telegram Stars for IAP revenue

---

**Questions?** Check the ad network documentation or contact their support team directly!

**Ready to start earning?** 🚀
