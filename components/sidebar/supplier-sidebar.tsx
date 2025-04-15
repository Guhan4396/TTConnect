"use client"

import {
  AlertCircle,
  CheckSquare,
  ClipboardList,
  Factory,
  FileText,
  Globe,
  Package,
  PieChart,
  Users,
  Link2,
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

export function SupplierSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: "Pending Tasks", icon: CheckSquare, href: "/supplier/pending-tasks" },
    { name: "Supply Chain Mapping", icon: Globe, href: "/supplier/supply-chain-mapping" },
    { name: "Product Component Mapping", icon: PieChart, href: "/supplier/product-component" },
    { name: "PO Management", icon: ClipboardList, href: "/supplier/po-management" },
    { name: "PO Tracing", icon: Globe, href: "/supplier/po-tracing" },
    { name: "Reports", icon: FileText, href: "/supplier/reports" },
    { name: "Product Segregation", icon: Package, href: "/supplier/product-segregation" },
    { name: "Request Supplier Addition", icon: Users, href: "/supplier/request-supplier" },
    { name: "Scope Certificate", icon: FileText, href: "/supplier/scope-certificate" },
    { name: "Assessments", icon: AlertCircle, href: "/supplier/assessments" },
    { name: "Suppliers", icon: Factory, href: "/supplier/suppliers" },
    { name: "TTconnect", icon: Link2, href: "/supplier/ttconnect" },
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
