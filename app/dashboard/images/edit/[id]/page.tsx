"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, ArrowLeft } from "lucide-react"
import { useImages } from "@/lib/hooks"

export default function EditImagePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { images, loading, error, updateImage } = useImages()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({ category: "" })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string>("")

  const image = useMemo(() => images.find((i) => i.id === params?.id), [images, params])

  useEffect(() => {
    if (image) {
      setFormData({ category: image.category || "" })
      setImagePreview(image.imageUrl || null)
    }
  }, [image])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(f)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    if (!image?.id) return
    if (!formData.category) {
      setFormError("Please select a category")
      return
    }
    try {
      setSaving(true)
      await updateImage(image.id, { title: formData.category, category: formData.category }, file || undefined)
      router.push("/dashboard/images")
    } catch (err: any) {
      setFormError(err?.message || "Failed to update image")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link href="/dashboard/images">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Images
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Image</h1>
          <p className="text-muted-foreground mt-2">Update details or replace the image</p>
        </div>

        {loading && (
          <div className="text-center py-12"><p className="text-muted-foreground">Loading image...</p></div>
        )}
        {error && (
          <div className="text-center py-12"><p className="text-red-500">{error}</p></div>
        )}
        {!loading && !image && (
          <div className="text-center py-12"><p className="text-muted-foreground">Image not found.</p></div>
        )}

        {image && (
          <Card>
            <CardHeader>
              <CardTitle>Image Details</CardTitle>
              <CardDescription>Update the information below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {formError && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{formError}</div>
                )}

                {/* Removed title field per spec */}

                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => { setImagePreview(null); setFile(null) }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">Click to upload or drag and drop</p>
                        <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <Label htmlFor="image">
                          <Button type="button" variant="outline" asChild>
                            <span>Choose File</span>
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing-project">Ongoing Project</SelectItem>
                      <SelectItem value="exterior">Exterior</SelectItem>
                      <SelectItem value="interior">Interior</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Link href="/dashboard/images" className="flex-1">
                    <Button type="button" variant="outline" className="w-full bg-transparent" disabled={saving}>
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
