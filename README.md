# Telegram Game Portal 🎮

[![GitHub Repo](https://img.shields.io/badge/GitHub-morganpage--tech-telegram--game--portal-blue?style=flat-square&logo=github)](https://github.com/morganpage-tech/telegram-game-portal)

A Telegram Mini App that serves as a portal for HTML canvas games.

## Features

### Core Portal
- 📱 Mobile-optimized design
- 🎨 Dark theme that adapts to Telegram's color scheme
- 🎮 Easy to add new games
- 🔄 Full-screen game viewing
- 👆 Touch-friendly controls
- ⚡ Fast loading with iframe-based game loading
- 🌐 Works with any HTML5 Canvas game

### User Engagement Features
- 👤 **User Profile & Stats** - Track games played, playtime, scores, and level up
- 🏆 **Leaderboards** - Global, friends, and per-game rankings with real-time updates
- 🎁 **Daily Rewards** - Claim daily coins with streak bonuses (up to 2x multiplier)
- 📤 **Shareable Scores** - Share achievements via Telegram or social media
- ⭐ **Favorites & Search** - Organize games with favorites and powerful search
- 🎁 **Referral System** - Invite friends and earn coins (100 coins per invite!)

### Coin Economy
- 🪙 Persistent coin balance
- 💰 Multiple earning methods: daily rewards, game sessions, referrals, score bonuses
- 📊 Complete transaction history
- 📅 Streak multipliers for bonus earnings

### Game Features
- 🎯 6 built-in games: Snake, Pong, Tic Tac Toe, Flappy Bird, Breakout, Memory
- 🏅 Achievement system with 8 unlockable badges
- 📊 Detailed game statistics per game
- 🔄 Session tracking with accurate playtime

## Project Structure

```
telegram-game-portal/
├── index.html          # Main portal page
├── css/
│   └── style.css       # Portal styles
├── js/
│   ├── config.js       # Game configuration
│   └── app.js          # Portal logic
└── games/
    ├── snake.html      # Snake game
    ├── pong.html       # Pong game
    └── tictactoe.html  # Tic Tac Toe game
```

## Adding New Games

### 1. Create your game

Create a new HTML file in the `games/` directory with your canvas game:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Game</title>
    <style>
        /* Your game styles */
        body { background: #1a1a2e; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script>
        // Your game logic
    </script>
</body>
</html>
```

### 2. Add to configuration

Edit `js/config.js` and add your game to the `GAMES` array:

```javascript
{
    id: 'yourgame',
    name: 'Your Game Name',
    category: 'Arcade',
    emoji: '🎮',
    thumbnail: null, // Optional: path to thumbnail image
    url: 'games/yourgame.html',
    description: 'Brief description'
}
```

### 3. That's it!

The game will automatically appear in the portal!

## Deployment

### Option 1: Static Hosting (Easiest)

Deploy to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the folder
- **GitHub Pages**: Push to a repo and enable Pages
- **Any web server**: Upload to your hosting

### Option 2: Local Testing

Use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then access at `http://localhost:8000`

### Option 3: Telegram Bot Integration

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Use `/newapp` to create a Mini App
3. Enter your deployed URL
4. Share the link or add to your bot's menu

> 💡 **GitHub Setup**: See `GITHUB_SETUP.md` for complete instructions on creating a GitHub repository and pushing your code.

## Game Development Tips

### Canvas Sizing

Make your games responsive:

```javascript
function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const maxWidth = window.innerWidth - 20;
    const maxHeight = window.innerHeight - 100;
    
    canvas.width = Math.min(400, maxWidth);
    canvas.height = Math.min(400, maxHeight);
}
window.addEventListener('resize', resizeCanvas);
```

### Touch Controls

Add touch support for mobile:

```javascript
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTouch(e);
});
```

### Telegram WebApp Integration

Access Telegram features in your games:

```javascript
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Haptic feedback
    tg.HapticFeedback.impactOccurred('light');
    
    // Get user info
    const user = tg.initDataUnsafe.user;
    
    // Expand to full screen
    tg.expand();
}
```

## Customization

### Colors

Edit `css/style.css` to customize the portal theme:

```css
:root {
    --tg-theme-bg-color: #1a1a2e;
    --tg-theme-text-color: #ffffff;
    --tg-theme-button-color: #3390ec;
    /* ... more colors */
}
```

### Portal Settings

Edit `js/config.js`:

```javascript
const PORTAL_CONFIG = {
    showCategory: true,
    showEmoji: true,
    defaultGameWidth: '100%',
    defaultGameHeight: '100%',
    customColors: {
        primary: '#3390ec',
        secondary: '#16213e'
    }
};
```

## Example Games Included

1. **Snake** - Classic snake game with touch controls
2. **Pong** - Table tennis with AI opponent
3. **Tic Tac Toe** - Puzzle game with AI

## Requirements

- Modern web browser
- Telegram App (for full Mini App experience)
- Web hosting (static file hosting works)

## License

Free to use and modify for your projects!

## Support

For issues or questions, check the Telegram Mini Apps documentation:
https://core.telegram.org/bots/webapps

## Documentation

- **[FEATURES.md](FEATURES.md)** - Complete features documentation
- **[DAILY_REWARDS.md](DAILY_REWARDS.md)** - Daily rewards system guide
- **[SHAREABLE_SCORES.md](SHAREABLE_SCORES.md)** - Shareable scores documentation
- **[CATEGORIES_SEARCH_FAVORITES.md](CATEGORIES_SEARCH_FAVORITES.md)** - Search & favorites guide
- **[REFERRAL_SYSTEM.md](REFERRAL_SYSTEM.md)** - Referral system documentation
- **[GITHUB_SETUP.md](GITHUB_SETUP.md)** - GitHub repository setup guide
- **[GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)** - GitHub Pages deployment guide

## Future Enhancements

- [ ] In-game currency spending (unlock items, power-ups)
- [ ] Game ratings and reviews
- [ ] Push notifications for events
- [ ] Squad/clan system for team competition
- [ ] Tournaments and seasonal events
- [ ] Airdrop/token rewards
- [ ] Advanced cross-promotion and recommendations
- [ ] Multiplayer games
