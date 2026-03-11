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
import { Upload, X, ArrowLeft } from "lucide-react"
import { useTeam } from "@/lib/hooks/useTeam"

export default function EditTeamMemberPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { teamMembers, loading, error, updateTeamMember } = useTeam()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({ name: "", role: "", email: "", phone: "" })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string>("")

  const member = useMemo(() => teamMembers.find((m) => m.id === params?.id), [teamMembers, params])

  useEffect(() => {
    if (member) {
      setFormData({ name: member.name || "", role: member.role || "", email: member.email || "", phone: member.phone || "" })
      setImagePreview(member.imageUrl || null)
    }
  }, [member])

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
    if (!member?.id) return
    if (!formData.name || !formData.role) {
      setFormError("Name and role are required")
      return
    }
    try {
      setSaving(true)
      await updateTeamMember(
        member.id,
        { name: formData.name, role: formData.role, email: formData.email, phone: formData.phone },
        file || undefined
      )
      router.push("/dashboard/team")
    } catch (err: any) {
      setFormError(err?.message || "Failed to update team member")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link href="/dashboard/team">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Team Member</h1>
          <p className="text-muted-foreground mt-2">Update member details or replace the profile image</p>
        </div>

        {loading && (
          <div className="text-center py-12"><p className="text-muted-foreground">Loading member...</p></div>
        )}
        {error && (
          <div className="text-center py-12"><p className="text-red-500">{error}</p></div>
        )}
        {!loading && !member && (
          <div className="text-center py-12"><p className="text-muted-foreground">Member not found.</p></div>
        )}

        {member && (
          <Card>
            <CardHeader>
              <CardTitle>Member Details</CardTitle>
              <CardDescription>Update the information below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {formError && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{formError}</div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Profile Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="max-h-64 mx-auto rounded-lg object-cover" />
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

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Link href="/dashboard/team" className="flex-1">
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
