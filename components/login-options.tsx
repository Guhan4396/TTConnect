"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Factory } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginOptions() {
  const router = useRouter()

  const handleBrandLogin = () => {
    router.push("/brand/ttconnect")
  }

  const handleSupplierLogin = () => {
    router.push("/supplier/ttconnect")
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Choose your account type</CardTitle>
        <CardDescription>Login as a brand or supplier to access your TTconnect dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start h-16 text-lg" onClick={handleBrandLogin}>
          <Building2 className="mr-4 h-6 w-6 text-blue-700" />
          <div className="flex flex-col items-start">
            <span>Login as Brand</span>
            <span className="text-xs text-gray-500">Optimize your supply chain</span>
          </div>
        </Button>

        <Button variant="outline" className="w-full justify-start h-16 text-lg" onClick={handleSupplierLogin}>
          <Factory className="mr-4 h-6 w-6 text-blue-700" />
          <div className="flex flex-col items-start">
            <span>Login as Supplier</span>
            <span className="text-xs text-gray-500">Connect with brands</span>
          </div>
        </Button>
      </CardContent>
    </Card>
  )
}
