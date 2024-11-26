// app/page.tsx
import React from 'react'
import MediaUpload from './components/MediaUpload'


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Media Upload
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Upload your media files securely to the cloud
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <MediaUpload />
          </div>
        </div>
      </div>
    </main>
  )
}
