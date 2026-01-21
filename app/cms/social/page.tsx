export default function SocialPage() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Social Media</h1>
        <p className="text-gray-600 mb-6">
          Schedule and manage posts across Facebook, Instagram, and other platforms.
        </p>
        <div className="inline-block px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
          Coming Soon
        </div>
      </div>
    </div>
  );
}
