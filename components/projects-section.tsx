"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useImages } from "@/lib/hooks/useImages"

const categories = ["All", "Exterior", "Interior", "Construction"]

export function ProjectsSection() {
  const { images, loading, error } = useImages()
  const [activeCategory, setActiveCategory] = useState("All")
  const [showAll, setShowAll] = useState(false)

  // Helpers to normalize and map categories from dashboard form values
  const normalize = (c?: string) => (c || "").toLowerCase().replace(/\s+/g, "-")
  const isHero = (c: string) => {
    const n = normalize(c)
    return n === "hero-background" || n === "hero" || n === "background" || n === "banner"
  }
  const isOngoing = (c: string) => {
    const n = normalize(c)
    return n === "ongoing-project" || n === "ongoing"
  }
  const mapToDisplayCategory = (c?: string) => {
    const n = normalize(c)
    if (n === "exterior") return "Exterior"
    if (n === "interior") return "Interior"
    if (n === "construction") return "Construction"
    return c || ""
  }

  // Exclude only hero and ongoing images from gallery; include construction and other categories
  const galleryImages = images
    .filter((image) => !isHero(image.category) && !isOngoing(image.category))
    .map((image) => ({ ...image, displayCategory: mapToDisplayCategory(image.category) }))

  const filteredProjects =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((image) => image.displayCategory === activeCategory)

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Projects Gallery</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our comprehensive portfolio of successful construction and real estate projects.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                variant={activeCategory === category ? "default" : "outline"}
                className={`rounded-full px-6 ${
                  activeCategory === category ? "bg-primary text-white" : "hover:bg-primary/10"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading projects: {error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found for the selected category.</p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {(showAll ? filteredProjects : filteredProjects.slice(0, 15)).map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.imageUrl || "/placeholder.svg"}
                      alt={project.title || `Project ${project.id}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <p className="text-sm text-gray-200">{(project as any).displayCategory || project.category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredProjects.length > 15 && !showAll && (
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
    </section>
  )
}
