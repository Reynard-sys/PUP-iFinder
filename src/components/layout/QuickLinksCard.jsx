"use client";

export function QuickLinksCard({ links, isEditing, onLinkChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 sm:p-10 md:p-12">
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Quick Links</h3>
      
      <div className="space-y-4">
        {links.map((link, index) => (
          <div key={index}>
            {isEditing ? (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{link.name}</label>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => onLinkChange(index, e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#800000] focus:outline-none bg-gray-50"
                  placeholder="link.com/link"
                />
              </div>
            ) : (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  <span className="text-gray-900 font-medium text-sm sm:text-base">{link.name}</span>
                </div>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
