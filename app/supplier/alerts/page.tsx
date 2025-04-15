"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertCircle, Bell, CheckCircle, Clock, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

// Mock data
const alerts = [
  {
    id: 1,
    type: "certification",
    message: "OEKO-TEX certification expires in 30 days",
    date: "2023-05-01",
    priority: "high",
    status: "unread",
  },
  {
    id: 2,
    type: "request",
    message: "New connection request from OrganicClothing",
    date: "2023-05-01",
    priority: "medium",
    status: "unread",
  },
  {
    id: 3,
    type: "document",
    message: "Document request from EcoFashion due in 5 days",
    date: "2023-04-30",
    priority: "high",
    status: "unread",
  },
  {
    id: 4,
    type: "system",
    message: "Profile strength below recommended level",
    date: "2023-04-28",
    priority: "low",
    status: "read",
  },
  {
    id: 5,
    type: "certification",
    message: "GRS certification has been verified",
    date: "2023-04-25",
    priority: "info",
    status: "read",
  },
  {
    id: 6,
    type: "document",
    message: "New sustainability assessment available",
    date: "2023-04-20",
    priority: "medium",
    status: "read",
  },
]

export default function SupplierAlerts() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  const filteredAlerts =
    activeTab === "all"
      ? alerts
      : activeTab === "unread"
        ? alerts.filter((alert) => alert.status === "unread")
        : alerts.filter((alert) => alert.type === activeTab)

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "certification":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "request":
        return <Bell className="h-5 w-5 text-purple-600" />
      case "document":
        return <FileText className="h-5 w-5 text-amber-600" />
      case "system":
        return <AlertCircle className="h-5 w-5 text-gray-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Low
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Info
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">View and manage your notifications</p>
        </div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">
              {alerts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <Badge variant="secondary" className="ml-2">
              {alerts.filter((a) => a.status === "unread").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="certification">Certifications</TabsTrigger>
          <TabsTrigger value="request">Requests</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <Card key={alert.id} className={alert.status === "unread" ? "border-l-4 border-l-blue-600" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-100 p-2 rounded-full">{getAlertIcon(alert.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{alert.message}</h3>
                          {getPriorityBadge(alert.priority)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {alert.date}
                        </div>
                      </div>
                      <div>
                        {alert.status === "unread" ? (
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark as Read
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No alerts found</h3>
                <p className="text-gray-500">There are no alerts in this category</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
