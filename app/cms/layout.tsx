import Link from 'next/link';
import { 
  FileText, 
  Users, 
  BookOpen, 
  Image, 
  Share2, 
  Calendar, 
  BarChart 
} from 'lucide-react';

const navItems = [
  { href: '/cms', label: 'Dashboard', icon: BarChart },
  { href: '/cms/scripts', label: 'Scripts', icon: FileText },
  { href: '/cms/characters', label: 'Characters', icon: Users },
  { href: '/cms/blogposts', label: 'Blog Posts', icon: BookOpen },
  { href: '/cms/media', label: 'Media Library', icon: Image },
  { href: '/cms/social', label: 'Social Media', icon: Share2 },
  { href: '/cms/calendar', label: 'Calendar', icon: Calendar },
];

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">OwnerClone</h1>
          <p className="text-sm text-gray-500">Content Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="text-xs text-gray-500">
            <p>Screenplay-first CMS</p>
            <p className="mt-1">Built for restaurant content</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
