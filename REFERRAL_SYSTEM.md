# Referral System Documentation

## Overview

The Referral System allows users to invite friends to the game portal and earn coins as a reward. Both the inviter and the invitee receive bonus coins, creating a win-win scenario that drives viral growth.

## Features

### 1. Referral Link Generation
- Unique referral code for each user (format: `userId-randomString`)
- Generates Telegram deep link: `https://t.me/yourbot?start=referralCode`
- Persistent storage of referral code in localStorage

### 2. Referral Rewards
- **Inviter Reward:** 100 coins per friend who signs up
- **Invitee Reward:** 50 coins as welcome bonus
- Rewards automatically credited to coin balance
- Logged in transaction history

### 3. Referral Tracking
- Total invites counter
- Total coins earned from referrals
- Complete list of all referred friends with:
  - Friend name
  - Timestamp of signup
  - Coins earned from each invite

### 4. UI Components

#### Referral Card (Profile View)
Located in the profile section with:
- Title: "Invite & Earn"
- Bonus display: "+100 🪙 per invite"
- Description text
- "Invite Friends" button to open referral popup

#### Referral Popup
Full-featured popup with:
- **Stats Section:** Shows total invites and coins earned
- **Referral Link:** Input field with copy button
- **Bonus Info:** Explains rewards for both parties
- **Share Button:** Share link via Telegram or web share
- **Invites List:** Shows all referred friends

## Usage

### For Players

1. **Accessing Referral System:**
   - Tap profile icon in header
   - Find the "Invite & Earn" card
   - Tap "Invite Friends" button

2. **Sharing Referral Link:**
   - Tap "📋" to copy link to clipboard
   - Or tap "Share Link" to share via Telegram
   - Send to friends via chat, social media, etc.

3. **Earning Rewards:**
   - When a friend uses your link and signs up, you earn 100 coins
   - Friend receives 50 coins as welcome bonus
   - Track earnings in Referral Popup > "Your Invites"

### For Developers

#### ReferralManager Class

```javascript
class ReferralManager {
    constructor(profile, rewards)

    // Get referral link
    getReferralLink() → string

    // Process referral from start parameter
    processReferral(referralCode) → object

    // Record successful invite
    recordInvite(inviteeData) → object

    // Get all stats
    getReferralStats() → object

    // Get list of invites
    getInvites() → array
}
```

#### Data Structure

```javascript
{
    referralCode: "user-abc123",
    referredBy: null,  // or "referrer-code"
    invites: [
        {
            inviteeId: "user456",
            inviteeName: "John",
            referralCode: "user-abc123",
            timestamp: 1710451200000,
            coinsEarned: 100
        }
    ],
    totalInvites: 1,
    totalCoinsEarned: 100,
    referralBonus: {
        inviter: 100,
        invitee: 50
    }
}
```

## Backend Integration

The current implementation uses localStorage for demo purposes. For production, you'll need to integrate with your backend:

### Required Backend Endpoints

```javascript
// Get user's referral code
GET /api/user/referral-code
Response: { referralCode: "user-abc123" }

// Verify referral code
POST /api/referral/verify
Body: { referralCode: "user-abc123" }
Response: { valid: true, referrerId: "user123" }

// Record referral
POST /api/referral/record
Body: {
    referrerId: "user123",
    inviteeId: "user456",
    referralCode: "user-abc123"
}
Response: { success: true, coinsEarned: 100 }

// Get referral stats
GET /api/user/referral-stats
Response: {
    totalInvites: 5,
    totalCoinsEarned: 500,
    invites: [...]
}
```

### Telegram Bot Integration

1. **Setup Bot:**
   - Create bot with @BotFather
   - Set Mini App URL to your GitHub Pages or hosting
   - Set Start parameter handling

2. **Handle Start Parameter:**
   ```javascript
   // In Telegram Mini App
   const tg = window.Telegram.WebApp;
   const startParam = tg.initDataUnsafe?.start_param;

   if (startParam) {
     referral.processReferral(startParam);
   }
   ```

3. **Deep Link Format:**
   - `https://t.me/yourbot?start=referralCode`
   - Opens bot, shows "Start" button with Mini App

## CSS Classes

| Class | Purpose |
|-------|---------|
| `.referral-card` | Main card in profile |
| `.referral-btn` | Invite friends button |
| `.referral-popup-content` | Popup container |
| `.referral-stats` | Stats grid layout |
| `.referral-link-input` | Link input field |
| `.invite-item` | Individual invite row |

## Future Enhancements

1. **Multi-tier Referrals:** Earn commissions on friends' friends
2. **Referral Leaderboards:** Show top referrers
3. **Referral Bonuses:** Extra coins for milestones (5 invites, 10 invites, etc.)
4. **Referral Codes Customization:** Allow users to choose custom codes
5. **Social Media Integration:** Share to Twitter, Facebook, etc.
6. **QR Codes:** Generate QR code for offline sharing

## Troubleshooting

**Issue:** Referral link not working
- **Solution:** Ensure bot username is set correctly in ReferralManager

**Issue:** Coins not awarded after referral
- **Solution:** Check backend is recording referrals properly

**Issue:** Referral popup not opening
- **Solution:** Check console for JavaScript errors

---

*Last updated: 2026-03-15*
