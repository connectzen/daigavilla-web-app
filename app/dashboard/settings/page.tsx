"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import { db, storage } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore/lite"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

export default function SettingsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    companyName: "DAIGAVILLA Ltd",
    phone: "0721419509",
    email: "daigavillalimited@gmail.com",
    address: "Nairobi, Kenya",
    whatsappNumber: "254721419509",
    logo: null as File | null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, logo: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Load existing settings from Firestore
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const siteDocRef = doc(db, "settings", "site")
        const snap = await getDoc(siteDocRef)
        if (snap.exists()) {
          const data: any = snap.data()
          setFormData((prev) => ({
            ...prev,
            companyName: data.companyName || prev.companyName,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
            address: data.address || prev.address,
            whatsappNumber: data.whatsappNumber || prev.whatsappNumber,
            logo: null,
          }))
          if (data.logoUrl) setLogoPreview(data.logoUrl)
        }
      } catch (err) {
        setError("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      setSaving(true)
      // Upload logo if provided
      let logoUrl: string | null = null
      const siteDocRef = doc(db, "settings", "site")
      // fetch previous to delete after success
      const prevSnap = await getDoc(siteDocRef)
      const prevLogoUrl: string | null = prevSnap.exists() && (prevSnap.data() as any).logoUrl ? (prevSnap.data() as any).logoUrl : null

      if (formData.logo) {
        const storageRef = ref(storage, `settings/logo_${Date.now()}_${formData.logo.name}`)
        const snap = await uploadBytes(storageRef, formData.logo)
        logoUrl = await getDownloadURL(snap.ref)
      }

      await setDoc(
        siteDocRef,
        {
          companyName: formData.companyName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          whatsappNumber: formData.whatsappNumber,
          ...(logoUrl ? { logoUrl } : {}),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      )
      if (logoUrl) setLogoPreview(logoUrl)
      setFormData((prev) => ({ ...prev, logo: null }))
      setSuccess("Settings saved successfully")

      // Delete previous logo if a new one was uploaded and there was an old one
      if (logoUrl && prevLogoUrl && prevLogoUrl !== logoUrl) {
        try {
          const oldRef = ref(storage, prevLogoUrl)
          await deleteObject(oldRef)
        } catch (_) {
          // ignore delete error
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your website settings and branding</p>
        </div>

        {/* Logo Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
            <CardDescription>Upload your company logo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading && <p className="text-sm text-muted-foreground">Loading current settings...</p>}
              {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
              {success && <div className="bg-green-100 text-green-700 text-sm p-3 rounded-md">{success}</div>}
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {logoPreview ? (
                  <div className="relative inline-block">
                    <img src={logoPreview || "/placeholder.svg"} alt="Logo Preview" className="max-h-32 mx-auto" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={() => {
                        setLogoPreview(null)
                        setFormData({ ...formData, logo: null })
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">Click to upload or drag and drop</p>
                    <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    <Label htmlFor="logo">
                      <Button type="button" variant="outline" asChild>
                        <span>Choose File</span>
                      </Button>
                    </Label>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number (with country code)</Label>
                <Input
                  id="whatsappNumber"
                  placeholder="e.g., 254721419509"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the number with country code (e.g., 254 for Kenya)
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
