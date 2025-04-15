import type React from "react"
import { BrandSidebar } from "@/components/sidebar/brand-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <BrandSidebar />
      <SidebarInset className="p-6 overflow-auto">
        <div className="max-w-6xl mx-auto w-full">{children}</div>
      </SidebarInset>
    </div>
  )
}
