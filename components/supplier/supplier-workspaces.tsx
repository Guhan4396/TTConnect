"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Clock, File, FileText, MessageSquare, Send, Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Mock data
const connectedBrands = [
  { id: 1, name: "EcoFashion", logo: "E" },
  { id: 2, name: "GreenWear", logo: "G" },
]

const messages = [
  { id: 1, sender: "brand", text: "Hello! We need your updated material certifications.", time: "10:30 AM" },
  { id: 2, sender: "supplier", text: "Hi there! I'll send those over today.", time: "10:35 AM" },
  {
    id: 3,
    sender: "brand",
    text: "Great, thank you! Also, could you provide an update on the production timeline?",
    time: "10:40 AM",
  },
]

const documents = [
  { id: 1, name: "Material Certification.pdf", status: "uploaded", date: "2023-04-01" },
  { id: 2, name: "Compliance Report.pdf", status: "requested", date: "2023-04-05" },
  { id: 3, name: "Production Timeline.xlsx", status: "uploaded", date: "2023-04-02" },
]

const checklistItems = [
  { id: 1, name: "Complete company profile", completed: true, dueDate: "2023-03-15" },
  { id: 2, name: "Upload certifications", completed: true, dueDate: "2023-03-20" },
  { id: 3, name: "Complete sustainability assessment", completed: false, dueDate: "2023-04-15" },
  { id: 4, name: "Provide production capacity details", completed: false, dueDate: "2023-04-20" },
]

export function SupplierWorkspaces() {
  const [selectedBrand, setSelectedBrand] = useState(connectedBrands[0])
  const [messageText, setMessageText] = useState("")
  const [activeTab, setActiveTab] = useState("messages")

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, you would send the message to the API
      setMessageText("")
    }
  }

  const completedItems = checklistItems.filter((item) => item.completed).length
  const completionPercentage = (completedItems / checklistItems.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {connectedBrands.map((brand) => (
          <Button
            key={brand.id}
            variant={selectedBrand.id === brand.id ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setSelectedBrand(brand)}
          >
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
              {brand.logo}
            </div>
            {brand.name}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium">
                {selectedBrand.logo}
              </div>
              {selectedBrand.name} Workspace
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="checklist">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Checklist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="mt-0">
              <div className="border rounded-lg h-80 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "supplier" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "supplier" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs text-gray-500 mt-1 text-right">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Documents</h3>
                  <Button size="sm" className="flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    Upload Document
                  </Button>
                </div>

                <div className="border rounded-lg divide-y">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <File className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-500">{new Date(doc.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div>
                        {doc.status === "uploaded" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Requested
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="checklist" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Onboarding Checklist</h3>
                  <div className="text-sm">
                    {completedItems} of {checklistItems.length} completed
                  </div>
                </div>

                <Progress value={completionPercentage} className="h-2" />

                <div className="border rounded-lg divide-y">
                  {checklistItems.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.completed ? (
                          <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                        )}
                        <div>
                          <p className={`font-medium text-sm ${item.completed ? "line-through text-gray-500" : ""}`}>
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {!item.completed && (
                        <Button size="sm" variant="outline">
                          Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
