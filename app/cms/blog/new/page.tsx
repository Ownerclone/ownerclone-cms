'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogNewRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/cms/blogpostsposts/new');
  }, [router]);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-gray-500">Redirecting...</div>
    </div>
  );
}
