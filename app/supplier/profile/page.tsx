"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SupplierProfile() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("company")
  const profileStrength = 85

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground">Complete your profile to increase visibility to brands</p>
        </div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Profile Completion</CardTitle>
            <div className="text-sm font-medium">{profileStrength}%</div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={profileStrength} className="h-2" />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" placeholder="Your company name" defaultValue="Textile Solutions Ltd." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year-founded">Year Founded</Label>
                  <Input id="year-founded" placeholder="Year" defaultValue="2010" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-description">Company Description</Label>
                <Textarea
                  id="company-description"
                  placeholder="Describe your company, products, and services"
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Input id="employees" placeholder="Number of employees" defaultValue="250" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select defaultValue="vietnam">
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vietnam">Vietnam</SelectItem>
                      <SelectItem value="china">China</SelectItem>
                      <SelectItem value="bangladesh">Bangladesh</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="turkey">Turkey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name</Label>
                  <Input id="contact-name" placeholder="Full name" defaultValue="John Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-position">Position</Label>
                  <Input id="contact-position" placeholder="Job title" defaultValue="Supply Chain Manager" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="Email address"
                    defaultValue="john@textilecompany.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input id="contact-phone" placeholder="Phone number" defaultValue="+84 123 456 789" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Capacity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly-capacity">Monthly Capacity</Label>
                  <Input id="monthly-capacity" placeholder="Units per month" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-order">Minimum Order Quantity</Label>
                  <Input id="min-order" placeholder="Units" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-time">Average Lead Time (days)</Label>
                <Input id="lead-time" placeholder="Days" />
              </div>

              <div className="space-y-2">
                <Label>Value Processes</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["Cutting", "Sewing", "Dyeing", "Printing", "Embroidery", "Washing", "Finishing"].map((process) => (
                    <div key={process} className="flex items-center space-x-2">
                      <input type="checkbox" id={`process-${process}`} className="rounded border-gray-300" />
                      <Label htmlFor={`process-${process}`} className="text-sm">
                        {process}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Materials Used</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "Cotton",
                    "Organic Cotton",
                    "Polyester",
                    "Recycled Polyester",
                    "Linen",
                    "Wool",
                    "Silk",
                    "Elastane",
                    "Tencel",
                  ].map((material) => (
                    <div key={material} className="flex items-center space-x-2">
                      <input type="checkbox" id={`material-${material}`} className="rounded border-gray-300" />
                      <Label htmlFor={`material-${material}`} className="text-sm">
                        {material}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sustainability-policy">Sustainability Policy</Label>
                <Textarea
                  id="sustainability-policy"
                  placeholder="Describe your company's sustainability policy and initiatives"
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Environmental Initiatives</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Water Conservation",
                    "Energy Efficiency",
                    "Waste Reduction",
                    "Chemical Management",
                    "Carbon Footprint Reduction",
                  ].map((initiative) => (
                    <div key={initiative} className="flex items-center space-x-2">
                      <input type="checkbox" id={`initiative-${initiative}`} className="rounded border-gray-300" />
                      <Label htmlFor={`initiative-${initiative}`} className="text-sm">
                        {initiative}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Factory Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div
                    key={index}
                    className="border rounded-md p-2 flex flex-col items-center justify-center h-40 bg-gray-50"
                  >
                    {index <= 2 ? (
                      <img
                        src={`/placeholder.svg?height=150&width=150&query=factory%20image%20${index}`}
                        alt={`Factory image ${index}`}
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full w-full">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Upload Image</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button className="flex items-center gap-1">
          <Save className="h-4 w-4" />
          Save Profile
        </Button>
      </div>
    </div>
  )
}
