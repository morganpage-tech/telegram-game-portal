// Game Portal Configuration
// Add your games here

const GAMES = [
    {
        id: 'snake',
        name: 'Snake Classic',
        category: 'Arcade',
        emoji: '🐍',
        thumbnail: null, // Optional: path to thumbnail image
        url: 'games/snake.html',
        description: 'Classic snake game'
    },
    {
        id: 'pong',
        name: 'Pong',
        category: 'Sports',
        emoji: '🏓',
        thumbnail: null,
        url: 'games/pong.html',
        description: 'Table tennis classic'
    },
    {
        id: 'tictactoe',
        name: 'Tic Tac Toe',
        category: 'Puzzle',
        emoji: '⭕',
        thumbnail: null,
        url: 'games/tictactoe.html',
        description: 'Three in a row'
    },
    {
        id: 'breakout',
        name: 'Breakout',
        category: 'Arcade',
        emoji: '🧱',
        thumbnail: null,
        url: 'games/breakout.html',
        description: 'Break all the bricks'
    },
    {
        id: 'memory',
        name: 'Memory Match',
        category: 'Puzzle',
        emoji: '🧠',
        thumbnail: null,
        url: 'games/memory.html',
        description: 'Test your memory'
    },
    {
        id: 'flappy',
        name: 'Flappy Bird',
        category: 'Arcade',
        emoji: '🐦',
        thumbnail: null,
        url: 'games/flappy.html',
        description: 'Navigate through pipes'
    }
];

// Portal settings
const PORTAL_CONFIG = {
    // Enable/disable features
    showCategory: true,
    showEmoji: true,
    showProfile: true,
    showStatsBar: true,

    // Default game size
    defaultGameWidth: '100%',
    defaultGameHeight: '100%',

    // Theme colors (overrides Telegram theme)
    customColors: {
        primary: '#3390ec',
        secondary: '#16213e'
    },

    // Profile settings
    profile: {
        // Maximum recent games to display
        maxRecentGames: 10,

        // Level calculation (playtime in seconds per level)
        secondsPerLevel: 600, // 10 minutes = 1 level

        // Enable Telegram user integration
        useTelegramUser: true
    },

    // Achievements
    achievements: [
        { id: 'first_game', name: 'First Steps', icon: '🎮', desc: 'Play your first game', gamesRequired: 1 },
        { id: 'ten_games', name: 'Game Enthusiast', icon: '🔥', desc: 'Play 10 games', gamesRequired: 10 },
        { id: 'fifty_games', name: 'Gamer', icon: '🎯', desc: 'Play 50 games', gamesRequired: 50 },
        { id: 'hundred_games', name: 'Legend', icon: '👑', desc: 'Play 100 games', gamesRequired: 100 },
        { id: 'score_100', name: 'Centurion', icon: '💯', desc: 'Score 100 points', scoreRequired: 100 },
        { id: 'score_500', name: 'High Scorer', icon: '🏆', desc: 'Score 500 points', scoreRequired: 500 },
        { id: 'score_1000', name: 'Champion', icon: '🥇', desc: 'Score 1000 points', scoreRequired: 1000 },
        { id: 'streak_3', name: 'Consistent', icon: '📅', desc: '3 day streak', streakRequired: 3 },
        { id: 'streak_7', name: 'Dedicated', icon: '⭐', desc: '7 day streak', streakRequired: 7 },
        { id: 'streak_30', name: 'Master', icon: '💎', desc: '30 day streak', streakRequired: 30 },
        { id: 'playtime_1h', name: 'Time Player', icon: '⏱️', desc: 'Play for 1 hour total', playtimeRequired: 3600 },
        { id: 'playtime_10h', name: 'Marathon Gamer', icon: '🏅', desc: 'Play for 10 hours total', playtimeRequired: 36000 },
        { id: 'level_10', name: 'Rising Star', icon: '🌟', desc: 'Reach level 10', levelRequired: 10 },
        { id: 'level_50', name: 'Expert', icon: '🎖️', desc: 'Reach level 50', levelRequired: 50 },
        { id: 'all_games', name: 'Completionist', icon: '📚', desc: 'Play all games', requireAllGames: true },
        { id: 'coins_100', name: 'Coin Collector', icon: '🪙', desc: 'Earn 100 total coins', coinsRequired: 100 },
        { id: 'coins_500', name: 'Treasure Hunter', icon: '💰', desc: 'Earn 500 total coins', coinsRequired: 500 },
        { id: 'coins_1000', name: 'Coin Master', icon: '🏦', desc: 'Earn 1000 total coins', coinsRequired: 1000 },
        { id: 'coins_5000', name: 'Gold Tycoon', icon: '💵', desc: 'Earn 5000 total coins', coinsRequired: 5000 },
        { id: 'daily_7', name: 'Dedicated Player', icon: '🎁', desc: 'Claim 7 daily rewards', dailyRewardRequired: 7 },
        { id: 'daily_30', name: 'Loyal Player', icon: '🌟', desc: 'Claim 30 daily rewards', dailyRewardRequired: 30 }
    ],

    // Daily tasks configuration
    dailyTasks: {
        // Number of tasks per day
        tasksPerDay: 4,

        // Tasks available to choose from (will randomly select tasksPerDay)
        availableTasks: [
            // Gameplay tasks
            { id: 'play_games', name: 'Game Player', icon: '🎮', desc: 'Play 3 games', gamesRequired: 3, reward: 30 },
            { id: 'play_more_games', name: 'Dedicated Gamer', icon: '🎯', desc: 'Play 5 games', gamesRequired: 5, reward: 50 },
            { id: 'score_100', name: 'High Scorer', icon: '🏆', desc: 'Score 100 points in any game', scoreRequired: 100, reward: 25 },
            { id: 'score_500', name: 'Champion', icon: '🥇', desc: 'Score 500 points in any game', scoreRequired: 500, reward: 75 },
            { id: 'play_arcade', name: 'Arcade Fan', icon: '🕹️', desc: 'Play 2 arcade games', category: 'Arcade', categoryGamesRequired: 2, reward: 35 },
            { id: 'play_puzzle', name: 'Puzzle Master', icon: '🧩', desc: 'Play 2 puzzle games', category: 'Puzzle', categoryGamesRequired: 2, reward: 35 },
            { id: 'play_sports', name: 'Sports Star', icon: '⚽', desc: 'Play 2 sports games', category: 'Sports', categoryGamesRequired: 2, reward: 35 },

            // Engagement tasks
            { id: 'claim_daily', name: 'Daily Reward', icon: '🎁', desc: 'Claim your daily reward', dailyRewardRequired: true, reward: 20 },
            { id: 'share_score', name: 'Social Butterfly', icon: '📤', desc: 'Share your score', shareRequired: true, reward: 25 },
            { id: 'invite_friend', name: 'Good Friend', icon: '👥', desc: 'Invite 1 friend', inviteRequired: 1, reward: 100 },
            { id: 'view_leaderboard', name: 'Competitor', icon: '📊', desc: 'Check the leaderboard', viewLeaderboardRequired: true, reward: 15 },

            // Earning tasks
            { id: 'earn_coins_100', name: 'Coin Collector', icon: '🪙', desc: 'Earn 100 coins today', coinsEarnedRequired: 100, reward: 40 },
            { id: 'earn_coins_250', name: 'Treasure Hunter', icon: '💰', desc: 'Earn 250 coins today', coinsEarnedRequired: 250, reward: 75 },

            // Exploration tasks
            { id: 'try_new_game', name: 'Explorer', icon: '🔍', desc: 'Try a new game', newGameRequired: true, reward: 30 },
            { id: 'play_all_categories', name: 'Versatile Player', icon: '🎨', desc: 'Play games from 3 categories', categoriesRequired: 3, reward: 50 },

            // Social tasks
            { id: 'check_profile', name: 'Profile Master', icon: '👤', desc: 'Check your profile', viewProfileRequired: true, reward: 15 },
            { id: 'check_favorites', name: 'Favorites Fan', icon: '⭐', desc: 'View your favorites', viewFavoritesRequired: true, reward: 20 }
        ],

        // Timezone for daily reset (UTC offset in hours, e.g., -5 for EST, +0 for UTC)
        dailyResetTimezone: 0,

        // Bonus for completing all tasks
        allTasksBonus: 100
    },

    // Push notification configuration
    notifications: {
        // Enable/disable notifications
        enabled: true,

        // Bot token (replace with your bot token from @BotFather)
        // This is used to send notifications via Telegram Bot API
        botToken: '', // e.g., '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz'

        // Webhook URL for handling notifications (if using a backend)
        webhookUrl: '', // e.g., 'https://your-api.com/notifications'

        // Available notification types
        types: {
            dailyReminder: {
                id: 'daily_reminder',
                name: 'Daily Reminder',
                icon: '⏰',
                desc: 'Get reminded to play daily',
                enabledByDefault: true,
                defaultTime: '10:00', // HH:MM format
                template: '🎮 Don\'t forget to play today! Your daily reward is waiting!'
            },
            friendInvited: {
                id: 'friend_invited',
                name: 'Friend Invited',
                icon: '👥',
                desc: 'When someone accepts your invite',
                enabledByDefault: true,
                template: '🎉 {friend_name} accepted your invitation! You earned {reward} coins!'
            },
            leaderboardAlert: {
                id: 'leaderboard_alert',
                name: 'Leaderboard Alert',
                icon: '📊',
                desc: 'When someone beats your high score',
                enabledByDefault: false,
                template: '⚠️ {player} just beat your high score in {game}! Can you beat them back?'
            },
            newGameAvailable: {
                id: 'new_game',
                name: 'New Game',
                icon: '🎲',
                desc: 'When a new game is added',
                enabledByDefault: true,
                template: '🆕 New game "{game_name}" is now available! Come check it out!'
            },
            specialEvent: {
                id: 'special_event',
                name: 'Special Events',
                icon: '🎉',
                desc: 'Tournaments and special events',
                enabledByDefault: true,
                template: '🎉 {event_name} is happening now! {description}'
            },
            taskReminder: {
                id: 'task_reminder',
                name: 'Tasks Reminder',
                icon: '📋',
                desc: 'Reminder to complete daily tasks',
                enabledByDefault: true,
                defaultTime: '18:00', // HH:MM format
                template: '📋 You have {tasks_remaining} daily tasks remaining! {coins_available} coins still up for grabs!'
            }
        }
    }
};
