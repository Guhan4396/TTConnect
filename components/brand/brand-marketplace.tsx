"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Filter, MessageSquare, Search } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ConnectionRequestModal } from "@/components/shared/connection-request-modal"
import { getRiskColor } from "@/lib/utils"

// Mock data
const suppliers = [
  {
    id: 1,
    name: "Eco Textiles",
    country: "Portugal",
    riskScore: 92,
    matchPercentage: 95,
    certifications: ["GOTS", "GRS", "OEKO-TEX"],
    materials: ["Cotton", "Hemp", "Linen"],
    valueProcesses: ["Cutting", "Sewing", "Dyeing"],
    connected: false,
  },
  {
    id: 2,
    name: "Green Fabrics",
    country: "Spain",
    riskScore: 88,
    matchPercentage: 90,
    certifications: ["GOTS", "BCI"],
    materials: ["Cotton", "Recycled Polyester"],
    valueProcesses: ["Weaving", "Finishing"],
    connected: false,
  },
  {
    id: 3,
    name: "Sustainable Textiles",
    country: "Germany",
    riskScore: 95,
    matchPercentage: 85,
    certifications: ["GOTS", "GRS", "BCI", "OEKO-TEX"],
    materials: ["Organic Cotton", "Recycled Polyester", "Tencel"],
    valueProcesses: ["Spinning", "Weaving", "Dyeing", "Finishing"],
    connected: true,
  },
  {
    id: 4,
    name: "Organic Materials",
    country: "Italy",
    riskScore: 90,
    matchPercentage: 80,
    certifications: ["GOTS", "OEKO-TEX"],
    materials: ["Organic Cotton", "Silk", "Wool"],
    valueProcesses: ["Spinning", "Weaving", "Finishing"],
    connected: false,
  },
  {
    id: 5,
    name: "Ethical Fabrics",
    country: "France",
    riskScore: 85,
    matchPercentage: 75,
    certifications: ["GOTS", "Fair Trade"],
    materials: ["Cotton", "Linen"],
    valueProcesses: ["Weaving", "Dyeing"],
    connected: false,
  },
]

// Filter options
const certificationOptions = ["GOTS", "GRS", "BCI", "OEKO-TEX", "Fair Trade"]
const locationOptions = ["Portugal", "Spain", "Germany", "Italy", "France"]
const valueProcessOptions = ["Spinning", "Weaving", "Cutting", "Sewing", "Dyeing", "Finishing"]
const materialOptions = ["Cotton", "Organic Cotton", "Recycled Polyester", "Hemp", "Linen", "Silk", "Wool", "Tencel"]

export function BrandMarketplace() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter states
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedValueProcesses, setSelectedValueProcesses] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [riskRange, setRiskRange] = useState([0, 100])

  const filteredSuppliers = suppliers.filter((supplier) => {
    // Search term filter
    if (searchTerm && !supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Certifications filter
    if (
      selectedCertifications.length > 0 &&
      !selectedCertifications.some((cert) => supplier.certifications.includes(cert))
    ) {
      return false
    }

    // Location filter
    if (selectedLocations.length > 0 && !selectedLocations.includes(supplier.country)) {
      return false
    }

    // Value processes filter
    if (
      selectedValueProcesses.length > 0 &&
      !selectedValueProcesses.some((process) => supplier.valueProcesses.includes(process))
    ) {
      return false
    }

    // Materials filter
    if (selectedMaterials.length > 0 && !selectedMaterials.some((material) => supplier.materials.includes(material))) {
      return false
    }

    // Risk score filter
    if (supplier.riskScore < riskRange[0] || supplier.riskScore > riskRange[1]) {
      return false
    }

    return true
  })

  const handleConnect = (supplier: any) => {
    setSelectedSupplier(supplier)
    setIsModalOpen(true)
  }

  const toggleCertification = (cert: string) => {
    setSelectedCertifications((prev) => (prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]))
  }

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) => (prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]))
  }

  const toggleValueProcess = (process: string) => {
    setSelectedValueProcesses((prev) =>
      prev.includes(process) ? prev.filter((p) => p !== process) : [...prev, process],
    )
  }

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) => (prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search suppliers..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {(selectedCertifications.length > 0 ||
                selectedLocations.length > 0 ||
                selectedValueProcesses.length > 0 ||
                selectedMaterials.length > 0 ||
                riskRange[0] > 0 ||
                riskRange[1] < 100) && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {selectedCertifications.length +
                    selectedLocations.length +
                    selectedValueProcesses.length +
                    selectedMaterials.length +
                    (riskRange[0] > 0 || riskRange[1] < 100 ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Suppliers</SheetTitle>
            </SheetHeader>

            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <Label>Certifications</Label>
                <div className="grid grid-cols-2 gap-2">
                  {certificationOptions.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cert-${cert}`}
                        checked={selectedCertifications.includes(cert)}
                        onCheckedChange={() => toggleCertification(cert)}
                      />
                      <Label htmlFor={`cert-${cert}`} className="text-sm">
                        {cert}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <div className="grid grid-cols-2 gap-2">
                  {locationOptions.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`loc-${location}`}
                        checked={selectedLocations.includes(location)}
                        onCheckedChange={() => toggleLocation(location)}
                      />
                      <Label htmlFor={`loc-${location}`} className="text-sm">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Value Processes</Label>
                <div className="grid grid-cols-2 gap-2">
                  {valueProcessOptions.map((process) => (
                    <div key={process} className="flex items-center space-x-2">
                      <Checkbox
                        id={`proc-${process}`}
                        checked={selectedValueProcesses.includes(process)}
                        onCheckedChange={() => toggleValueProcess(process)}
                      />
                      <Label htmlFor={`proc-${process}`} className="text-sm">
                        {process}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Materials</Label>
                <div className="grid grid-cols-2 gap-2">
                  {materialOptions.map((material) => (
                    <div key={material} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mat-${material}`}
                        checked={selectedMaterials.includes(material)}
                        onCheckedChange={() => toggleMaterial(material)}
                      />
                      <Label htmlFor={`mat-${material}`} className="text-sm">
                        {material}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Risk Score Range</Label>
                  <span className="text-sm">
                    {riskRange[0]} - {riskRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 100]}
                  min={0}
                  max={100}
                  step={5}
                  value={riskRange}
                  onValueChange={setRiskRange}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="overflow-hidden flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{supplier.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor(supplier.riskScore) }} />
                  <span className="font-bold text-sm">{supplier.riskScore}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">{supplier.country}</p>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">Match</span>
                  <span className="text-sm font-medium">{supplier.matchPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-700 rounded-full" style={{ width: `${supplier.matchPercentage}%` }} />
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-medium mb-1">Certifications</h4>
                <div className="flex flex-wrap gap-1">
                  {supplier.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                {supplier.connected ? (
                  <Button className="w-full" variant="outline">
                    <Check className="mr-2 h-4 w-4" />
                    Connected
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleConnect(supplier)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Request to Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No suppliers match your filters.</p>
        </div>
      )}

      <ConnectionRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} supplier={selectedSupplier} />
    </div>
  )
}
