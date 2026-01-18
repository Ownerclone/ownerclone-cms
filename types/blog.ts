export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seo_metadata: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
    og_image?: string;
  };
  status: 'draft' | 'review' | 'published';
  source_script_id?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostCreate {
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  seo_metadata?: BlogPost['seo_metadata'];
  status?: BlogPost['status'];
  source_script_id?: string;
}

export interface BlogPostUpdate {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  seo_metadata?: BlogPost['seo_metadata'];
  status?: BlogPost['status'];
}
