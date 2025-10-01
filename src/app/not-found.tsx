'use client';

// 404 Not Found page for ALCHM
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">
            404
          </div>
          <div className="text-4xl mb-4">🔍</div>
        </div>

        {/* Title and Description */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Don't worry, let's get you back on track.
        </p>

        {/* Suggestions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            What you can do:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check the URL for typos</li>
            <li>• Go back to the previous page</li>
            <li>• Visit our homepage</li>
            <li>• Search for what you need</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Popular destinations:
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link 
              href="/journals" 
              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded"
            >
              📝 My Journals
            </Link>
            <Link 
              href="/profile" 
              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded"
            >
              👤 Profile
            </Link>
            <Link 
              href="/help" 
              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded"
            >
              ❓ Help Center
            </Link>
            <Link 
              href="/support" 
              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded"
            >
              💬 Support
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-6 text-sm text-gray-500">
          Still can't find what you're looking for?{' '}
          <Link href="/support" className="text-blue-600 hover:text-blue-700">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}