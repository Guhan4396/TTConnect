"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { getRiskColor } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface SupplierTableProps {
  suppliers: any[]
  onSupplierClick: (supplier: any) => void
  isConnected?: boolean
}

export function SupplierTable({ suppliers, onSupplierClick, isConnected = false }: SupplierTableProps) {
  const router = useRouter()

  const handleOpenWorkspace = (e: React.MouseEvent, supplierId: number) => {
    e.stopPropagation() // Prevent triggering the row click
    router.push(`/brand/workspace/${supplierId}`)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Supplier Name</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Risk Score</TableHead>
          <TableHead>Certifications</TableHead>
          {isConnected && <TableHead className="text-right">Workspace</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow
            key={supplier.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onSupplierClick(supplier)}
          >
            <TableCell className="font-medium">{supplier.name}</TableCell>
            <TableCell>{supplier.country}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor(supplier.riskScore) }} />
                <span>{supplier.riskScore}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {supplier.certifications.map((cert: string) => (
                  <Badge key={cert} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </TableCell>
            {isConnected && (
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={(e) => handleOpenWorkspace(e, supplier.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Open Workspace
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
