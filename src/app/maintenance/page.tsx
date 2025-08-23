// Maintenance mode page for ALCHM
import Link from 'next/link'

interface MaintenancePageProps {
  searchParams: {
    eta?: string
    reason?: string
    status?: string
  }
}

export default function MaintenancePage({ searchParams }: MaintenancePageProps) {
  const eta = searchParams.eta
  const reason = searchParams.reason || 'scheduled maintenance'
  const status = searchParams.status || 'maintenance'

  const getMaintenanceInfo = () => {
    switch (status) {
      case 'upgrade':
        return {
          title: 'System Upgrade in Progress',
          icon: '🔧',
          description: 'We\'re upgrading ALCHM with new features and improvements.',
          message: 'This usually takes 15-30 minutes. Thank you for your patience!'
        }
      case 'emergency':
        return {
          title: 'Emergency Maintenance',
          icon: '🚨',
          description: 'We\'re addressing a critical issue to ensure the best experience.',
          message: 'We\'re working quickly to restore full service.'
        }
      case 'database':
        return {
          title: 'Database Maintenance',
          icon: '🗄️',
          description: 'We\'re optimizing our database for better performance.',
          message: 'Your data is safe and will be available shortly.'
        }
      default:
        return {
          title: 'Scheduled Maintenance',
          icon: '⚙️',
          description: 'We\'re performing routine maintenance to improve your experience.',
          message: 'We\'ll be back online shortly!'
        }
    }
  }

  const maintenanceInfo = getMaintenanceInfo()

  const formatETA = (etaString: string) => {
    try {
      const etaDate = new Date(etaString)
      const now = new Date()
      const diffMs = etaDate.getTime() - now.getTime()
      
      if (diffMs <= 0) {
        return 'Very soon'
      }
      
      const diffMins = Math.ceil(diffMs / (1000 * 60))
      
      if (diffMins < 60) {
        return `~${diffMins} minutes`
      } else {
        const diffHours = Math.ceil(diffMins / 60)
        return `~${diffHours} hour${diffHours > 1 ? 's' : ''}`
      }
    } catch {
      return etaString
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Maintenance Icon */}
          <div className="text-6xl mb-6 animate-pulse">
            {maintenanceInfo.icon}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {maintenanceInfo.title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {maintenanceInfo.description}
          </p>

          {/* Status Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">
              {maintenanceInfo.message}
            </p>
          </div>

          {/* ETA */}
          {eta && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-600">⏱️</span>
                <span className="text-green-800 font-medium">
                  Expected completion: {formatETA(eta)}
                </span>
              </div>
            </div>
          )}

          {/* Progress Animation */}
          <div className="mb-6">
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* What's Being Updated */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              What's happening:
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              {status === 'upgrade' && (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>New AI features deployment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">🔄</span>
                    <span>Performance optimizations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">⏳</span>
                    <span>Security updates</span>
                  </div>
                </>
              )}
              {status === 'database' && (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Database optimization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">🔄</span>
                    <span>Index rebuilding</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">⏳</span>
                    <span>Performance tuning</span>
                  </div>
                </>
              )}
              {(status === 'maintenance' || status === 'emergency') && (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">🔄</span>
                    <span>System maintenance in progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">⏳</span>
                    <span>Finalizing updates</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Auto-refresh */}
          <div className="text-sm text-gray-500 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              <span>This page will automatically refresh when we're back</span>
            </div>
          </div>

          {/* Manual Refresh */}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
          >
            Check Status
          </button>

          {/* Alternative Actions */}
          <div className="space-y-2">
            <Link
              href="/status"
              className="block text-sm text-blue-600 hover:text-blue-700"
            >
              View Detailed Status
            </Link>
            <Link
              href="/support"
              className="block text-sm text-gray-500 hover:text-gray-700"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            📱 Stay Updated:
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center space-x-2">
              <span>🐦</span>
              <a href="https://twitter.com/alchm_app" className="text-blue-600 hover:text-blue-700">
                Follow @alchm_app for updates
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <span>📧</span>
              <span>We'll email you when maintenance is complete</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>💬</span>
              <span>Join our Discord for real-time updates</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Thank you for your patience while we make ALCHM even better! 💙
        </div>
      </div>

      {/* Auto-refresh script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Auto-refresh every 30 seconds
            setTimeout(() => {
              window.location.reload()
            }, 30000)
            
            // Check server status every 10 seconds
            setInterval(async () => {
              try {
                const response = await fetch('/api/health/status', { 
                  method: 'HEAD',
                  cache: 'no-cache'
                })
                if (response.ok) {
                  window.location.href = '/'
                }
              } catch (e) {
                // Still in maintenance
              }
            }, 10000)
          `
        }}
      />
    </div>
  )
}