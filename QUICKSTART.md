# OwnerClone CMS - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
cd ownerclone-cms
npm install
```

### 2. Setup Supabase

**Create Account:**
- Go to https://supabase.com
- Sign up (free tier is fine)
- Create new project (takes ~2 minutes)

**Run Database Schema:**
- In Supabase dashboard: SQL Editor
- Copy contents of `lib/db/schema.sql`
- Run the SQL

**Get Your Credentials:**
- Settings → API
- Copy "Project URL" and "anon public" key

### 3. Configure Environment
```bash
# Copy template
cp .env.local.example .env.local

# Edit .env.local with your credentials
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### 4. Run Development Server
```bash
npm run dev
```

Open: http://localhost:3000

## ✅ You're Done!

You should see the CMS dashboard. Try:
1. Click "New Script"
2. Type: `INT. RESTAURANT - DAY`
3. Press ENTER and type a character name in ALL CAPS
4. Watch the auto-formatting work!

## 🎬 Screenplay Editor Tips

**Auto-Formatting:**
- `INT.` or `EXT.` → Scene heading
- `ALL CAPS` → Character name
- After character → Dialogue
- `(text)` → Parenthetical

**Keyboard Shortcuts:**
- `TAB` → Change element type
- `ENTER` → New line
- `BACKSPACE` (on empty line) → Delete line
- `⌘S` / `CTRL+S` → Save

## 📝 Next Actions

1. **Create some characters** (Characters tab)
   - Add personality traits
   - Add voice notes for AI

2. **Write a script** (Scripts tab)
   - Title it
   - Add a logline
   - Start writing

3. **Check auto-save** (saves every 10 seconds automatically)

## 🐛 Problems?

**Can't connect to database?**
- Check `.env.local` has correct values
- Verify Supabase project is active
- Make sure you ran the schema SQL

**Dependencies won't install?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors?**
```bash
npm run build
```

## 🚀 Deploy to Vercel (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

## 📚 Full Documentation

See `README.md` for complete documentation and upcoming features.

---

**Session 1 Complete ✅**

Ready to build Session 2 (AI Integration) whenever you are!
