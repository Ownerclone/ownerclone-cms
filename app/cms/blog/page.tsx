'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/cms/blogposts');
  }, [router]);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-gray-500">Redirecting...</div>
    </div>
  );
}
