# OwnerClone CMS

A screenplay-first content management system built for restaurant content creation with AI integrations.

## 🎬 Overview

This CMS is optimized for a unique workflow that starts with screenplay-formatted content and cascades it to blog posts, social media, images, and videos. Perfect for content creators with a screenwriting background.

## ✨ Features (Session 1 Complete)

### Core CMS
- ✅ Screenplay editor with auto-formatting
- ✅ Character database with personality traits
- ✅ Real-time auto-save
- ✅ Version history tracking
- ✅ Content status management (draft/review/published)

### Screenplay Editor
- **Auto-formatting as you type**: INT./EXT., CHARACTER names, dialogue, etc.
- **Keyboard shortcuts**: TAB (cycle element types), ENTER (new line), ⌘S (save)
- **Element types**: Scene headings, action, character, dialogue, parenthetical, transition
- **Visual feedback**: Type indicators on hover
- **Fountain-compatible**: Industry-standard screenplay format

### Character System
- Create detailed character profiles
- Personality traits tagging
- Voice notes for AI consistency
- Avatar support
- Character database for screenplay context

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **AI**: Anthropic Claude (Session 2)

## 📋 Upcoming Sessions

### Session 2: AI Integration
- Claude writing assistant
- Voice-to-text dictation
- Character-aware dialogue generation
- Context loading

### Session 3: Content Conversion
- Script → Blog post conversion
- Script → Social media posts
- AI-powered content enhancement
- SEO optimization

### Session 4: Media Generation
- DALL-E image generation
- HeyGen avatar videos
- Media library management
- Brand consistency tools

### Session 5: Publishing & Analytics
- Facebook/Instagram posting
- Content calendar
- Scheduling system
- Performance analytics

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Vercel account (for deployment)

### Step 1: Clone and Install

```bash
cd ownerclone-cms
npm install
```

### Step 2: Database Setup

1. Create a new Supabase project at https://supabase.com
2. In your Supabase project, go to SQL Editor
3. Run the schema from `lib/db/schema.sql`

### Step 3: Environment Variables

1. Copy the environment template:
```bash
cp .env.local.example .env.local
```

2. Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in: Supabase Dashboard → Settings → API

### Step 4: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 - you'll be redirected to `/cms`

### Step 5: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Settings → Environment Variables
```

## 📁 Project Structure

```
ownerclone-cms/
├── app/
│   ├── cms/                    # CMS pages
│   │   ├── scripts/            # Screenplay management
│   │   ├── characters/         # Character database
│   │   ├── blog/               # Blog posts (Session 3)
│   │   ├── media/              # Media library (Session 4)
│   │   └── social/             # Social publishing (Session 5)
│   └── api/                    # API routes
├── components/
│   ├── editor/
│   │   └── ScreenplayEditor.tsx  # Main screenplay editor
│   ├── ai/                     # AI components (Session 2)
│   ├── media/                  # Media components (Session 4)
│   └── social/                 # Social components (Session 5)
├── lib/
│   ├── db/
│   │   ├── schema.sql          # Database schema
│   │   └── supabase.ts         # Supabase client
│   ├── screenplay/
│   │   └── formatter.ts        # Auto-formatting engine
│   ├── ai/                     # AI utilities (Session 2)
│   └── converters/             # Content converters (Session 3)
└── types/
    └── screenplay.ts           # TypeScript types
```

## 🎯 Usage Guide

### Creating a Script

1. Navigate to **Scripts** in sidebar
2. Click **New Script**
3. Enter title and optional logline
4. Start writing with auto-formatting

### Screenplay Shortcuts

| Shortcut | Action |
|----------|--------|
| `TAB` | Cycle element type |
| `ENTER` | New line |
| `BACKSPACE` (empty line) | Delete line |
| `⌘S` / `CTRL+S` | Save |

### Auto-Formatting Rules

- Type `INT.` or `EXT.` → Converts to **SCENE HEADING**
- Type in ALL CAPS → Becomes **CHARACTER NAME**
- Text after character → Becomes **DIALOGUE**
- Text in `(parentheses)` → Becomes **PARENTHETICAL**
- `CUT TO:`, `FADE IN:` → Becomes **TRANSITION**

### Creating Characters

1. Navigate to **Characters** in sidebar
2. Click **New Character**
3. Fill in:
   - Name (required)
   - Description
   - Personality traits
   - Voice notes (for AI consistency)
4. Characters are available in screenplay context

## 🔧 API Endpoints

### Scripts
- `GET /api/scripts` - List all scripts
- `GET /api/scripts?status=draft` - Filter by status
- `POST /api/scripts` - Create script
- `GET /api/scripts/[id]` - Get single script
- `PATCH /api/scripts/[id]` - Update script
- `DELETE /api/scripts/[id]` - Delete script

### Characters
- `GET /api/characters` - List all characters
- `POST /api/characters` - Create character
- `GET /api/characters/[id]` - Get single character
- `PATCH /api/characters/[id]` - Update character
- `DELETE /api/characters/[id]` - Delete character

## 💾 Database Schema

### scripts
- `id` (uuid, primary key)
- `title` (varchar)
- `logline` (text)
- `elements` (jsonb) - Structured screenplay content
- `status` (varchar) - draft, review, published
- `metadata` (jsonb) - Genre, keywords, etc.
- Timestamps: created_at, updated_at

### characters
- `id` (uuid, primary key)
- `name` (varchar)
- `description` (text)
- `personality_traits` (jsonb array)
- `voice_notes` (text) - For AI consistency
- `avatar_url` (varchar)
- Timestamp: created_at

### script_characters
- `script_id` (uuid, foreign key)
- `character_id` (uuid, foreign key)

## 🎨 Customization

### Styling
Edit `app/globals.css` for global styles
Edit component files for component-specific styles

### Screenplay Formatting
Modify `lib/screenplay/formatter.ts` to adjust auto-formatting rules

### Element Types
Add new element types in `types/screenplay.ts`

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection issues
- Verify environment variables in `.env.local`
- Check Supabase project is active
- Ensure schema has been run

### TypeScript errors
```bash
npm run build
```

## 📝 Development Workflow

1. **Write scripts** in screenplay editor
2. **Save automatically** (auto-save every 10 seconds)
3. **Create characters** for consistent AI generation
4. **(Session 2)** Use AI assistant for dialogue
5. **(Session 3)** Convert scripts to blog posts
6. **(Session 4)** Generate images and videos
7. **(Session 5)** Publish to social media

## 🔐 Security Notes

- Never commit `.env.local` to git
- Rotate API keys regularly
- Use Supabase Row Level Security (RLS) in production
- Implement authentication before public deployment

## 📊 Next Steps for Session 2

1. Get Anthropic API key from https://console.anthropic.com
2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Ready to build AI writing assistant

## 🤝 Contributing

This is a personal project for OwnerClone, but the architecture can be adapted for other use cases.

## 📄 License

Private - OwnerClone Internal Use

---

**Built with ❤️ for restaurant content creation**

Session 1 Complete ✅
- Core CMS foundation
- Screenplay editor with auto-formatting
- Character database
- API infrastructure

Ready for Session 2: AI Integration 🚀
