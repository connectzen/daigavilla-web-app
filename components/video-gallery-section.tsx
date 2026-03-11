"use client"

import { useState } from "react"
import { useVideos } from "@/lib/hooks/useVideos"
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from "@/lib/utils"

export function VideoGallerySection() {
  const { videos, loading, error } = useVideos()
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)

  return (
    <section id="videos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Video Gallery</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Latest site clips and walkthroughs.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading videos: {error}</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {videos.map((video) => {
              try {
                const videoId = extractYouTubeId(video.videoUrl)
                if (!videoId) return null
                
                const thumbnailUrl = getYouTubeThumbnail(videoId, 'maxres')
                const embedUrl = getYouTubeEmbedUrl(videoId)
                if (!embedUrl) return null
                
                const isPlaying = playingVideoId === video.id
              
              return (
                <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative aspect-video bg-black group cursor-pointer" onClick={() => setPlayingVideoId(video.id)}>
                    {isPlaying ? (
                      <iframe
                        src={`${embedUrl}&autoplay=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={video.title}
                      />
                    ) : (
                      <>
                        <img
                          src={thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            try {
                              // Fallback to medium quality if maxres doesn't exist
                              const fallbackUrl = getYouTubeThumbnail(videoId, 'high')
                              if (e.currentTarget.src !== fallbackUrl) {
                                e.currentTarget.src = fallbackUrl
                              } else {
                                // If high quality also fails, use default
                                e.currentTarget.src = getYouTubeThumbnail(videoId, 'default')
                              }
                            } catch (err) {
                              console.error('Error loading thumbnail:', err)
                              e.currentTarget.src = '/placeholder.svg'
                            }
                          }}
                          onLoad={(e) => {
                            // Silently handle successful load
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <div className="w-20 h-20 rounded-full bg-red-600/90 flex items-center justify-center group-hover:bg-red-600 group-hover:scale-110 transition-transform">
                            <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{video.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(video.uploadDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )
              } catch (err) {
                console.error('Error rendering video:', video.id, err)
                return null
              }
            })}
          </div>
        )}
      </div>
    </section>
  )
}
