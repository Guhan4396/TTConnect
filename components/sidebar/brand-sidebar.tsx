"use client"

import {
  BarChart3,
  CheckSquare,
  FileText,
  Globe,
  Grid3x3,
  Package,
  PieChart,
  Users,
  Link2,
  ShoppingBag,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function BrandSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: "Visualization", icon: PieChart, href: "/brand/visualization" },
    { name: "Map View", icon: Globe, href: "/brand/map-view" },
    { name: "BI Reports", icon: BarChart3, href: "/brand/bi-reports" },
    { name: "Reports", icon: FileText, href: "/brand/reports" },
    { name: "Task Manager", icon: CheckSquare, href: "/brand/task-manager" },
    { name: "Product", icon: Package, href: "/brand/product" },
    { name: "Supplier", icon: Users, href: "/brand/supplier" },
    { name: "Data Collection Requests", icon: Grid3x3, href: "/brand/data-collection" },
    { name: "Marketplace", icon: ShoppingBag, href: "/brand/marketplace" },
    { name: "TTconnect", icon: Link2, href: "/brand/ttconnect" },
  ]

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center">
          <img src="/abstract-interconnected-network.png" alt="Trustrace Logo" className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl">trustrace</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <SidebarMenu className="list-none">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name} className="px-2 py-1">
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
