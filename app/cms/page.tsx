import Link from 'next/link';
import { FileText, Users, BookOpen, TrendingUp } from 'lucide-react';

export default function CMSDashboard() {
  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Content Dashboard
        </h1>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Scripts"
            value="0"
            icon={<FileText className="w-6 h-6" />}
            href="/cms/scripts"
            color="blue"
          />
          <StatCard
            title="Characters"
            value="0"
            icon={<Users className="w-6 h-6" />}
            href="/cms/characters"
            color="purple"
          />
          <StatCard
            title="Blog Posts"
            value="0"
            icon={<BookOpen className="w-6 h-6" />}
            href="/cms/blog"
            color="green"
          />
          <StatCard
            title="Total Views"
            value="0"
            icon={<TrendingUp className="w-6 h-6" />}
            href="/cms/analytics"
            color="orange"
          />
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard
              title="New Script"
              description="Start writing a new screenplay"
              href="/cms/scripts/new"
              color="blue"
            />
            <ActionCard
              title="New Character"
              description="Add a character to your database"
              href="/cms/characters/new"
              color="purple"
            />
            <ActionCard
              title="New Blog Post"
              description="Create a blog post from scratch"
              href="/cms/blog/new"
              color="green"
            />
          </div>
        </div>

        {/* Workflow overview */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Screenplay-First Workflow</h2>
          <div className="space-y-3">
            <WorkflowStep
              number={1}
              title="Write Scripts"
              description="Create screenplay-formatted content with auto-formatting"
            />
            <WorkflowStep
              number={2}
              title="Convert Content"
              description="Transform scripts into blog posts, social media, and videos"
            />
            <WorkflowStep
              number={3}
              title="Generate Media"
              description="Create AI images and avatar videos from your scripts"
            />
            <WorkflowStep
              number={4}
              title="Publish & Schedule"
              description="Post to social media and track performance"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  href,
  color 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  href: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  }[color];

  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses}`}>
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
    </Link>
  );
}

function ActionCard({
  title,
  description,
  href,
  color
}: {
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50',
    purple: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50',
    green: 'border-green-200 hover:border-green-400 hover:bg-green-50',
  }[color];

  return (
    <Link href={href} className="block">
      <div className={`border-2 rounded-lg p-4 transition-all ${colorClasses}`}>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

function WorkflowStep({
  number,
  title,
  description
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
