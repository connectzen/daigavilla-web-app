"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useTeam } from "@/lib/hooks/useTeam"

export function TeamSection() {
  const { teamMembers, loading, error } = useTeam()
  return (
    <section id="team" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated professionals behind DAIGAVILLA Ltd.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading team members: {error}</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No team members added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-2 hover:border-primary/50"
              >
                <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={member.imageUrl || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover object-top group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-foreground mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
