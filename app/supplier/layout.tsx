import type React from "react"
import { SupplierSidebar } from "@/components/sidebar/supplier-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <SupplierSidebar />
      <SidebarInset className="p-6 overflow-auto">
        <div className="max-w-6xl mx-auto w-full">{children}</div>
      </SidebarInset>
    </div>
  )
}
