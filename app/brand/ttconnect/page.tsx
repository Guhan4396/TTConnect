"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrandDashboard } from "@/components/brand/brand-dashboard"
import { BrandMarketplace } from "@/components/brand/brand-marketplace"
import { SupplyChainOptimizer } from "@/components/brand/supply-chain-optimizer"

export default function BrandTTConnect() {
  const [activeTab, setActiveTab] = useState("activity")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">TTconnect</h1>
        <p className="text-muted-foreground">Manage your supplier connections and optimize your supply chain</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="optimize">Optimize Supply Chain</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <BrandDashboard />
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <BrandMarketplace />
        </TabsContent>

        <TabsContent value="optimize" className="space-y-4">
          <SupplyChainOptimizer />
        </TabsContent>
      </Tabs>
    </div>
  )
}
