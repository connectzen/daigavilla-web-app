"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useVideos } from "@/lib/hooks"
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from "@/lib/utils"

export default function NewVideoPage() {
  const [formData, setFormData] = useState({
    youtubeUrl: "",
    category: "project",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { addVideo } = useVideos()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.youtubeUrl) {
      setError("Please provide a YouTube URL")
      return
    }

    setLoading(true)
    try {
      const videoId = extractYouTubeId(formData.youtubeUrl)
      if (!videoId) {
        setError("Invalid YouTube URL. Please provide a valid YouTube video link.")
        setLoading(false)
        return
      }
      
      const autoTitle = `YouTube Video (${videoId})`
      await addVideo({
        title: autoTitle,
        description: "",
        videoUrl: formData.youtubeUrl,
        category: formData.category,
        uploadDate: "",
      })
      router.push("/dashboard/videos")
    } catch (err: any) {
      setError(err.message || "Failed to add video")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link href="/dashboard/videos">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Videos
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Add New Video</h1>
          <p className="text-muted-foreground mt-2">Add a YouTube video link to your gallery</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
            <CardDescription>Fill in the information below to add a new video</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Removed title/description per spec */}

              {/* YouTube URL */}
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube URL *</Label>
                <Input
                  id="youtubeUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Paste the full YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
                </p>
              </div>

              {/* Video Preview */}
              {formData.youtubeUrl && (() => {
                const videoId = extractYouTubeId(formData.youtubeUrl)
                if (!videoId) {
                  return (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                        <p className="text-sm text-muted-foreground">Enter a valid YouTube URL to see preview</p>
                      </div>
                    </div>
                  )
                }
                const thumbnailUrl = getYouTubeThumbnail(videoId, 'high')
                return (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
                      <img
                        src={thumbnailUrl}
                        alt="Video preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Video ID: {videoId}</p>
                  </div>
                )
              })()}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Adding Video..." : "Add Video"}
                </Button>
                <Link href="/dashboard/videos" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
