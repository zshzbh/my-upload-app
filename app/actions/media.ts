// app/actions/media.ts
'use server'

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { revalidatePath } from 'next/cache'

// ** chenge the bucket name and region here **
const BUCKET_NAME = "new-bucket-maggie-ma" 
const REGION =  "us-east-1"

const s3Client = new S3Client({ 
  region: REGION,
})

export async function generatePresignedUrl(filename: string, contentType: string) {
  try {
    const key = `uploads/${Date.now()}-${filename}`
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      signableHeaders: new Set(["content-type"]),
      expiresIn: 60 * 5, // 5 minutes
    })

    console.log("presigned url", presignedUrl)
    return {
      success: true,
      url: presignedUrl,
      key: key
    }
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return {
      success: false,
      error: 'Failed to generate upload URL'
    }
  }
}

export async function handleUploadComplete(key: string) {
  try {
    
    const fileUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`
    
    revalidatePath('/media')
    
    return {
      success: true,
      fileUrl
    }
  } catch (error) {
    console.error('Error handling upload complete:', error)
    return {
      success: false,
      error: 'Failed to process upload'
    }
  }
}
