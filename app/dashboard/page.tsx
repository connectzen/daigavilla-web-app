"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, Video, Users, Settings, Eye, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useImages } from "@/lib/hooks/useImages"
import { useVideos } from "@/lib/hooks/useVideos"
import { useTeam } from "@/lib/hooks/useTeam"
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils"

export default function DashboardPage() {
  const { images, loading: imagesLoading } = useImages()
  const { videos, loading: videosLoading } = useVideos()
  const { teamMembers, loading: teamLoading } = useTeam()

  const stats = [
    { 
      label: "Total Images", 
      value: imagesLoading ? "..." : images.length.toString(), 
      icon: ImageIcon, 
      color: "text-blue-600" 
    },
    { 
      label: "Total Videos", 
      value: videosLoading ? "..." : videos.length.toString(), 
      icon: Video, 
      color: "text-purple-600" 
    },
    { 
      label: "Team Members", 
      value: teamLoading ? "..." : teamMembers.length.toString(), 
      icon: Users, 
      color: "text-green-600" 
    },
    { 
      label: "Site Views", 
      value: "1.2K", 
      icon: Eye, 
      color: "text-orange-600" 
    },
  ]

  const quickActions = [
    {
      title: "Add New Image",
      description: "Upload project or gallery images",
      icon: ImageIcon,
      href: "/dashboard/images",
      color: "bg-blue-500",
    },
    {
      title: "Add New Video",
      description: "Add YouTube video links",
      icon: Video,
      href: "/dashboard/videos",
      color: "bg-purple-500",
    },
    {
      title: "Add Team Member",
      description: "Add new team member profile",
      icon: Users,
      href: "/dashboard/team",
      color: "bg-green-500",
    },
    {
      title: "Site Settings",
      description: "Update logo and site settings",
      icon: Settings,
      href: "/dashboard/settings",
      color: "bg-orange-500",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Manage your construction website content.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Quickly add or manage content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Videos */}
        {videos.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Videos</CardTitle>
                  <CardDescription>Latest videos added to your gallery</CardDescription>
                </div>
                <Link href="/dashboard/videos">
                  <button className="text-sm text-primary hover:underline flex items-center gap-1">
                    View All <ExternalLink className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {videosLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading videos...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {videos.slice(0, 4).map((video) => {
                    try {
                      const videoId = extractYouTubeId(video.videoUrl)
                      const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId, 'high') : '/placeholder.svg'
                      
                      return (
                        <Link key={video.id} href="/dashboard/videos" className="group">
                          <div className="bg-muted rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video relative bg-black">
                              <img
                                src={thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg'
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Video className="w-6 h-6 text-white ml-0.5" />
                                </div>
                              </div>
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                {video.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(video.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      )
                    } catch (err) {
                      console.error('Error rendering dashboard video:', video.id, err)
                      return null
                    }
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates to your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imagesLoading || videosLoading || teamLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading recent activity...</p>
                </div>
              ) : (
                <>
                  {images.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{images.length} project image{images.length !== 1 ? 's' : ''} uploaded</p>
                        <p className="text-sm text-muted-foreground">Latest: {images[0]?.title || 'Untitled'}</p>
                      </div>
                    </div>
                  )}
                  {teamMembers.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} in database</p>
                        <p className="text-sm text-muted-foreground">Latest: {teamMembers[0]?.name || 'Unknown'}</p>
                      </div>
                    </div>
                  )}
                  {videos.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{videos.length} video{videos.length !== 1 ? 's' : ''} in gallery</p>
                        <p className="text-sm text-muted-foreground">Latest: {videos[0]?.title || 'Untitled'}</p>
                      </div>
                    </div>
                  )}
                  {images.length === 0 && videos.length === 0 && teamMembers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No content added yet. Start by adding images, videos, or team members!</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
