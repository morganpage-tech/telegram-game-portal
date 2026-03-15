# GitHub Pages Setup Guide

## ✅ Steps Completed

1. ✅ GitHub repository created at `morganpage-tech/telegram-game-portal`
2. ✅ All code pushed to GitHub
3. ✅ GitHub Actions workflow configured for Pages deployment

## 🚀 Remaining Steps (Manual)

### Step 1: Enable GitHub Pages

1. Go to: https://github.com/morganpage-tech/telegram-game-portal/settings/pages

2. **Source settings:**
   - **Build and deployment** → **Source**: Select "GitHub Actions" (NOT "Deploy from a branch")

3. Click **Save**

4. Your site will deploy automatically in 1-3 minutes

### Step 2: Verify Deployment

1. Go to: https://github.com/morganpage-tech/telegram-game-portal/actions

2. Wait for the "Deploy static content to Pages" workflow to complete (green checkmark)

3. Visit your site: https://morganpage-tech.github.io/telegram-game-portal/

### Step 3: Custom Domain (Optional)

If you want a custom domain (e.g., `games.yourdomain.com`):

1. Buy a domain (GoDaddy, Namecheap, etc.)
2. In Pages settings, click "Add a domain"
3. Follow the DNS instructions provided by GitHub

## 📱 Telegram Mini App Setup

Once GitHub Pages is live:

1. Open Telegram and message @BotFather
2. Send `/newapp` to create a new Mini App
3. Follow the prompts:
   - Choose your bot (or create a new one)
   - Set a title: "Game Portal"
   - Set a short description: "Play 6 fun games!"
   - Set the Web App URL: `https://morganpage-tech.github.io/telegram-game-portal/`
4. BotFather will give you the Mini App link

## 🔧 Troubleshooting

### Deployment Fails

Check the Actions tab for error messages:
- https://github.com/morganpage-tech/telegram-game-portal/actions

Common issues:
- ✅ Workflow file permissions
- ✅ Branch protection rules

### Site Not Loading

Wait 2-3 minutes after the workflow completes for DNS to propagate.

### Updates

Any push to the `main` branch will automatically redeploy your site!

```bash
git add .
git commit -m "Your update message"
git push
```

## 📊 Analytics (Optional)

To add analytics:

1. Sign up for Google Analytics
2. Get your tracking ID (G-XXXXXXXXXX)
3. Add to `index.html` in the `<head>` section:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🎉 Next Steps

After your site is live:

1. Share it with friends!
2. Add more games to the `games/` directory
3. Customize the colors in `css/style.css`
4. Add your own branding
