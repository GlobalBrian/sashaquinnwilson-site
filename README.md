# Sasha Quinn Wilson Website

Professional portfolio website for Sasha Quinn Wilson (Sassy), with an Instagram-driven gallery.

## What is included
- Premium one-page design optimized for mobile and desktop.
- Featured collaborations section.
- Auto-updating gallery from Instagram data in `content/posts.json`.
- GitHub Actions workflow to refresh gallery every 6 hours.

## Local preview
```bash
npx serve .
```
Open the URL shown by `serve`.

## Instagram auto-sync setup
1. Convert the Instagram account to **Professional (Creator or Business)**.
2. Link that Instagram account to a Facebook Page.
3. Create a Meta app and enable Instagram Graph API access.
4. Generate a long-lived user access token with permissions to read Instagram media.
5. Get:
   - `IG_ACCESS_TOKEN` (long-lived token)
   - `IG_USER_ID` (numeric Instagram Business Account ID)
6. In your GitHub repository, set these under **Settings -> Secrets and variables -> Actions**:
   - `IG_ACCESS_TOKEN`
   - `IG_USER_ID`
7. Push this project to GitHub and enable Actions.
8. Run **Sync Instagram Gallery** once manually (`workflow_dispatch`) to verify.

## Domain setup
Point `sashaquinnwilson.com` to your hosting provider (for example GitHub Pages, Vercel, or Netlify), then set HTTPS and the custom domain.

## Notes
- The script writes latest posts into `content/posts.json`.
- If token expires, refresh it and update the repository secret.
- To run sync locally:
```bash
IG_ACCESS_TOKEN=... IG_USER_ID=... npm run sync:instagram
```
