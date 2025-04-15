"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Bell, Check, Info, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Mock data
const availableBrands = [
  { id: 1, name: "EcoFashion", logo: "E", industry: "Apparel", visible: false },
  { id: 2, name: "GreenWear", logo: "G", industry: "Sportswear", visible: false },
  { id: 3, name: "SustainStyle", logo: "S", industry: "Luxury", visible: false },
  { id: 4, name: "EthicalThreads", logo: "ET", industry: "Casual Wear", visible: false },
]

// Initial connection requests
const initialConnectionRequests = [
  {
    id: 1,
    brandName: "OrganicClothing",
    logo: "OC",
    message: "We're interested in your sustainable cotton products. Would you like to connect?",
    date: "2023-04-08",
  },
]

const certifications = [
  { name: "GOTS", status: "Valid", expiry: "2024-12-31" },
  { name: "GRS", status: "Valid", expiry: "2024-10-15" },
  { name: "OEKO-TEX", status: "Expiring Soon", expiry: "2023-06-30" },
]

const alerts = [
  { id: 1, type: "certification", message: "OEKO-TEX certification expires in 30 days" },
  { id: 2, type: "request", message: "New connection request from OrganicClothing" },
  { id: 3, type: "document", message: "Document request from EcoFashion due in 5 days" },
]

// Missing profile items
const missingProfileItems = [
  { id: 1, name: "Company Description", completed: false },
  { id: 2, name: "Production Capacity", completed: false },
  { id: 3, name: "Sustainability Policy", completed: false },
  { id: 4, name: "Factory Images", completed: false },
  { id: 5, name: "Contact Information", completed: true },
  { id: 6, name: "Business Registration", completed: true },
  { id: 7, name: "Product Categories", completed: true },
]

export function SupplierDashboard() {
  const [visibleBrands, setVisibleBrands] = useState<number[]>([])
  const [showOptInDialog, setShowOptInDialog] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<any>(null)
  const [connectionRequests, setConnectionRequests] = useState(initialConnectionRequests)
  const [acceptedBrands, setAcceptedBrands] = useState<string[]>([])

  // New state for modals
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showVisibilityModal, setShowVisibilityModal] = useState(false)
  const [showCertificationsModal, setShowCertificationsModal] = useState(false)
  const [showAlertsModal, setShowAlertsModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [requestToAction, setRequestToAction] = useState<any>(null)
  const [actionType, setActionType] = useState<"accept" | "decline">("accept")

  const router = useRouter()

  const handleOptIn = (brand: any) => {
    setSelectedBrand(brand)
    setShowOptInDialog(true)
  }

  const confirmOptIn = () => {
    if (selectedBrand) {
      setVisibleBrands((prev) => [...prev, selectedBrand.id])
      setShowOptInDialog(false)

      toast({
        title: "Brand visibility updated",
        description: `Your profile is now visible to ${selectedBrand.name}.`,
      })
    }
  }

  const handleAcceptRequest = (request: any) => {
    setRequestToAction(request)
    setActionType("accept")
    setShowConfirmDialog(true)
  }

  const handleDeclineRequest = (request: any) => {
    setRequestToAction(request)
    setActionType("decline")
    setShowConfirmDialog(true)
  }

  const confirmAction = () => {
    if (!requestToAction) return

    if (actionType === "accept") {
      // Add to accepted brands
      setAcceptedBrands((prev) => [...prev, requestToAction.brandName])

      // Remove from connection requests
      setConnectionRequests((prev) => prev.filter((req) => req.id !== requestToAction.id))

      toast({
        title: "Connection request accepted",
        description: `You are now connected with ${requestToAction.brandName}.`,
        action: (
          <ToastAction altText="View workspace" onClick={() => router.push("/supplier/workspaces")}>
            View workspace
          </ToastAction>
        ),
      })
    } else {
      // Remove from connection requests
      setConnectionRequests((prev) => prev.filter((req) => req.id !== requestToAction.id))

      toast({
        title: "Connection request declined",
        description: `You have declined the connection request from ${requestToAction.brandName}.`,
      })
    }

    setShowConfirmDialog(false)
    setRequestToAction(null)
  }

  const profileStrength = 85
  const visibilityScore = visibleBrands.length * 25

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowProfileModal(true)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profile Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{profileStrength}%</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <Progress value={profileStrength} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">Complete your profile to improve visibility</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowVisibilityModal(true)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Visibility Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{visibilityScore}%</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <Progress value={visibilityScore} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">Opt in to more brands to increase visibility</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowCertificationsModal(true)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {cert.name}
                    </Badge>
                    <span className="text-xs">
                      {cert.status === "Valid" ? (
                        <span className="text-green-600">Valid</span>
                      ) : (
                        <span className="text-amber-600">Expiring Soon</span>
                      )}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{cert.expiry}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAlertsModal(true)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span className="text-xs">{alert.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableBrands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium mr-3">
                      {brand.logo}
                    </div>
                    <div>
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-xs text-gray-500">{brand.industry}</p>
                    </div>
                  </div>
                  {visibleBrands.includes(brand.id) ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="h-3 w-3 mr-1" />
                      Visible
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleOptIn(brand)}>
                      Opt In
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connection Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {connectionRequests.length > 0 ? (
              <div className="space-y-4">
                {connectionRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium mr-3">
                        {request.logo}
                      </div>
                      <div>
                        <p className="font-medium">{request.brandName}</p>
                        <p className="text-xs text-gray-500">
                          Requested on {new Date(request.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mb-4">{request.message}</p>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => handleAcceptRequest(request)}>
                        Accept
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => handleDeclineRequest(request)}>
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : acceptedBrands.length > 0 ? (
              <div className="text-center py-8">
                <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500">All connection requests handled</p>
                <p className="text-xs text-gray-400">You've accepted connections with {acceptedBrands.join(", ")}</p>
                <Button variant="link" className="mt-2" onClick={() => router.push("/supplier/workspaces")}>
                  View workspaces
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No connection requests</p>
                <p className="text-xs text-gray-400">When brands request to connect, they'll appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Strength Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              Complete these items to increase your profile strength and visibility to brands.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Profile Strength</span>
              <span className="font-bold">{profileStrength}%</span>
            </div>
            <Progress value={profileStrength} className="h-2" />

            <div className="border rounded-lg divide-y">
              {missingProfileItems.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.completed ? (
                      <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                    )}
                    <p className={item.completed ? "text-gray-500" : "font-medium"}>{item.name}</p>
                  </div>
                  {!item.completed && (
                    <Button size="sm" variant="outline" onClick={() => router.push("/supplier/profile")}>
                      Complete
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => router.push("/supplier/profile")}>Edit Profile</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Visibility Score Modal */}
      <Dialog open={showVisibilityModal} onOpenChange={setShowVisibilityModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Brand Visibility</DialogTitle>
            <DialogDescription>
              Your profile is visible to the following brands. Opt in to more brands to increase your visibility.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Visibility Score</span>
              <span className="font-bold">{visibilityScore}%</span>
            </div>
            <Progress value={visibilityScore} className="h-2" />

            <div className="border rounded-lg divide-y">
              {availableBrands.map((brand) => (
                <div key={brand.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium mr-3">
                      {brand.logo}
                    </div>
                    <div>
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-xs text-gray-500">{brand.industry}</p>
                    </div>
                  </div>
                  {visibleBrands.includes(brand.id) ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="h-3 w-3 mr-1" />
                      Visible
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleOptIn(brand)}>
                      Opt In
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Certifications Modal */}
      <Dialog open={showCertificationsModal} onOpenChange={setShowCertificationsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Certifications</DialogTitle>
            <DialogDescription>Manage your certifications and upload new ones.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg divide-y">
              {certifications.map((cert) => (
                <div key={cert.name} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-medium">
                        {cert.name}
                      </Badge>
                      {cert.status === "Valid" ? (
                        <span className="text-xs text-green-600">Valid</span>
                      ) : (
                        <span className="text-xs text-amber-600">Expiring Soon</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Expires: {cert.expiry}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.push("/supplier/certifications")}>
                Manage
              </Button>
              <Button className="flex items-center gap-1">
                <Upload className="h-4 w-4" />
                Upload New
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alerts Modal */}
      <Dialog open={showAlertsModal} onOpenChange={setShowAlertsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Alerts</DialogTitle>
            <DialogDescription>Important notifications that require your attention.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg divide-y">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">{alert.message}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.type === "certification"
                            ? "Certification"
                            : alert.type === "request"
                              ? "Request"
                              : "Document"}
                        </Badge>
                        <span className="text-xs text-gray-500">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => router.push("/supplier/alerts")}>
                View All Alerts
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Opt-in Dialog */}
      <Dialog open={showOptInDialog} onOpenChange={setShowOptInDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opt In to {selectedBrand?.name}</DialogTitle>
            <DialogDescription>
              Your profile will be visible to this brand, allowing them to discover and connect with you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              By opting in, you agree to share your profile information with {selectedBrand?.name}. This includes your:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Company details and contact information</li>
              <li>Certifications and compliance status</li>
              <li>Production capabilities and materials</li>
              <li>Sustainability metrics</li>
            </ul>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowOptInDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmOptIn}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Action Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept" ? "Accept Connection Request" : "Decline Connection Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "accept"
                ? `Are you sure you want to accept the connection request from ${requestToAction?.brandName}?`
                : `Are you sure you want to decline the connection request from ${requestToAction?.brandName}?`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {actionType === "accept" ? (
              <p>
                By accepting this request, you will create a workspace with {requestToAction?.brandName} where you can
                collaborate, share documents, and communicate.
              </p>
            ) : (
              <p>
                By declining this request, {requestToAction?.brandName} will not be able to connect with you. They may
                send another request in the future.
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmAction} variant={actionType === "accept" ? "default" : "destructive"}>
                {actionType === "accept" ? "Accept" : "Decline"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
