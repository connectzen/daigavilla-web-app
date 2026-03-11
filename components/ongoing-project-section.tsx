"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useImages } from "@/lib/hooks/useImages"
import { useState } from "react"

export function OngoingProjectSection() {
  const { images, loading, error } = useImages()
  const [showAll, setShowAll] = useState(false)

  // Normalize and filter images for ongoing project category
  const normalize = (c?: string) => (c || "").toLowerCase().replace(/\s+/g, "-")
  const ongoingProjectImages = images.filter((image) => {
    const c = normalize(image.category)
    return c === "ongoing-project" || c === "ongoing"
  })
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-purple-50 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Ongoing Project: South B 13-Floor Residential Tower
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We are proud to showcase our latest ongoing project: a modern 13-floor residential building located in
              South B. This ambitious development is designed to set new standards in urban living, blending
              architectural innovation with structural excellence.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-primary text-white px-6 py-3 text-base rounded-full">Location: South B</Badge>
            <Badge className="bg-accent text-white px-6 py-3 text-base rounded-full">Floors: 13</Badge>
            <Badge className="bg-green-600 text-white px-6 py-3 text-base rounded-full">Duration: 1.5 Years</Badge>
          </div>

          <p className="text-center text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            This project exemplifies our commitment to delivering high-rise residential solutions that combine comfort,
            safety, and contemporary design. The building will feature spacious apartments, advanced amenities, and
            sustainable construction practices.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading project images...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading project images: {error}</p>
            </div>
          ) : ongoingProjectImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No ongoing project images available yet.</p>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAll ? ongoingProjectImages : ongoingProjectImages.slice(0, 15)).map((image) => (
                <Card
                  key={image.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={image.imageUrl || "/placeholder.svg"}
                        alt={image.title || "Construction progress"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {ongoingProjectImages.length > 15 && !showAll && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition"
                >
                  See more
                </button>
              </div>
            )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
