# OwnerClone CMS - Technical Architecture

## System Overview

A screenplay-first CMS that transform screenplay-formatted content into multiple output formats (blog posts, social media, images, videos) using AI assistance.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 14)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Screenplay │  │  Character   │  │     Blog     │     │
│  │    Editor    │  │   Database   │  │    Editor    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Media     │  │    Social    │  │   Calendar   │     │
│  │   Library    │  │  Publisher   │  │   Scheduler  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Routes
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │   Screenplay Logic   │  │  Content Conversion  │        │
│  │  • Auto-formatting   │  │  • Script → Blog     │        │
│  │  • Element detection │  │  • Script → Social   │        │
│  │  • Version control   │  │  • SEO optimization  │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │   Supabase   │ │  Claude API  │ │  DALL-E API  │
    │  (Database)  │ │  (AI Text)   │ │  (Images)    │
    └──────────────┘ └──────────────┘ └──────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │   HeyGen     │ │  Meta Graph  │ │   Vercel     │
    │  (Videos)    │ │   (Social)   │ │  (Hosting)   │
    └──────────────┘ └──────────────┘ └──────────────┘
```

## Data Flow

### 1. Content Creation Flow
```
User Input → Screenplay Formatter → Structured Elements
                                          ↓
                                    Supabase Save
                                          ↓
                            ┌─────────────┴─────────────┐
                            ▼                           ▼
                      Character Context          Version History
```

### 2. AI-Assisted Writing Flow (Session 2)
```
User Request → Load Character Context → Claude API
                                          ↓
                              Streaming Response
                                          ↓
                              Update Script Elements
                                          ↓
                                    Save Changes
```

### 3. Content Conversion Flow (Session 3)
```
Published Script → AI Conversion → Blog Post Draft
                                          ↓
                                    SEO Enhancement
                                          ↓
                              Multiple Social Posts
```

### 4. Media Generation Flow (Session 4)
```
Content + Prompt → DALL-E → Images → Media Library
                     ↓
                  HeyGen → Videos → Media Library
```

### 5. Publishing Flow (Session 5)
```
Content + Media → Scheduler → Queue
                                ↓
                          Facebook/Instagram
                                ↓
                          Analytics Tracking
```

## Component Architecture

### Screenplay Editor
```typescript
ScreenplayEditor
├── TextareaAutosize (per element)
├── Auto-formatter
│   ├── Scene heading detection
│   ├── Character name detection
│   ├── Dialogue formatting
│   └── Transition detection
├── Keyboard handler
│   ├── TAB (cycle types)
│   ├── ENTER (new line)
│   └── CMD+S (save)
└── Auto-save system
```

### Character System
```typescript
Character Database
├── Character profiles
│   ├── Name
│   ├── Description
│   ├── Personality traits
│   └── Voice notes
├── Context loader
│   └── Load into AI prompts
└── Avatar management
```

### AI Integration (Session 2)
```typescript
AI Assistant
├── Claude client
├── Prompt templates
│   ├── Continue scene
│   ├── Punch up dialogue
│   └── Character-specific
├── Streaming handler
└── Token tracker
```

## Database Design

### Entity Relationships
```
scripts (1) ─────┬───── (N) script_versions
                 │
                 └───── (N) script_characters ───── (1) characters
                 │
                 └───── (1) blog_posts
                 │
                 └───── (N) social_posts
                              │
                              └───── (N) media_assets
```

### Key Tables

**scripts**
- Stores screenplay elements as JSONB array
- Status tracking for workflow
- Metadata for SEO and targeting

**characters**
- Reusable character database
- AI consistency through voice notes
- Personality traits for context

**script_versions**
- Snapshot-based version control
- Enables undo/redo
- History tracking

**blog_posts**
- Converted content storage
- Source script tracking
- SEO metadata

**media_assets**
- Polymorphic associations
- Generation metadata
- Cost tracking

**social_posts**
- Multi-platform support
- Scheduling system
- Analytics integration

## API Architecture

### RESTful Endpoints

**Scripts API**
```
GET    /api/scripts              List scripts
GET    /api/scripts?status=draft Filter by status
POST   /api/scripts              Create script
GET    /api/scripts/[id]         Get script
PATCH  /api/scripts/[id]         Update script
DELETE /api/scripts/[id]         Delete script
```

**Characters API**
```
GET    /api/characters           List characters
POST   /api/characters           Create character
GET    /api/characters/[id]      Get character
PATCH  /api/characters/[id]      Update character
DELETE /api/characters/[id]      Delete character
```

**AI API (Session 2)**
```
POST   /api/ai/generate          Generate content
POST   /api/ai/voice-process     Process voice input
GET    /api/ai/usage             Get usage stats
```

**Conversion API (Session 3)**
```
POST   /api/convert/script-to-blog    Convert script
POST   /api/convert/script-to-social  Generate social posts
POST   /api/convert/optimize-seo      Optimize for SEO
```

**Media API (Session 4)**
```
POST   /api/media/generate-image  Generate image
POST   /api/media/generate-video  Generate video
GET    /api/media                 List media
DELETE /api/media/[id]            Delete media
```

**Social API (Session 5)**
```
POST   /api/social/post           Post to platform
POST   /api/social/schedule       Schedule post
GET    /api/social/queue          Get queue
GET    /api/analytics             Get analytics
```

## State Management

### Client State (React)
- Component-level useState for UI state
- No global state manager initially (can add Zustand if needed)

### Server State
- Next.js App Router handles server state
- Data fetching in Server Components where possible
- Client Components for interactive features

### Caching Strategy
- Supabase handles database caching
- Next.js handles route caching
- Consider Redis for session data if needed

## Security Architecture

### Authentication (Future)
```
NextAuth.js
├── Providers
│   ├── Email/Password
│   └── Google OAuth
├── Session management
└── Protected routes
```

### Authorization
```
Role-based Access Control
├── Admin (full access)
├── Editor (write content)
└── Viewer (read only)
```

### Data Protection
- Environment variables for secrets
- Supabase Row Level Security (RLS)
- API rate limiting
- Input sanitization

## Performance Optimizations

### Current
- Component code splitting (Next.js automatic)
- Image optimization (next/image)
- Auto-save debouncing (10 seconds)
- Lazy loading of editor

### Future Optimizations
- CDN for static assets
- Redis for session caching
- Background job queue for conversions
- Optimistic UI updates
- Incremental Static Regeneration (ISR)

## Error Handling

### Frontend
```typescript
try {
  await apiCall();
} catch (error) {
  console.error('Operation failed:', error);
  // Show user-friendly message
  // Log to error tracking service
}
```

### Backend
```typescript
try {
  const result = await operation();
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error(error);
  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  );
}
```

## Monitoring & Analytics

### Application Monitoring
- Vercel Analytics (built-in)
- Error tracking (future: Sentry)
- Performance monitoring

### AI Usage Tracking
```typescript
generation_logs table
├── Service (claude, dalle, heygen)
├── Prompt
├── Response
├── Cost
└── Tokens used
```

### Content Analytics
- View counts
- Engagement metrics
- Conversion rates
- Social performance

## Deployment Architecture

### Vercel Deployment
```
GitHub Repository
      ↓
   Push to main
      ↓
 Vercel Auto-Deploy
      ↓
 Production Environment
      ↓
 Environment Variables
      ↓
 Supabase Connection
```

### Environment Strategy
- Development: Local + Supabase dev project
- Staging: Vercel preview + Supabase staging
- Production: Vercel production + Supabase prod

## Scaling Considerations

### Current Capacity
- Single user (you)
- Low traffic
- Minimal database load

### Future Scaling
1. **Database**: Supabase scales automatically
2. **API**: Vercel serverless scales automatically
3. **Media**: Move to S3/R2 for large files
4. **Jobs**: Add queue system (Bull, BullMQ)
5. **Cache**: Add Redis for hot data

## Cost Estimates

### Monthly Costs (Production)
- Vercel: $20 (Pro plan)
- Supabase: $25 (Pro tier)
- Claude API: $50-200 (usage-based)
- DALL-E: $40-80 (usage-based)
- HeyGen: $99-299 (plan-based)
- **Total**: ~$234-624/month

### Cost Optimization
- Cache AI responses
- Batch media generation
- Use cheaper models when appropriate
- Monitor and set budget alerts

## Development Workflow

### Session-Based Development
```
Session 1: Foundation ✅
    ↓
Session 2: AI Integration
    ↓
Session 3: Content Conversion
    ↓
Session 4: Media Generation
    ↓
Session 5: Publishing & Analytics
```

### Git Workflow
```
main (production)
  ↓
develop (staging)
  ↓
feature/session-2-ai
  ↓
Pull Request → Review → Merge
```

## Testing Strategy

### Current
- Manual testing during development
- Type safety via TypeScript

### Future
- Unit tests (Jest + React Testing Library)
- Integration tests (Playwright)
- E2E tests for critical flows
- API tests with test database

## Documentation Strategy

### Code Documentation
- TypeScript types as documentation
- JSDoc comments for complex functions
- README files in each major directory

### User Documentation
- README.md (complete guide)
- QUICKSTART.md (5-minute setup)
- SESSIONS.md (development tracker)
- Inline help text in UI

## Technology Decisions

### Why Next.js 14?
- App Router for better performance
- Server Components reduce client JS
- Built-in API routes
- Vercel deployment optimization
- TypeScript support

### Why Supabase?
- PostgreSQL (robust, scalable)
- Built-in authentication ready
- Real-time capabilities
- Generous free tier
- Good DX with TypeScript

### Why Tailwind?
- Utility-first approach
- No CSS context switching
- Excellent IDE support
- Easy responsive design
- Small production bundle

### Why Claude API?
- Best-in-class for long-form writing
- Context window perfect for scripts
- Good at maintaining character voice
- Streaming support
- Reasonable pricing

## Future Enhancements

### Phase 2 Features
- Multi-user support
- Real-time collaboration
- Advanced version control (Git-style)
- Custom AI model fine-tuning
- Workflow automation (Zapier)

### Phase 3 Features
- Mobile app
- Offline mode
- Voice recording integration
- Advanced analytics
- Team management

---

**Architecture Version**: 1.0 (Session 1 Complete)
**Last Updated**: [Today]
**Next Review**: After Session 2
