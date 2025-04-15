"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import { SupplierTable } from "@/components/brand/supplier-table"
import { SupplierProfile } from "@/components/brand/supplier-profile"

// Update the comment to clarify the supplier categories
// Mock data
const mySuppliers = [
  { id: 1, name: "Textile Corp", country: "Vietnam", riskScore: 85, certifications: ["GOTS", "GRS"] },
  { id: 2, name: "Fabric Masters", country: "Bangladesh", riskScore: 65, certifications: ["GOTS"] },
  { id: 3, name: "Cotton Experts", country: "India", riskScore: 45, certifications: ["BCI", "OEKO-TEX"] },
  { id: 4, name: "Dye Solutions", country: "China", riskScore: 30, certifications: ["ZDHC"] },
  { id: 5, name: "Thread Makers", country: "Turkey", riskScore: 75, certifications: ["ISO 9001", "OEKO-TEX"] },
]; // These are already your suppliers, but not formally "connected" in TTconnect

const connectedSuppliers = [
  { id: 6, name: "Eco Fabrics", country: "Portugal", riskScore: 90, certifications: ["GOTS", "GRS", "OEKO-TEX"] },
  { id: 7, name: "Sustainable Textiles", country: "Germany", riskScore: 95, certifications: ["GOTS", "GRS", "BCI"] },
]; // These are formally connected through TTconnect

export function BrandDashboard() {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null)

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const sortedMySuppliers = [...mySuppliers].sort((a, b) => {
    return sortDirection === "desc" ? b.riskScore - a.riskScore : a.riskScore - b.riskScore
  })

  const sortedConnectedSuppliers = [...connectedSuppliers].sort((a, b) => {
    return sortDirection === "desc" ? b.riskScore - a.riskScore : a.riskScore - b.riskScore
  })

  const handleSupplierClick = (supplier: any) => {
    setSelectedSupplier(supplier)
  }

  const handleBackToList = () => {
    setSelectedSupplier(null)
  }

  if (selectedSupplier) {
    return <SupplierProfile supplier={selectedSupplier} onBack={handleBackToList} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={toggleSort} className="flex items-center gap-2">
          Sort by Risk Score
          {sortDirection === "desc" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierTable suppliers={sortedMySuppliers} onSupplierClick={handleSupplierClick} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierTable
            suppliers={sortedConnectedSuppliers}
            onSupplierClick={handleSupplierClick}
            isConnected={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}
