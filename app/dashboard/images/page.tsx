"use client"

import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react"
import Link from "next/link"
import { useImages } from "@/lib/hooks/useImages"

export default function ImagesPage() {
  const { images, loading, error, deleteImage } = useImages()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleDelete = async (id: string, imageUrl: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteImage(id, imageUrl)
      } catch (error) {
        console.error("Error deleting image:", error)
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Images</h1>
            <p className="text-muted-foreground mt-2">Manage your project and gallery images</p>
          </div>
          <Link href="/dashboard/images/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Image
            </Button>
          </Link>
        </div>

        {/* Images Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading images...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading images: {error}</p>
          </div>
        ) : images.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images yet</h3>
              <p className="text-muted-foreground mb-4">Get started by uploading your first image</p>
              <Link href="/dashboard/images/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Image
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative bg-muted aspect-[4/3] overflow-hidden">
                  <img
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={image.title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold capitalize">{image.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 capitalize">{image.category}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(image.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/images/edit/${image.id}`}>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent"
                        onClick={() => handleDelete(image.id, image.imageUrl)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
