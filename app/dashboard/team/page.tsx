"use client"

import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Users } from "lucide-react"
import Link from "next/link"
import { useTeam } from "@/lib/hooks/useTeam"

export default function TeamPage() {
  const { teamMembers, loading, error, deleteTeamMember } = useTeam()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        await deleteTeamMember(id, imageUrl)
      } catch (error) {
        console.error("Error deleting team member:", error)
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Team Members</h1>
            <p className="text-muted-foreground mt-2">Manage your team member profiles</p>
          </div>
          <Link href="/dashboard/team/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </Link>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading team members: {error}</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first team member</p>
              <Link href="/dashboard/team/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="aspect-square relative bg-muted">
                  <img
                    src={member.imageUrl || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="text-center">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/team/edit/${member.id}`}>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent"
                        onClick={() => handleDelete(member.id, member.imageUrl)}
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
