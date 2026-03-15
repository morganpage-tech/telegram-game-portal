# Push Notifications Setup Guide

This document explains how to set up the backend for sending Telegram push notifications.

## Overview

The notification system is already implemented in the frontend with:
- ✅ Notification preferences UI
- ✅ 6 notification types (daily reminder, friend invited, leaderboard alerts, etc.)
- ✅ Toggle switches for each notification type
- ✅ Time settings for reminder notifications
- ✅ Local storage for preferences

To send actual notifications, you need a backend server that uses the Telegram Bot API.

## Prerequisites

1. **Telegram Bot Token** - Get from [@BotFather](https://t.me/botfather)
2. **Backend Server** - Node.js, Python, or any web server
3. **Database** (optional) - For storing user preferences and chat IDs

## Notification Types

| Type | Icon | Default | Description |
|------|------|---------|-------------|
| Daily Reminder | ⏰ | On | Remind user to play daily |
| Friend Invited | 👥 | On | When someone accepts your invite |
| Leaderboard Alert | 📊 | Off | When someone beats your high score |
| New Game | 🎲 | On | When a new game is added |
| Special Events | 🎉 | On | Tournaments and special events |
| Tasks Reminder | 📋 | On | Reminder to complete daily tasks |

## Backend Setup (Node.js Example)

### 1. Install Dependencies
```bash
npm init -y
npm install express axios body-parser
```

### 2. Create Server
```javascript
// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Your bot token from @BotFather
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';

// Send notification to user
app.post('/send-notification', async (req, res) => {
  const { chatId, type, variables = {} } = req.body;

  const templates = {
    daily_reminder: (v) => `🎮 Don't forget to play today! Your daily reward is waiting!`,
    friend_invited: (v) => `🎉 ${v.friend_name} accepted your invitation! You earned ${v.reward} coins!`,
    leaderboard_alert: (v) => `⚠️ ${v.player} just beat your high score in ${v.game}! Can you beat them back?`,
    new_game: (v) => `🆕 New game "${v.game_name}" is now available! Come check it out!`,
    special_event: (v) => `🎉 ${v.event_name} is happening now! ${v.description}`,
    task_reminder: (v) => `📋 You have ${v.tasks_remaining} daily tasks remaining! ${v.coins_available} coins still up for grabs!`
  };

  const message = templates[type](variables);

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Store webhook (for bot updates)
app.post('/webhook', async (req, res) => {
  const update = req.body;

  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const userId = update.message.from.id;

    // Store chat ID for user (save to your database)
    console.log(`User ${userId} chat ID: ${chatId}`);

    // Send welcome message
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: '🎮 Welcome to the Game Portal! Your notifications are now enabled.'
    });
  }

  res.sendStatus(200);
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 3. Set Up Webhook
```bash
curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook \
  -d url=https://your-server.com/webhook
```

### 4. Deploy
Deploy your server to:
- [Vercel](https://vercel.com)
- [Render](https://render.com)
- [Railway](https://railway.app)
- [Heroku](https://heroku.com)

## Frontend Integration

Update `js/config.js` with your webhook URL:

```javascript
notifications: {
  enabled: true,
  botToken: 'YOUR_BOT_TOKEN', // Optional: for frontend sending
  webhookUrl: 'https://your-server.com/send-notification',
  // ... rest of config
}
```

## Sending Notifications

### From Backend
```javascript
// Daily reminder (cron job)
await axios.post('https://your-server.com/send-notification', {
  chatId: userChatId,
  type: 'daily_reminder'
});

// Friend invited
await axios.post('https://your-server.com/send-notification', {
  chatId: referrerChatId,
  type: 'friend_invited',
  variables: {
    friend_name: 'John',
    reward: 100
  }
});
```

### Scheduled Notifications (Cron Jobs)

Use a cron job scheduler to send daily reminders:

```javascript
const cron = require('node-cron');

// Send daily reminders at 10:00 AM
cron.schedule('0 10 * * *', async () => {
  const users = await getAllUsersWithDailyReminderEnabled();
  
  for (const user of users) {
    await axios.post('https://your-server.com/send-notification', {
      chatId: user.chatId,
      type: 'daily_reminder'
    });
  }
});
```

## Testing

### Test Webhook
```bash
curl -X POST https://your-server.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"chat":{"id":123456789},"from":{"id":123456789},"text":"/start"}}'
```

### Test Notification
```bash
curl -X POST https://your-server.com/send-notification \
  -H "Content-Type: application/json" \
  -d '{"chatId":123456789,"type":"daily_reminder"}'
```

## Security Notes

1. **Never expose your bot token** in client-side code
2. **Validate all incoming data** to prevent injection attacks
3. **Use HTTPS** for all webhook endpoints
4. **Rate limit** notifications to avoid bot bans
5. **Store chat IDs securely** in your database

## Alternative: Third-Party Services

If you don't want to host your own backend:

### 1. Firebase Cloud Messaging (FCM)
- Set up Firebase project
- Add service worker to your app
- Use Firebase Admin SDK for sending

### 2. Supabase Realtime
- Set up Supabase project
- Use broadcast channels for notifications
- Simple setup, good for small apps

### 3. Pusher
- Push notification service
- Easy integration
- Free tier available

## Current Status

- ✅ Frontend UI fully implemented
- ✅ Notification preferences working
- ✅ Browser notification support (local)
- ⏳ Backend server required for Telegram notifications
- ⏳ Webhook setup needed for real-time updates

## Next Steps

1. Choose a backend solution (Node.js, Python, or service)
2. Deploy backend server
3. Set up Telegram webhook
4. Test notification delivery
5. Add scheduled jobs (daily reminders)

## Support

For issues or questions:
- Check [Telegram Bot API docs](https://core.telegram.org/bots/api)
- Review [Web App docs](https://core.telegram.org/bots/webapps)
- Check your server logs for errors
