"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageSquare, RefreshCw } from "lucide-react"
import { getRiskColor } from "@/lib/utils"
import { ConnectionRequestModal } from "@/components/shared/connection-request-modal"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface SupplierProfileProps {
  supplier: any
  onBack: () => void
}

export function SupplierProfile({ supplier, onBack }: SupplierProfileProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  // Update the isConnected logic to consider both connected suppliers and "My Suppliers"
  // Mock logic to determine if connected or in "My Suppliers" section
  const isConnected = supplier.id > 5 // Connected suppliers
  const isMySupplier = supplier.id <= 5 // My Suppliers section

  const handleOpenWorkspace = () => {
    router.push(`/brand/workspace/${supplier.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to suppliers
        </Button>

        {/* Update the button rendering logic in the top section */}
        <div className="flex gap-2">
          {isConnected ? (
            <Button className="flex items-center gap-2" onClick={handleOpenWorkspace}>
              <MessageSquare className="h-4 w-4" />
              Open Workspace
            </Button>
          ) : isMySupplier ? // For "My Suppliers", don't show "Request to Connect"
          null : (
            <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
              <MessageSquare className="h-4 w-4" />
              Request to Connect
            </Button>
          )}

          {/* Always show Replace Supplier button */}
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Replace Supplier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{supplier.name}</CardTitle>
                  <p className="text-sm text-gray-500">{supplier.country}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Risk Score</span>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getRiskColor(supplier.riskScore) }}
                    />
                    <span className="font-bold">{supplier.riskScore}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {supplier.certifications.map((cert: string) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Employees</h3>
                  <p>Total: 250 (Male: 150, Female: 100)</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Value Processes</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Cutting
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Sewing
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Dyeing
                    </Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Materials</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Cotton
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Polyester
                    </Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Facilities</h3>
                  <p>2 production sites</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Traceability Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    GOTS
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Organic
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Fair Trade
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">To-do List</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm">
                  <li>Update facility information</li>
                  <li>Complete sustainability assessment</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Raw Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  Cotton
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Polyester
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Elastane
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Styles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">12 active styles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Last audit: March 2023</p>
              <p className="text-sm">Next audit: April 2024</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConnectionRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} supplier={supplier} />
    </div>
  )
}
