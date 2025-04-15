"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Download, Eye, FileText, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock data
const certifications = [
  {
    id: 1,
    name: "GOTS",
    status: "Valid",
    expiry: "2024-12-31",
    issuer: "Control Union",
    issueDate: "2022-01-15",
    documentUrl: "#",
  },
  {
    id: 2,
    name: "GRS",
    status: "Valid",
    expiry: "2024-10-15",
    issuer: "IDFL",
    issueDate: "2022-03-22",
    documentUrl: "#",
  },
  {
    id: 3,
    name: "OEKO-TEX",
    status: "Expiring Soon",
    expiry: "2023-06-30",
    issuer: "Hohenstein",
    issueDate: "2022-06-30",
    documentUrl: "#",
  },
]

export default function SupplierCertifications() {
  const router = useRouter()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null)
  const [showViewModal, setShowViewModal] = useState(false)

  const handleViewCertificate = (cert: any) => {
    setSelectedCertificate(cert)
    setShowViewModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certifications</h1>
          <p className="text-muted-foreground">Manage your certifications and compliance documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button className="flex items-center gap-1" onClick={() => setShowUploadModal(true)}>
            <Upload className="h-4 w-4" />
            Upload New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {certifications.map((cert) => (
          <Card key={cert.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-lg">{cert.name}</h3>
                      {cert.status === "Valid" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Issued by {cert.issuer} on {cert.issueDate}
                    </p>
                    <p className="text-sm">Expires: {cert.expiry}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleViewCertificate(cert)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Certificate Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New Certificate</DialogTitle>
            <DialogDescription>Upload your certification document and provide the details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Drag and drop your file here, or click to browse</p>
              <p className="text-xs text-gray-400">Supports PDF, JPG, PNG (max 10MB)</p>
              <Input type="file" className="hidden" id="certificate-upload" />
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => document.getElementById("certificate-upload")?.click()}
              >
                Browse Files
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="cert-name">Certificate Name</Label>
                <Input id="cert-name" placeholder="e.g., GOTS, GRS, OEKO-TEX" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="cert-issuer">Issuing Organization</Label>
                  <Input id="cert-issuer" placeholder="e.g., Control Union" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-issue-date">Issue Date</Label>
                  <Input id="cert-issue-date" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-expiry">Expiry Date</Label>
                <Input id="cert-expiry" type="date" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button>Upload Certificate</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Certificate Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCertificate?.name} Certificate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 h-96 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Certificate Preview</p>
                <p className="text-sm text-gray-400">PDF document would be displayed here</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Issuing Organization</p>
                <p className="font-medium">{selectedCertificate?.issuer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Issue Date</p>
                <p className="font-medium">{selectedCertificate?.issueDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expiry Date</p>
                <p className="font-medium">{selectedCertificate?.expiry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{selectedCertificate?.status}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
