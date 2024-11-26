// app/components/MediaUpload.tsx
'use client'

import { useState } from 'react'
import { generatePresignedUrl, handleUploadComplete } from '../actions/media'
import React from 'react'

export default function MediaUpload() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setStatus('uploading')
      setProgress(0)

      // 1. Get presigned URL
      const { success, url, key } = await generatePresignedUrl(
        file.name,
        file.type
      )

      if (!success || !url || !key) {
        throw new Error('Failed to get upload URL')
      }

      // 2. Upload to S3
      const upload = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!upload.ok) {
        throw new Error('Upload failed')
      }

      // 3. Handle upload completion
      const result = await handleUploadComplete(key)
      
      if (result.success) {
        setStatus('done')
        setProgress(100)
      } else {
        throw new Error('Failed to process upload')
      }

    } catch (error) {
      console.error('Upload error:', error)
      setStatus('error')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*,video/*"
        disabled={status === 'uploading'}
        className="w-full p-2 border rounded"
      />

      {status === 'uploading' && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded">
            <div 
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Uploading... {progress}%
          </p>
        </div>
      )}

      {status === 'done' && (
        <p className="text-green-500 mt-4">
          Upload complete!
        </p>
      )}

      {status === 'error' && (
        <p className="text-red-500 mt-4">
          Upload failed. Please try again.
        </p>
      )}
    </div>
  )
}
