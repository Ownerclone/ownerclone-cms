'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: string;
}

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch('/api/blog/' + resolvedParams.id);
        const data = await res.json();
        setPost(data.post);
      } catch (error) {
        console.error('Failed to load post:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadPost();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Post not found</h2>
          <Link href="/cms/blogposts" className="text-blue-600 hover:underline">
            Back to posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-8">
      <Link href="/cms/blogposts" className="text-blue-600 hover:underline mb-4">
        ← Back to posts
      </Link>
      
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="mb-4 text-sm text-gray-600">Status: {post.status}</div>
      
      {post.excerpt && (
        <div className="bg-gray-50 p-4 rounded mb-4">
          <strong>Excerpt:</strong> {post.excerpt}
        </div>
      )}
      
      <div className="prose max-w-none whitespace-pre-wrap">
        {post.content}
      </div>
    </div>
  );
}
