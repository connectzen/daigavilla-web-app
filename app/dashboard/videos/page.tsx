"use client"

import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, VideoIcon } from "lucide-react"
import Link from "next/link"
import { useVideos } from "@/lib/hooks/useVideos"
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils"

export default function VideosPage() {
  const { videos, loading, error, deleteVideo } = useVideos()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(id)
      } catch (error) {
        console.error("Error deleting video:", error)
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Videos</h1>
            <p className="text-muted-foreground mt-2">Manage your YouTube video links</p>
          </div>
          <Link href="/dashboard/videos/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Video
            </Button>
          </Link>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading videos: {error}</p>
          </div>
        ) : videos.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <VideoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first video</p>
              <Link href="/dashboard/videos/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Video
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const videoId = extractYouTubeId(video.videoUrl)
              const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId, 'high') : '/placeholder.svg'
              
              return (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <VideoIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{video.videoUrl}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Added: {new Date(video.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/videos/edit/${video.id}`}>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent"
                        onClick={() => handleDelete(video.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
