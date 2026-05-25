# Publish Pinverse to GitHub

## Option A — GitHub Desktop (easiest)

1. Install [GitHub Desktop](https://desktop.github.com/)
2. File → Add Local Repository → select your project folder
3. Publish repository → name it `pinverse` or `pinverse-app`
4. Push to GitHub

## Option B — Git CLI

```powershell
cd "c:\Users\viswanath b\Downloads\Pintrest"
git init
git add .
git commit -m "Initial commit: Pinverse full stack app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pinverse.git
git push -u origin main
```

## Option C — GitHub website

Upload project files (exclude `node_modules` and `.next`).

---

**Before pushing:** ensure `server/.env` and `client/.env.local` are NOT uploaded.
