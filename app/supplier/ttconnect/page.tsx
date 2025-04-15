"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupplierDashboard } from "@/components/supplier/supplier-dashboard"
import { SupplierWorkspaces } from "@/components/supplier/supplier-workspaces"

export default function SupplierTTConnect() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">TTconnect</h1>
        <p className="text-muted-foreground">Manage your brand connections and improve visibility</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <SupplierDashboard />
        </TabsContent>

        <TabsContent value="workspaces" className="space-y-4">
          <SupplierWorkspaces />
        </TabsContent>
      </Tabs>
    </div>
  )
}
