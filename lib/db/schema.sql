-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Scripts table
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  logline TEXT,
  elements JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Characters table
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  personality_traits JSONB DEFAULT '[]',
  voice_notes TEXT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Script-Character relationships
CREATE TABLE script_characters (
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  PRIMARY KEY (script_id, character_id)
);

-- Content versions for undo/history
CREATE TABLE script_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  elements JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts (for future sessions)
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  seo_metadata JSONB DEFAULT '{}',
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  source_script_id UUID REFERENCES scripts(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media assets (for future sessions)
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  generation_prompt TEXT,
  generation_metadata JSONB DEFAULT '{}',
  associated_content_id UUID,
  associated_content_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social posts (for future sessions)
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  media_ids JSONB DEFAULT '[]',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE,
  post_url VARCHAR(500),
  source_script_id UUID REFERENCES scripts(id),
  analytics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI generation logs (for tracking costs)
CREATE TABLE generation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service VARCHAR(50) NOT NULL,
  prompt TEXT NOT NULL,
  response JSONB,
  cost DECIMAL(10,4),
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_scripts_status ON scripts(status);
CREATE INDEX idx_scripts_updated ON scripts(updated_at DESC);
CREATE INDEX idx_characters_name ON characters(name);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_social_posts_platform ON social_posts(platform);
CREATE INDEX idx_social_posts_scheduled ON social_posts(scheduled_for);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER scripts_updated_at
  BEFORE UPDATE ON scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
