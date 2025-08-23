// File: src/app/debug-journals/page.tsx

import React from 'react';

const DebugJournalsPage = () => {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">🧪 Debug Journals</h1>
        <p className="text-lg">
          Welcome to the debug journals page. This route is working correctly.
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">Sample Logs</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            <li>[INFO] Journal system initialized</li>
            <li>[DEBUG] Component state verified</li>
            <li>[WARN] No entries yet</li>
            <li>[ERROR] Simulated error message (for test)</li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default DebugJournalsPage;
