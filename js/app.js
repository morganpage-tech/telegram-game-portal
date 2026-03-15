// User Profile Manager
class UserProfile {
    constructor() {
        this.storageKey = 'gamePortalProfile';
        this.data = this.loadProfile();
        this.updateStreak();
    }

    loadProfile() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading profile:', e);
        }
        return this.getDefaultProfile();
    }

    getDefaultProfile() {
        return {
            userId: null,
            name: 'Player',
            avatar: '👤',
            level: 1,
            totalGames: 0,
            totalPlaytime: 0, // in seconds
            bestScore: 0,
            streak: 0,
            lastPlayed: null,
            gameStats: {}, // { gameId: { plays: 0, playtime: 0, bestScore: 0 } }
            achievements: [],
            recentGames: []
        };
    }

    saveProfile() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Error saving profile:', e);
        }
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastPlayed = this.data.lastPlayed;

        if (lastPlayed) {
            const lastDate = new Date(lastPlayed);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastDate.toDateString() === yesterday.toDateString()) {
                // Played yesterday, continue streak
            } else if (lastDate.toDateString() !== today) {
                // Streak broken
                this.data.streak = 0;
            }
        }
    }

    startGameSession(gameId) {
        const today = new Date().toDateString();
        if (this.data.lastPlayed !== today) {
            if (this.data.lastPlayed === new Date(Date.now() - 86400000).toDateString()) {
                this.data.streak++;
            } else {
                this.data.streak = 1;
            }
            this.data.lastPlayed = today;
        }

        if (!this.data.gameStats[gameId]) {
            this.data.gameStats[gameId] = {
                plays: 0,
                playtime: 0,
                bestScore: 0
            };
        }

        return Date.now();
    }

    endGameSession(gameId, startTime, score = 0) {
        const endTime = Date.now();
        const sessionPlaytime = Math.floor((endTime - startTime) / 1000);

        this.data.totalGames++;
        this.data.totalPlaytime += sessionPlaytime;

        if (score > this.data.bestScore) {
            this.data.bestScore = score;
        }

        if (score > this.data.gameStats[gameId].bestScore) {
            this.data.gameStats[gameId].bestScore = score;
        }

        this.data.gameStats[gameId].plays++;
        this.data.gameStats[gameId].playtime += sessionPlaytime;

        // Update recent games
        this.data.recentGames = this.data.recentGames.filter(g => g.gameId !== gameId);
        this.data.recentGames.unshift({
            gameId,
            score,
            timestamp: endTime
        });

        // Keep only last 10 games
        this.data.recentGames = this.data.recentGames.slice(0, 10);

        this.updateLevel();
        this.checkAchievements();
        this.saveProfile();
    }

    updateLevel() {
        // Level based on total playtime (every 10 minutes = 1 level, starting at 1)
        const newLevel = Math.floor(this.data.totalPlaytime / 600) + 1;
        this.data.level = newLevel;
    }

    checkAchievements() {
        const achievements = [
            { id: 'first_game', name: 'First Steps', icon: '🎮', desc: 'Play your first game', check: () => this.data.totalGames >= 1 },
            { id: 'ten_games', name: 'Game Enthusiast', icon: '🔥', desc: 'Play 10 games', check: () => this.data.totalGames >= 10 },
            { id: 'score_100', name: 'Centurion', icon: '💯', desc: 'Score 100 points', check: () => this.data.bestScore >= 100 },
            { id: 'score_1000', name: 'High Scorer', icon: '🏆', desc: 'Score 1000 points', check: () => this.data.bestScore >= 1000 },
            { id: 'streak_3', name: 'Consistent', icon: '📅', desc: '3 day streak', check: () => this.data.streak >= 3 },
            { id: 'streak_7', name: 'Dedicated', icon: '⭐', desc: '7 day streak', check: () => this.data.streak >= 7 },
            { id: 'playtime_1h', name: 'Time Player', icon: '⏱️', desc: 'Play for 1 hour total', check: () => this.data.totalPlaytime >= 3600 },
            { id: 'playtime_10h', name: 'Marathon Gamer', icon: '🏅', desc: 'Play for 10 hours total', check: () => this.data.totalPlaytime >= 36000 },
        ];

        achievements.forEach(achievement => {
            if (achievement.check() && !this.data.achievements.find(a => a.id === achievement.id)) {
                this.data.achievements.push(achievement);
            }
        });
    }

    getProfile() {
        return { ...this.data };
    }
}

// Leaderboard Manager
class LeaderboardManager {
    constructor(profile) {
        this.profile = profile;
        this.storageKey = 'gamePortalLeaderboards';
        this.data = this.loadLeaderboards();
        this.generateMockData();
    }

    loadLeaderboards() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading leaderboards:', e);
        }
        return this.getDefaultLeaderboards();
    }

    getDefaultLeaderboards() {
        return {
            global: [],
            friends: [],
            games: {}
        };
    }

    generateMockData() {
        // Only generate mock data if no data exists
        if (this.data.global.length > 0) return;

        const mockPlayers = [
            { name: 'ProGamer99', score: 15420, games: 89, avatar: '🎮' },
            { name: 'SnakeMaster', score: 12300, games: 75, avatar: '🐍' },
            { name: 'PixelKing', score: 11200, games: 65, avatar: '👑' },
            { name: 'ArcadeHero', score: 9850, games: 58, avatar: '🦸' },
            { name: 'GameWizard', score: 8700, games: 52, avatar: '🧙' },
            { name: 'ChampionPlayer', score: 7800, games: 48, avatar: '🏆' },
            { name: 'RetroGamer', score: 7200, games: 45, avatar: '🕹️' },
            { name: 'ScoreHunter', score: 6500, games: 41, avatar: '🎯' },
            { name: 'PixelNinja', score: 5800, games: 38, avatar: '🥷' },
            { name: 'ArcadeLegend', score: 5200, games: 35, avatar: '⭐' },
            { name: 'GameMaster', score: 4800, games: 32, avatar: '🎖️' },
            { name: 'TopPlayer', score: 4200, games: 28, avatar: '🥇' },
            { name: 'ProPlayer', score: 3600, games: 25, avatar: '🥈' },
            { name: 'EliteGamer', score: 3000, games: 22, avatar: '🥉' },
            { name: 'CasualPlayer', score: 2400, games: 18, avatar: '😊' },
        ];

        this.data.global = mockPlayers.map((player, index) => ({
            ...player,
            rank: index + 1
        }));

        // Mock friends leaderboard
        this.data.friends = [
            { name: 'Alex', score: 8200, games: 45, avatar: '😎', rank: 1 },
            { name: 'Sarah', score: 6400, games: 38, avatar: '🌟', rank: 2 },
            { name: 'Mike', score: 5100, games: 32, avatar: '🎯', rank: 3 },
            { name: 'Emma', score: 4300, games: 28, avatar: '💫', rank: 4 },
            { name: 'John', score: 3200, games: 22, avatar: '🎪', rank: 5 },
        ];

        // Generate per-game leaderboards
        GAMES.forEach(game => {
            this.data.games[game.id] = this.generateGameLeaderboard(game.id);
        });

        this.saveLeaderboards();
    }

    generateGameLeaderboard(gameId) {
        const gameNames = {
            'snake': 'Snake',
            'pong': 'Pong',
            'memory': 'Memory',
            'breakout': 'Breakout',
            'tetris': 'Tetris'
        };

        const baseScore = Math.random() * 5000 + 2000;
        return Array.from({ length: 10 }, (_, i) => ({
            name: `Player${i + 1}`,
            score: Math.floor(baseScore - (i * 300)),
            avatar: ['🎮', '🏆', '⭐', '🥇', '🥈', '🥉', '🎯', '💯', '🌟', '👑'][i],
            rank: i + 1
        }));
    }

    saveLeaderboards() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Error saving leaderboards:', e);
        }
    }

    updateGlobalLeaderboard() {
        const userData = {
            name: this.profile.data.name,
            score: this.profile.data.bestScore,
            games: this.profile.data.totalGames,
            avatar: this.profile.data.avatar
        };

        // Update or add user to global leaderboard
        const existingIndex = this.data.global.findIndex(
            p => p.name === userData.name
        );

        if (existingIndex >= 0) {
            this.data.global[existingIndex] = {
                ...this.data.global[existingIndex],
                ...userData,
                score: Math.max(this.data.global[existingIndex].score, userData.score),
                games: Math.max(this.data.global[existingIndex].games, userData.games)
            };
        } else {
            this.data.global.push(userData);
        }

        // Sort by score
        this.data.global.sort((a, b) => b.score - a.score);

        // Update ranks
        this.data.global.forEach((player, index) => {
            player.rank = index + 1;
        });

        this.saveLeaderboards();
    }

    updateGameLeaderboard(gameId) {
        const gameStats = this.profile.data.gameStats[gameId];
        if (!gameStats) return;

        const userData = {
            name: this.profile.data.name,
            score: gameStats.bestScore,
            avatar: this.profile.data.avatar
        };

        if (!this.data.games[gameId]) {
            this.data.games[gameId] = [];
        }

        const existingIndex = this.data.games[gameId].findIndex(
            p => p.name === userData.name
        );

        if (existingIndex >= 0) {
            this.data.games[gameId][existingIndex] = {
                ...this.data.games[gameId][existingIndex],
                ...userData,
                score: Math.max(this.data.games[gameId][existingIndex].score, userData.score)
            };
        } else {
            this.data.games[gameId].push(userData);
        }

        this.data.games[gameId].sort((a, b) => b.score - a.score);
        this.data.games[gameId].forEach((player, index) => {
            player.rank = index + 1;
        });

        this.saveLeaderboards();
    }

    getGlobalLeaderboard() {
        return this.data.global.slice(0, 20); // Top 20
    }

    getFriendsLeaderboard() {
        return this.data.friends.slice(0, 10);
    }

    getGameLeaderboard(gameId) {
        return this.data.games[gameId]?.slice(0, 10) || [];
    }

    getUserRank(leaderboardType = 'global') {
        const userName = this.profile.data.name;

        if (leaderboardType === 'global') {
            const user = this.data.global.find(p => p.name === userName);
            return user?.rank || '--';
        }

        if (leaderboardType === 'friends') {
            const user = this.data.friends.find(p => p.name === userName);
            return user?.rank || '--';
        }

        return '--';
    }
}

// Rewards & Coin Manager
class RewardsManager {
    constructor(profile) {
        this.profile = profile;
        this.storageKey = 'gamePortalRewards';
        this.data = this.loadRewards();
    }

    loadRewards() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading rewards:', e);
        }
        return this.getDefaultRewards();
    }

    getDefaultRewards() {
        return {
            coins: 0,
            dailyRewardClaimed: false,
            dailyRewardClaimedDate: null,
            coinHistory: [],
            lastLoginDate: null,
            streakBonusMultiplier: 1
        };
    }

    saveRewards() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Error saving rewards:', e);
        }
    }

    canClaimDailyReward() {
        const today = new Date().toDateString();
        const lastClaimed = this.data.dailyRewardClaimedDate;

        if (!lastClaimed) return true;
        return lastClaimed !== today;
    }

    claimDailyReward() {
        if (!this.canClaimDailyReward()) {
            return { success: false, reason: 'already_claimed' };
        }

        const today = new Date().toDateString();
        const streak = this.profile.data.streak;
        const multiplier = this.getStreakMultiplier(streak);
        const baseReward = this.getDailyRewardAmount(streak);
        const finalReward = Math.floor(baseReward * multiplier);

        // Add coins
        this.addCoins(finalReward, 'daily_reward');

        // Mark as claimed
        this.data.dailyRewardClaimed = true;
        this.data.dailyRewardClaimedDate = today;

        this.saveRewards();
        this.profile.saveProfile();

        return {
            success: true,
            coins: finalReward,
            streak: streak,
            multiplier: multiplier
        };
    }

    getDailyRewardAmount(streak) {
        // Base reward increases with streak
        const baseRewards = {
            1: 50,
            2: 60,
            3: 70,
            4: 80,
            5: 100,
            6: 120,
            7: 150,
        };

        // After 7 days, cap at 150
        if (streak >= 7) return baseRewards[7];
        if (streak <= 0) return baseRewards[1];
        return baseRewards[streak] || baseRewards[7];
    }

    getStreakMultiplier(streak) {
        if (streak >= 30) return 2.0; // 30+ days = 2x
        if (streak >= 14) return 1.5; // 14+ days = 1.5x
        if (streak >= 7) return 1.25; // 7+ days = 1.25x
        return 1.0;
    }

    addCoins(amount, source = 'game') {
        this.data.coins += amount;

        // Add to history
        this.data.coinHistory.unshift({
            amount,
            source,
            timestamp: Date.now(),
            balance: this.data.coins
        });

        // Keep only last 50 transactions
        this.data.coinHistory = this.data.coinHistory.slice(0, 50);

        this.saveRewards();
        return this.data.coins;
    }

    getCoins() {
        return this.data.coins;
    }

    getCoinHistory() {
        return this.data.coinHistory;
    }

    getRewardsCalendar() {
        const rewards = [];
        for (let day = 1; day <= 30; day++) {
            const baseReward = this.getDailyRewardAmount(day);
            const multiplier = this.getStreakMultiplier(day);
            const finalReward = Math.floor(baseReward * multiplier);
            rewards.push({
                day,
                reward: finalReward,
                bonus: multiplier > 1 ? `${(multiplier - 1) * 100}% bonus` : null
            });
        }
        return rewards;
    }

    checkDailyReset() {
        const today = new Date().toDateString();
        const lastClaimed = this.data.dailyRewardClaimedDate;

        if (lastClaimed && lastClaimed !== today) {
            // New day, reset daily reward claim status
            this.data.dailyRewardClaimed = false;
            this.saveRewards();
        }
    }

    earnFromGame(score, playtime) {
        // Calculate coins from game session
        // Base: 1 coin per minute + 1 coin per 100 points
        const timeBonus = Math.floor(playtime / 60);
        const scoreBonus = Math.floor(score / 100);
        const totalEarned = timeBonus + scoreBonus + 1; // Minimum 1 coin

        return this.addCoins(totalEarned, 'game');
    }

    getStreakBonusMultiplier() {
        return this.getStreakMultiplier(this.profile.data.streak);
    }
}

// Share Manager
class ShareManager {
    constructor(profile) {
        this.profile = profile;
        this.currentShareData = null;
        this.templates = {
            default: (data) => `🎮 I just scored ${data.score} points in ${data.gameName}! Can you beat my score?`,
            funny: (data) => `😎 Just scored ${data.score} points in ${data.gameName}! Pro gamer mode activated 🕹️`,
            challenge: (data) => `🏆 Challenge: I scored ${data.score} points in ${data.gameName}. Think you can do better? Play now!`
        };
    }

    prepareShare(gameId, score) {
        const game = GAMES.find(g => g.id === gameId);
        const userName = this.profile.data.name;

        this.currentShareData = {
            gameId,
            gameName: game ? game.name : 'Unknown Game',
            gameEmoji: game ? game.emoji : '🎮',
            score,
            userName,
            timestamp: Date.now()
        };

        return this.currentShareData;
    }

    getDefaultMessage() {
        if (!this.currentShareData) return '';
        return this.templates.default(this.currentShareData);
    }

    getTemplate(templateName) {
        if (!this.currentShareData) return '';
        return this.templates[templateName] ? this.templates[templateName](this.currentShareData) : this.getDefaultMessage();
    }

    shareToTelegram(customMessage = null) {
        if (!this.currentShareData) {
            console.error('No share data prepared');
            return false;
        }

        const message = customMessage || this.getDefaultMessage();
        const shareUrl = window.location.href;

        if (window.Telegram && window.Telegram.WebApp) {
            // Use Telegram's share API
            const tg = window.Telegram.WebApp;

            if (tg.switchInlineQuery) {
                // Share with inline query
                tg.switchInlineQuery(`${message} ${shareUrl}`);
            } else if (tg.openTelegramLink) {
                // Open share link
                const shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`;
                tg.openTelegramLink(shareLink);
            } else {
                // Fallback to web share
                this.shareGeneric(message);
            }
            return true;
        } else {
            // Not in Telegram, use web share
            return this.shareGeneric(message);
        }
    }

    shareToFriend(customMessage = null) {
        if (!this.currentShareData) {
            console.error('No share data prepared');
            return false;
        }

        const message = customMessage || this.templates.challenge(this.currentShareData);
        const shareUrl = window.location.href;

        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;

            if (tg.openLink) {
                const shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`;
                tg.openLink(shareLink);
                return true;
            }
        }

        return this.shareGeneric(message);
    }

    shareGeneric(customMessage = null) {
        if (!this.currentShareData) {
            console.error('No share data prepared');
            return false;
        }

        const message = customMessage || this.getDefaultMessage();
        const shareUrl = window.location.href;

        // Use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: `${this.currentShareData.gameEmoji} Game Score`,
                text: message,
                url: shareUrl
            }).catch(err => {
                console.log('Share failed:', err);
                this.copyToClipboard(message + ' ' + shareUrl);
            });
            return true;
        } else {
            // Fallback: copy to clipboard
            return this.copyToClipboard(message + ' ' + shareUrl);
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    alert('Score copied to clipboard!');
                })
                .catch(err => {
                    console.error('Copy failed:', err);
                    this.fallbackCopy(text);
                });
        } else {
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Score copied to clipboard!');
        } catch (err) {
            console.error('Copy failed:', err);
            alert('Failed to copy. Please manually copy the text.');
        }
        document.body.removeChild(textArea);
    }
}

// Favorites Manager
class FavoritesManager {
    constructor() {
        this.storageKey = 'gamePortalFavorites';
        this.favorites = this.loadFavorites();
    }

    loadFavorites() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading favorites:', e);
        }
        return [];
    }

    saveFavorites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
        } catch (e) {
            console.error('Error saving favorites:', e);
        }
    }

    addFavorite(gameId) {
        if (!this.favorites.includes(gameId)) {
            this.favorites.push(gameId);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    removeFavorite(gameId) {
        const index = this.favorites.indexOf(gameId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    toggleFavorite(gameId) {
        if (this.isFavorite(gameId)) {
            this.removeFavorite(gameId);
            return false;
        } else {
            this.addFavorite(gameId);
            return true;
        }
    }

    isFavorite(gameId) {
        return this.favorites.includes(gameId);
    }

    getFavorites() {
        return this.favorites;
    }

    getFavoriteGames() {
        return GAMES.filter(game => this.favorites.includes(game.id));
    }
}

// Game Portal App
class GamePortal {
    constructor() {
        this.currentGame = null;
        this.currentSession = null;
        this.profile = new UserProfile();
        this.leaderboard = new LeaderboardManager(this.profile);
        this.rewards = new RewardsManager(this.profile);
        this.share = new ShareManager(this.profile);
        this.favorites = new FavoritesManager();
        this.portalView = document.getElementById('portal-view');
        this.gameView = document.getElementById('game-view');
        this.profileView = document.getElementById('profile-view');
        this.leaderboardView = document.getElementById('leaderboard-view');
        this.gameGrid = document.getElementById('game-grid');
        this.backBtn = document.getElementById('back-btn');
        this.profileBackBtn = document.getElementById('profile-back-btn');
        this.leaderboardBackBtn = document.getElementById('leaderboard-back-btn');
        this.leaderboardMoreBtn = document.getElementById('leaderboard-more-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.gameTitle = document.getElementById('game-title');
        this.gameFrame = document.getElementById('game-frame');
        this.profileBtn = document.getElementById('profile-btn');
        this.searchInput = document.getElementById('search-input');
        this.clearSearchBtn = document.getElementById('clear-search');
        this.currentLeaderboardTab = 'global';
        this.currentGameLeaderboardId = GAMES[0]?.id;
        this.currentCategory = 'all';
        this.searchQuery = '';

        this.init();
    }

    init() {
        // Initialize Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            this.tg = window.Telegram.WebApp;
            this.tg.ready();
            this.tg.expand();
            this.applyTheme();
            this.loadTelegramUser();
        }

        // Check for daily reset
        this.rewards.checkDailyReset();

        // Load games and update stats
        this.loadGames();
        this.updateStatsBar();
        this.updateLeaderboardPreview();
        this.updateProfileRank();
        this.updateCoinDisplay();
        this.checkDailyReward();

        // Setup event listeners
        this.setupEventListeners();
    }

    loadTelegramUser() {
        if (this.tg.initDataUnsafe?.user) {
            const user = this.tg.initDataUnsafe.user;
            this.profile.data.userId = user.id;
            this.profile.data.name = user.first_name || 'Player';
            this.profile.saveProfile();
            this.updateProfileUI();
        }
    }

    applyTheme() {
        if (!this.tg) return;

        const themeParams = this.tg.themeParams;
        if (themeParams.bg_color) {
            document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
        }
        if (themeParams.text_color) {
            document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color);
        }
        if (themeParams.hint_color) {
            document.documentElement.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
        }
        if (themeParams.button_color) {
            document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color);
        }
        if (themeParams.button_text_color) {
            document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
        }
        if (themeParams.secondary_bg_color) {
            document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color);
        }
        if (themeParams.header_bg_color) {
            document.documentElement.style.setProperty('--tg-theme-header-bg-color', themeParams.header_bg_color);
        }
    }

    loadGames() {
        if (GAMES.length === 0) {
            this.gameGrid.innerHTML = `
                <div class="empty-state">
                    <div class="emoji">🎮</div>
                    <h3>No games yet</h3>
                    <p>Add games to the GAMES array in js/config.js</p>
                </div>
            `;
            return;
        }

        let filteredGames = GAMES;

        // Filter by category
        if (this.currentCategory === 'favorites') {
            filteredGames = this.favorites.getFavoriteGames();
        } else if (this.currentCategory !== 'all') {
            filteredGames = GAMES.filter(game => game.category === this.currentCategory);
        }

        // Filter by search query
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase().trim();
            filteredGames = filteredGames.filter(game =>
                game.name.toLowerCase().includes(query) ||
                game.description.toLowerCase().includes(query) ||
                game.category.toLowerCase().includes(query)
            );
        }

        // Show no results if needed
        if (filteredGames.length === 0) {
            this.gameGrid.innerHTML = this.createNoResults();
            return;
        }

        this.gameGrid.innerHTML = filteredGames.map(game => this.createGameCard(game)).join('');

        // Add click listeners
        this.gameGrid.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.dataset.gameId;
                this.launchGame(gameId);
            });
        });

        // Add favorite button listeners
        this.gameGrid.querySelectorAll('.game-card-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const gameId = btn.dataset.gameId;
                this.toggleFavorite(gameId, btn);
            });
        });
    }

    createNoResults() {
        let message = 'No games found';
        let emoji = '🔍';

        if (this.currentCategory === 'favorites' && !this.searchQuery) {
            message = 'No favorites yet';
            emoji = '⭐';
        } else if (this.currentCategory !== 'all' && !this.searchQuery) {
            message = `No games in ${this.currentCategory}`;
            emoji = '🎮';
        }

        return `
            <div class="no-results">
                <div class="no-results-emoji">${emoji}</div>
                <div class="no-results-text">${message}</div>
                <div class="no-results-subtext">Try a different category or search term</div>
            </div>
        `;
    }

    createGameCard(game) {
        const stats = this.profile.data.gameStats[game.id] || { plays: 0, bestScore: 0 };
        const isFavorite = this.favorites.isFavorite(game.id);
        const emojiHtml = game.emoji ? `<span class="game-thumb">${game.emoji}</span>` : '';

        return `
            <div class="game-card" data-game-id="${game.id}">
                <button class="game-card-favorite ${isFavorite ? 'active' : ''}" data-game-id="${game.id}">
                    <span class="favorite-icon">⭐</span>
                </button>
                ${emojiHtml}
                <div class="game-info">
                    <div class="game-name">${game.name}</div>
                    ${PORTAL_CONFIG.showCategory ? `<div class="game-category">${game.category}</div>` : ''}
                    <div class="game-stats">
                        <span class="game-stat">🎮 ${stats.plays}</span>
                        ${stats.bestScore > 0 ? `<span class="game-stat">🏆 ${stats.bestScore}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    launchGame(gameId) {
        const game = GAMES.find(g => g.id === gameId);
        if (!game) {
            console.error('Game not found:', gameId);
            return;
        }

        this.currentGame = game;
        this.currentSession = {
            gameId,
            startTime: this.profile.startGameSession(gameId)
        };

        this.gameTitle.textContent = game.name;
        this.gameFrame.src = game.url;

        // Hide share button initially
        this.shareBtn.style.display = 'none';

        // Show game view
        this.portalView.classList.remove('active');
        this.gameView.classList.add('active');

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    goBack() {
        console.log('goBack() called');

        // End game session
        if (this.currentSession) {
            const score = this.currentSession.score || 0;
            const playtime = (Date.now() - this.currentSession.startTime) / 1000;

            // Award coins from game session
            const coinsEarned = this.rewards.earnFromGame(score, playtime);
            this.showCoinEarnedNotification(coinsEarned);

            this.profile.endGameSession(
                this.currentSession.gameId,
                this.currentSession.startTime,
                score
            );
            this.leaderboard.updateGlobalLeaderboard();
            this.leaderboard.updateGameLeaderboard(this.currentSession.gameId);

            // Prepare share data if score > 0
            if (score > 0) {
                this.share.prepareShare(this.currentSession.gameId, score);
                this.updateShareButton();
            }

            this.currentSession = null;
        }

        // Clear game frame first
        this.gameFrame.src = '';
        this.currentGame = null;

        // Switch views
        console.log('Removing active from gameView, adding to portalView');
        this.gameView.classList.remove('active');
        this.portalView.classList.add('active');

        // Force reflow to ensure CSS changes apply
        void this.portalView.offsetWidth;

        // Update UI
        console.log('Updating stats bar');
        this.updateStatsBar();
        this.updateLeaderboardPreview();
        this.updateProfileRank();
        this.updateCoinDisplay();

        console.log('Reloading games');
        this.loadGames(); // Reload to update game card stats

        console.log('goBack() completed');

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    updateShareButton() {
        // Show share button after game ends if there's a score
        if (this.share.currentShareData && this.share.currentShareData.score > 0) {
            this.shareBtn.style.display = 'flex';
        } else {
            this.shareBtn.style.display = 'none';
        }
    }

    showSharePopup() {
        const popup = document.getElementById('share-popup');
        const shareData = this.share.currentShareData;

        if (!shareData) {
            console.error('No share data available');
            return;
        }

        // Update share preview
        document.getElementById('share-score-emoji').textContent = shareData.gameEmoji;
        document.getElementById('share-game-name').textContent = shareData.gameName;
        document.getElementById('share-score-value').textContent = shareData.score.toLocaleString();

        // Set default message
        document.getElementById('share-message').value = this.share.getDefaultMessage();

        popup.classList.add('active');

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('medium');
        }
    }

    hideSharePopup() {
        const popup = document.getElementById('share-popup');
        popup.classList.remove('active');

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    useTemplate(templateName) {
        const message = this.share.getTemplate(templateName);
        document.getElementById('share-message').value = message;
    }

    shareToTelegram() {
        const customMessage = document.getElementById('share-message').value;
        if (this.share.shareToTelegram(customMessage)) {
            this.hideSharePopup();
        }
    }

    shareToFriend() {
        const customMessage = document.getElementById('share-message').value;
        if (this.share.shareToFriend(customMessage)) {
            this.hideSharePopup();
        }
    }

    shareGeneric() {
        const customMessage = document.getElementById('share-message').value;
        if (this.share.shareGeneric(customMessage)) {
            this.hideSharePopup();
        }
    }

    updateCoinDisplay() {
        const coins = this.rewards.getCoins();
        document.getElementById('header-coin-amount').textContent = coins.toLocaleString();
        document.getElementById('profile-coins').textContent = coins.toLocaleString();
        document.getElementById('profile-coin-balance').textContent = coins.toLocaleString();

        // Update streak multiplier
        const multiplier = this.rewards.getStreakBonusMultiplier();
        document.getElementById('streak-multiplier').textContent = `x${multiplier.toFixed(2)}`;

        // Update coin history
        this.updateCoinHistory();
    }

    updateCoinHistory() {
        const historyEl = document.getElementById('coin-history');
        const history = this.rewards.getCoinHistory();

        if (history.length === 0) {
            historyEl.innerHTML = '<p class="empty-text">No transactions yet</p>';
            return;
        }

        historyEl.innerHTML = history.slice(0, 10).map(transaction => {
            const isPositive = transaction.amount > 0;
            const icon = isPositive ? '🪙' : '📤';
            const color = isPositive ? '#4caf50' : '#f44336';
            const timeAgo = this.getTimeAgo(transaction.timestamp);
            const sourceLabel = this.getCoinSourceLabel(transaction.source);

            return `
                <div class="coin-history-item">
                    <span class="history-icon">${icon}</span>
                    <div class="history-info">
                        <span class="history-source">${sourceLabel}</span>
                        <span class="history-time">${timeAgo}</span>
                    </div>
                    <span class="history-amount" style="color: ${color}">
                        ${isPositive ? '+' : ''}${transaction.amount}
                    </span>
                </div>
            `;
        }).join('');
    }

    getCoinSourceLabel(source) {
        const labels = {
            'daily_reward': 'Daily Reward',
            'game': 'Game Session',
            'achievement': 'Achievement',
            'purchase': 'Purchase',
            'bonus': 'Bonus'
        };
        return labels[source] || source;
    }

    checkDailyReward() {
        const canClaim = this.rewards.canClaimDailyReward();
        const pulseEl = document.getElementById('rewards-pulse');

        if (canClaim) {
            pulseEl.classList.add('active');
        } else {
            pulseEl.classList.remove('active');
        }
    }

    showDailyRewardsPopup() {
        const popup = document.getElementById('daily-rewards-popup');
        const calendar = document.getElementById('rewards-calendar');
        const claimSection = document.getElementById('claim-reward-section');
        const claimedSection = document.getElementById('reward-claimed');

        const canClaim = this.rewards.canClaimDailyReward();
        const streak = this.profile.data.streak;
        const calendarData = this.rewards.getRewardsCalendar();

        // Update streak display
        document.getElementById('daily-streak-count').textContent = streak;

        // Update claim button
        const rewardAmount = this.rewards.getDailyRewardAmount(streak);
        document.getElementById('claim-coin-amount').textContent = rewardAmount;

        // Render calendar
        calendar.innerHTML = calendarData.map((day, index) => {
            const isCurrentDay = index < streak;
            const isClaimed = isCurrentDay;
            const hasBonus = day.bonus;

            return `
                <div class="calendar-day ${isClaimed ? 'claimed' : ''} ${index === streak ? 'current' : ''}">
                    <div class="day-number">${day.day}</div>
                    <div class="day-reward">
                        <span class="day-coins">${day.reward}</span>
                        <span class="day-coin-icon">🪙</span>
                    </div>
                    ${hasBonus ? `<div class="day-bonus">${day.bonus}</div>` : ''}
                    ${isClaimed ? `<div class="day-claimed">✓</div>` : ''}
                </div>
            `;
        }).join('');

        // Show appropriate section
        if (canClaim) {
            claimSection.style.display = 'block';
            claimedSection.style.display = 'none';
        } else {
            claimSection.style.display = 'none';
            claimedSection.style.display = 'flex';
        }

        popup.classList.add('active');

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('medium');
        }
    }

    hideDailyRewardsPopup() {
        const popup = document.getElementById('daily-rewards-popup');
        popup.classList.remove('active');

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    claimDailyReward() {
        const result = this.rewards.claimDailyReward();

        if (result.success) {
            this.updateCoinDisplay();
            this.checkDailyReward();
            this.showDailyRewardsPopup(); // Re-render to show claimed state

            // Show success notification
            this.showNotification(`🎉 You earned ${result.coins} coins! Streak bonus: x${result.multiplier}`);

            // Haptic feedback
            if (this.tg && this.tg.HapticFeedback) {
                this.tg.HapticFeedback.notificationOccurred('success');
            }
        } else {
            this.showNotification('You already claimed today\'s reward!');
        }
    }

    showCoinEarnedNotification(coins) {
        if (coins > 0) {
            this.showNotification(`🪙 +${coins} coins earned!`);
        }
    }

    showNotification(message) {
        if (this.tg && this.tg.showAlert) {
            this.tg.showAlert(message);
        } else {
            alert(message);
        }
    }

    switchCategory(category) {
        this.currentCategory = category;

        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Reload games
        this.loadGames();

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    handleSearch(e) {
        this.searchQuery = e.target.value;
        this.clearSearchBtn.style.display = this.searchQuery ? 'block' : 'none';
        this.loadGames();
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchQuery = '';
        this.clearSearchBtn.style.display = 'none';
        this.loadGames();
        this.searchInput.focus();
    }

    toggleFavorite(gameId, btn) {
        const isFavorite = this.favorites.toggleFavorite(gameId);

        // Update button state
        if (btn) {
            btn.classList.toggle('active', isFavorite);
        }

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred(isFavorite ? 'medium' : 'light');
        }

        // If in favorites category, reload to show/hide the game
        if (this.currentCategory === 'favorites') {
            this.loadGames();
        } else {
            // Just update the button without reloading
            this.loadGames();
        }
    }

    getUniqueCategories() {
        const categories = new Set(GAMES.map(game => game.category));
        return Array.from(categories).sort();
    }

    showProfile() {
        this.updateProfileUI();
        this.portalView.classList.remove('active');
        this.profileView.classList.add('active');

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    hideProfile() {
        this.profileView.classList.remove('active');
        this.portalView.classList.add('active');

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    updateStatsBar() {
        const data = this.profile.data;
        document.getElementById('stat-games').textContent = data.totalGames;
        document.getElementById('stat-time').textContent = this.formatPlaytime(data.totalPlaytime);
        document.getElementById('stat-score').textContent = data.bestScore;
    }

    updateProfileUI() {
        const data = this.profile.data;

        document.getElementById('profile-avatar').textContent = data.avatar;
        document.getElementById('profile-avatar-large').textContent = data.avatar;
        document.getElementById('profile-name').textContent = data.name;
        document.getElementById('profile-level').textContent = `Level ${data.level}`;

        const rank = this.leaderboard.getUserRank('global');
        document.getElementById('profile-rank').textContent = `Rank: #${rank}`;

        document.getElementById('profile-games').textContent = data.totalGames;
        document.getElementById('profile-playtime').textContent = this.formatPlaytime(data.totalPlaytime);
        document.getElementById('profile-highscore').textContent = data.bestScore;
        document.getElementById('profile-streak').textContent = `${data.streak} days`;

        // Update recent games
        const recentGamesEl = document.getElementById('recent-games');
        if (data.recentGames.length === 0) {
            recentGamesEl.innerHTML = '<p class="empty-text">No games played yet</p>';
        } else {
            recentGamesEl.innerHTML = data.recentGames.map(game => {
                const gameInfo = GAMES.find(g => g.id === game.gameId);
                const gameName = gameInfo ? gameInfo.name : 'Unknown Game';
                const timeAgo = this.getTimeAgo(game.timestamp);
                return `
                    <div class="recent-game-item">
                        <span class="recent-game-name">${gameName}</span>
                        <span class="recent-game-score">Score: ${game.score}</span>
                        <span class="recent-game-time">${timeAgo}</span>
                    </div>
                `;
            }).join('');
        }

        // Update achievements
        const achievementsEl = document.getElementById('achievements');
        if (data.achievements.length === 0) {
            achievementsEl.innerHTML = '<p class="empty-text">No achievements yet</p>';
        } else {
            achievementsEl.innerHTML = data.achievements.map(achievement => `
                <div class="achievement-item unlocked">
                    <span class="achievement-icon">${achievement.icon}</span>
                    <div class="achievement-info">
                        <span class="achievement-name">${achievement.name}</span>
                        <span class="achievement-desc">${achievement.desc}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    updateProfileRank() {
        const rank = this.leaderboard.getUserRank('global');
        const rankEl = document.getElementById('profile-rank');
        if (rankEl) {
            rankEl.textContent = `Rank: #${rank}`;
        }
    }

    updateLeaderboardPreview() {
        const topPlayers = this.leaderboard.getGlobalLeaderboard().slice(0, 3);
        const previewListEl = document.getElementById('leaderboard-preview-list');

        if (topPlayers.length === 0) {
            previewListEl.innerHTML = '<p class="empty-text">No players yet</p>';
            return;
        }

        previewListEl.innerHTML = topPlayers.map((player, index) => {
            const rankBadge = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
            return `
                <div class="preview-item">
                    <span class="preview-rank">${rankBadge}</span>
                    <span class="preview-avatar">${player.avatar}</span>
                    <span class="preview-name">${player.name}</span>
                    <span class="preview-score">${player.score.toLocaleString()}</span>
                </div>
            `;
        }).join('');
    }

    showLeaderboard() {
        this.renderLeaderboard();
        this.portalView.classList.remove('active');
        this.leaderboardView.classList.add('active');

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    hideLeaderboard() {
        this.leaderboardView.classList.remove('active');
        this.portalView.classList.add('active');

        // Haptic feedback
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    renderLeaderboard() {
        // Render active tab
        switch (this.currentLeaderboardTab) {
            case 'global':
                this.renderGlobalLeaderboard();
                break;
            case 'friends':
                this.renderFriendsLeaderboard();
                break;
            case 'games':
                this.renderGameLeaderboard();
                break;
        }
    }

    switchLeaderboardTab(tab) {
        this.currentLeaderboardTab = tab;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Update sections
        document.querySelectorAll('.leaderboard-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`section-${tab}`).classList.add('active');

        this.renderLeaderboard();
    }

    renderGlobalLeaderboard() {
        const leaderboard = this.leaderboard.getGlobalLeaderboard();
        const container = document.getElementById('global-leaderboard');
        this.renderLeaderboardList(container, leaderboard, 'global');
    }

    renderFriendsLeaderboard() {
        const leaderboard = this.leaderboard.getFriendsLeaderboard();
        const container = document.getElementById('friends-leaderboard');
        this.renderLeaderboardList(container, leaderboard, 'friends');
    }

    renderGameLeaderboard() {
        // Render game selector
        const selectorEl = document.getElementById('game-leaderboard-selector');
        selectorEl.innerHTML = GAMES.map(game => `
            <button class="game-selector-btn ${game.id === this.currentGameLeaderboardId ? 'active' : ''}"
                    data-game-id="${game.id}">
                ${game.emoji} ${game.name}
            </button>
        `).join('');

        // Add click listeners
        selectorEl.querySelectorAll('.game-selector-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentGameLeaderboardId = btn.dataset.gameId;
                this.renderGameLeaderboard();
            });
        });

        // Render leaderboard for selected game
        const leaderboard = this.leaderboard.getGameLeaderboard(this.currentGameLeaderboardId);
        const container = document.getElementById('game-leaderboard');
        this.renderLeaderboardList(container, leaderboard, 'game');
    }

    renderLeaderboardList(container, leaderboard, type) {
        const userName = this.profile.data.name;

        if (leaderboard.length === 0) {
            container.innerHTML = '<p class="empty-text">No players yet</p>';
            return;
        }

        container.innerHTML = leaderboard.map((player, index) => {
            const isCurrentUser = player.name === userName;
            const rankClass = index < 3 ? `rank-${index + 1}` : '';
            const rankBadge = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${player.rank}`;

            return `
                <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''} ${rankClass}">
                    <span class="lb-rank">${rankBadge}</span>
                    <span class="lb-avatar">${player.avatar}</span>
                    <div class="lb-info">
                        <span class="lb-name">${player.name}</span>
                        <span class="lb-stats">${player.games || 0} games</span>
                    </div>
                    <span class="lb-score">${player.score.toLocaleString()}</span>
                </div>
            `;
        }).join('');
    }

    formatPlaytime(seconds) {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        return `${Math.floor(seconds / 3600)}h`;
    }

    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    setupEventListeners() {
        this.backBtn.addEventListener('click', () => this.goBack());
        this.profileBackBtn.addEventListener('click', () => this.hideProfile());
        this.leaderboardBackBtn.addEventListener('click', () => this.hideLeaderboard());
        this.leaderboardMoreBtn.addEventListener('click', () => this.showLeaderboard());
        this.profileBtn.addEventListener('click', () => this.showProfile());
        this.shareBtn.addEventListener('click', () => this.showSharePopup());

        // Search
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        this.clearSearchBtn.addEventListener('click', () => this.clearSearch());

        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchCategory(btn.dataset.category);
            });
        });

        // Daily rewards
        document.getElementById('daily-rewards-btn').addEventListener('click', () => this.showDailyRewardsPopup());
        document.getElementById('close-rewards-popup').addEventListener('click', () => this.hideDailyRewardsPopup());
        document.getElementById('claim-reward-btn').addEventListener('click', () => this.claimDailyReward());

        // Share popup
        document.getElementById('close-share-popup').addEventListener('click', () => this.hideSharePopup());
        document.getElementById('share-telegram').addEventListener('click', () => this.shareToTelegram());
        document.getElementById('share-friend').addEventListener('click', () => this.shareToFriend());
        document.getElementById('share-generic').addEventListener('click', () => this.shareGeneric());

        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.useTemplate(btn.dataset.template);
            });
        });

        // Close popups when clicking outside
        document.getElementById('daily-rewards-popup').addEventListener('click', (e) => {
            if (e.target.id === 'daily-rewards-popup') {
                this.hideDailyRewardsPopup();
            }
        });

        document.getElementById('share-popup').addEventListener('click', (e) => {
            if (e.target.id === 'share-popup') {
                this.hideSharePopup();
            }
        });

        // Leaderboard tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchLeaderboardTab(btn.dataset.tab);
            });
        });

        // Handle Telegram back button
        if (this.tg && this.tg.BackButton) {
            this.tg.BackButton.show();
            this.tg.BackButton.onClick(() => {
                if (this.gameView.classList.contains('active')) {
                    this.goBack();
                } else if (this.profileView.classList.contains('active')) {
                    this.hideProfile();
                } else if (this.leaderboardView.classList.contains('active')) {
                    this.hideLeaderboard();
                } else if (document.getElementById('daily-rewards-popup').classList.contains('active')) {
                    this.hideDailyRewardsPopup();
                } else if (document.getElementById('share-popup').classList.contains('active')) {
                    this.hideSharePopup();
                } else {
                    this.tg.close();
                }
            });
        }

        // Handle game frame errors
        this.gameFrame.addEventListener('error', () => {
            console.error('Failed to load game:', this.currentGame?.url);
            alert('Failed to load game. Please try again.');
            this.goBack();
        });

        // Listen for messages from iframe (game scores)
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'gameScore') {
                if (this.currentSession) {
                    this.currentSession.score = event.data.score;
                }
            }
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GamePortal();
});
