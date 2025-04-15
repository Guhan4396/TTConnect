"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConnectionRequestModalProps {
  isOpen: boolean
  onClose: () => void
  supplier: any
}

export function ConnectionRequestModal({ isOpen, onClose, supplier }: ConnectionRequestModalProps) {
  const [message, setMessage] = useState(
    `Hi ${supplier?.name},\n\nWe're interested in your products and would like to connect with you on TTconnect. Looking forward to exploring potential collaboration opportunities.\n\nBest regards,\nYour Brand`,
  )

  const handleSendRequest = () => {
    // In a real app, you would send the connection request to the API
    onClose()
  }

  if (!supplier) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect with {supplier.name}</DialogTitle>
          <DialogDescription>Send a connection request to start collaborating with this supplier.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            className="min-h-[150px]"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendRequest}>Send Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
