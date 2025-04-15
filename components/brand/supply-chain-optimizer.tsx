"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ArrowRight, Download, Globe, TrendingDown } from "lucide-react"

// Mock data
const supplyChainRoutes = [
  { id: 1, name: "Cotton T-Shirt Supply Chain" },
  { id: 2, name: "Denim Jeans Supply Chain" },
  { id: 3, name: "Polyester Jacket Supply Chain" },
]

const targetMarkets = [
  { id: 1, name: "North America" },
  { id: 2, name: "Europe" },
  { id: 3, name: "Asia Pacific" },
]

const optimizationLevels = [
  { id: "simple", name: "Simple", description: "Replace 1 supplier" },
  { id: "medium", name: "Medium", description: "Replace 2 suppliers" },
  { id: "max", name: "Maximum", description: "Optimize entire chain" },
]

export function SupplyChainOptimizer() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedRoute, setSelectedRoute] = useState<string>("")
  const [selectedMarket, setSelectedMarket] = useState<string>("")
  const [optimizationGoals, setOptimizationGoals] = useState<string[]>([])
  const [optimizationLevel, setOptimizationLevel] = useState<string>("")
  const [resultsView, setResultsView] = useState<"map" | "ui">("map")

  // New state for optimization weights
  const [costWeight, setCostWeight] = useState(33)
  const [carbonWeight, setCarbonWeight] = useState(33)
  const [timeWeight, setTimeWeight] = useState(34)

  // Track which goals are enabled
  const [isCostEnabled, setIsCostEnabled] = useState(true)
  const [isCarbonEnabled, setIsCarbonEnabled] = useState(true)
  const [isTimeEnabled, setIsTimeEnabled] = useState(true)

  // Update weights when goals are toggled
  useEffect(() => {
    const enabledCount = [isCostEnabled, isCarbonEnabled, isTimeEnabled].filter(Boolean).length

    if (enabledCount === 0) {
      // Default to all enabled if none are selected
      setIsCostEnabled(true)
      setIsCarbonEnabled(true)
      setIsTimeEnabled(true)
      setCostWeight(33)
      setCarbonWeight(33)
      setTimeWeight(34)
      return
    }

    // Calculate equal distribution
    const equalShare = Math.floor(100 / enabledCount)
    const remainder = 100 - equalShare * enabledCount

    // Distribute weights
    let newCostWeight = isCostEnabled ? equalShare : 0
    let newCarbonWeight = isCarbonEnabled ? equalShare : 0
    let newTimeWeight = isTimeEnabled ? equalShare : 0

    // Add remainder to the last enabled goal
    if (isTimeEnabled) newTimeWeight += remainder
    else if (isCarbonEnabled) newCarbonWeight += remainder
    else if (isCostEnabled) newCostWeight += remainder

    setCostWeight(newCostWeight)
    setCarbonWeight(newCarbonWeight)
    setTimeWeight(newTimeWeight)

    // Update optimization goals array for backward compatibility
    const goals: string[] = []
    if (isCostEnabled) goals.push("cost")
    if (isCarbonEnabled) goals.push("carbon")
    if (isTimeEnabled) goals.push("time")
    setOptimizationGoals(goals)
  }, [isCostEnabled, isCarbonEnabled, isTimeEnabled])

  // Handle slider changes
  const handleCostWeightChange = (value: number[]) => {
    if (!isCostEnabled) return

    const newCostWeight = value[0]
    const remainingWeight = 100 - newCostWeight

    if (isCarbonEnabled && isTimeEnabled) {
      // Distribute remaining weight proportionally between carbon and time
      const totalPrevWeight = carbonWeight + timeWeight
      if (totalPrevWeight === 0) {
        // Equal split if both were previously 0
        setCarbonWeight(Math.floor(remainingWeight / 2))
        setTimeWeight(Math.ceil(remainingWeight / 2))
      } else {
        const carbonRatio = carbonWeight / totalPrevWeight
        const newCarbonWeight = Math.round(remainingWeight * carbonRatio)
        setCarbonWeight(newCarbonWeight)
        setTimeWeight(remainingWeight - newCarbonWeight)
      }
    } else if (isCarbonEnabled) {
      setCarbonWeight(remainingWeight)
    } else if (isTimeEnabled) {
      setTimeWeight(remainingWeight)
    }

    setCostWeight(newCostWeight)
  }

  const handleCarbonWeightChange = (value: number[]) => {
    if (!isCarbonEnabled) return

    const newCarbonWeight = value[0]
    const remainingWeight = 100 - newCarbonWeight

    if (isCostEnabled && isTimeEnabled) {
      // Distribute remaining weight proportionally between cost and time
      const totalPrevWeight = costWeight + timeWeight
      if (totalPrevWeight === 0) {
        // Equal split if both were previously 0
        setCostWeight(Math.floor(remainingWeight / 2))
        setTimeWeight(Math.ceil(remainingWeight / 2))
      } else {
        const costRatio = costWeight / totalPrevWeight
        const newCostWeight = Math.round(remainingWeight * costRatio)
        setCostWeight(newCostWeight)
        setTimeWeight(remainingWeight - newCostWeight)
      }
    } else if (isCostEnabled) {
      setCostWeight(remainingWeight)
    } else if (isTimeEnabled) {
      setTimeWeight(remainingWeight)
    }

    setCarbonWeight(newCarbonWeight)
  }

  const handleTimeWeightChange = (value: number[]) => {
    if (!isTimeEnabled) return

    const newTimeWeight = value[0]
    const remainingWeight = 100 - newTimeWeight

    if (isCostEnabled && isCarbonEnabled) {
      // Distribute remaining weight proportionally between cost and carbon
      const totalPrevWeight = costWeight + carbonWeight
      if (totalPrevWeight === 0) {
        // Equal split if both were previously 0
        setCostWeight(Math.floor(remainingWeight / 2))
        setCarbonWeight(Math.ceil(remainingWeight / 2))
      } else {
        const costRatio = costWeight / totalPrevWeight
        const newCostWeight = Math.round(remainingWeight * costRatio)
        setCostWeight(newCostWeight)
        setCarbonWeight(remainingWeight - newCostWeight)
      }
    } else if (isCostEnabled) {
      setCostWeight(remainingWeight)
    } else if (isCarbonEnabled) {
      setCarbonWeight(remainingWeight)
    }

    setTimeWeight(newTimeWeight)
  }

  const handleGoalToggle = (goal: string) => {
    switch (goal) {
      case "cost":
        setIsCostEnabled(!isCostEnabled)
        break
      case "carbon":
        setIsCarbonEnabled(!isCarbonEnabled)
        break
      case "time":
        setIsTimeEnabled(!isTimeEnabled)
        break
    }
  }

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleReset = () => {
    setCurrentStep(1)
    setSelectedRoute("")
    setSelectedMarket("")
    setOptimizationGoals([])
    setOptimizationLevel("")
  }

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !selectedRoute
      case 2:
        return !selectedMarket
      case 4:
        return optimizationGoals.length === 0
      case 5:
        return !optimizationLevel
      default:
        return false
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i + 1 === currentStep
                  ? "bg-blue-700 text-white"
                  : i + 1 < currentStep
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Supply Chain</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-500">Choose a supply chain path to optimize</p>
            <RadioGroup value={selectedRoute} onValueChange={setSelectedRoute}>
              {supplyChainRoutes.map((route) => (
                <div key={route.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={route.id.toString()} id={`route-${route.id}`} />
                  <Label htmlFor={`route-${route.id}`}>{route.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Select Target Market</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-500">Choose the target market for your products</p>
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger>
                <SelectValue placeholder="Select target market" />
              </SelectTrigger>
              <SelectContent>
                {targetMarkets.map((market) => (
                  <SelectItem key={market.id} value={market.id.toString()}>
                    {market.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Current Supply Chain</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={resultsView} onValueChange={(v) => setResultsView(v as "map" | "ui")}>
              <TabsList className="mb-4">
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="ui">UI View</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-0">
                <div className="border rounded-lg p-4 h-80 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Supply Chain Map View</p>
                    <p className="text-sm text-gray-400">Shows current suppliers and routes on world map</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ui" className="mt-0">
                <div className="border rounded-lg p-4 h-80 overflow-auto">
                  <div className="space-y-4">
                    <div className="flex justify-between p-2 border-b">
                      <div>
                        <p className="font-medium">Current Metrics</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Total Cost: $125,000</p>
                        <p className="text-sm">Carbon Emissions: 45 tons CO2</p>
                        <p className="text-sm">Lead Time: 120 days</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Supply Chain Nodes</p>
                      {[1, 2, 3, 4, 5].map((node) => (
                        <div key={node} className="p-2 border rounded-md flex justify-between">
                          <div>
                            <p className="font-medium">Supplier {node}</p>
                            <p className="text-xs text-gray-500">
                              Process: {node % 2 === 0 ? "Manufacturing" : "Raw Materials"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs">Cost: ${(node * 10000).toLocaleString()}</p>
                            <p className="text-xs">Emissions: {node * 5} tons CO2</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Optimization Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-500">Select what you want to optimize for and adjust the importance of each goal</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer border-2 ${isCostEnabled ? "border-blue-700" : "border-gray-200"}`}
                onClick={() => handleGoalToggle("cost")}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isCostEnabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <TrendingDown className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">Cost</h3>
                  <p className="text-sm text-gray-500">Reduce production and shipping costs</p>
                  {isCostEnabled && <div className="font-bold text-blue-700 mt-2">{costWeight}%</div>}
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer border-2 ${isCarbonEnabled ? "border-blue-700" : "border-gray-200"}`}
                onClick={() => handleGoalToggle("carbon")}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isCarbonEnabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">Carbon Emissions</h3>
                  <p className="text-sm text-gray-500">Lower environmental impact</p>
                  {isCarbonEnabled && <div className="font-bold text-blue-700 mt-2">{carbonWeight}%</div>}
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer border-2 ${isTimeEnabled ? "border-blue-700" : "border-gray-200"}`}
                onClick={() => handleGoalToggle("time")}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isTimeEnabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <ArrowRight className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">Lead Time</h3>
                  <p className="text-sm text-gray-500">Reduce delivery time</p>
                  {isTimeEnabled && <div className="font-bold text-blue-700 mt-2">{timeWeight}%</div>}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 mt-6">
              <p className="font-medium">Adjust optimization weights</p>
              <p className="text-sm text-gray-500">
                Drag the sliders to set the importance of each goal. The total will always equal 100%.
              </p>

              <div className="space-y-6">
                <div className={`space-y-2 ${!isCostEnabled && "opacity-50"}`}>
                  <div className="flex justify-between">
                    <Label>Cost</Label>
                    <span className="text-sm font-medium">{costWeight}%</span>
                  </div>
                  <Slider
                    disabled={!isCostEnabled}
                    value={[costWeight]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleCostWeightChange}
                    className={!isCostEnabled ? "cursor-not-allowed" : ""}
                  />
                </div>

                <div className={`space-y-2 ${!isCarbonEnabled && "opacity-50"}`}>
                  <div className="flex justify-between">
                    <Label>Carbon Emissions</Label>
                    <span className="text-sm font-medium">{carbonWeight}%</span>
                  </div>
                  <Slider
                    disabled={!isCarbonEnabled}
                    value={[carbonWeight]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleCarbonWeightChange}
                    className={!isCarbonEnabled ? "cursor-not-allowed" : ""}
                  />
                </div>

                <div className={`space-y-2 ${!isTimeEnabled && "opacity-50"}`}>
                  <div className="flex justify-between">
                    <Label>Lead Time</Label>
                    <span className="text-sm font-medium">{timeWeight}%</span>
                  </div>
                  <Slider
                    disabled={!isTimeEnabled}
                    value={[timeWeight]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleTimeWeightChange}
                    className={!isTimeEnabled ? "cursor-not-allowed" : ""}
                  />
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">{costWeight + carbonWeight + timeWeight}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 5: Optimization Level</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-500">Choose how extensively you want to optimize your supply chain</p>
            <RadioGroup value={optimizationLevel} onValueChange={setOptimizationLevel}>
              {optimizationLevels.map((level) => (
                <div key={level.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={level.id} id={`level-${level.id}`} />
                  <Label htmlFor={`level-${level.id}`}>
                    <span className="font-medium">{level.name}</span> - {level.description}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {currentStep === 6 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 6: Optimization Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={resultsView} onValueChange={(v) => setResultsView(v as "map" | "ui")}>
              <TabsList className="mb-4">
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="ui">UI View</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-0">
                <div className="border rounded-lg p-4 h-80 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-blue-700 mx-auto mb-2" />
                    <p className="text-gray-700">Optimized Supply Chain Map</p>
                    <p className="text-sm text-gray-500">Blue/purple highlights show recommended alternatives</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ui" className="mt-0">
                <div className="border rounded-lg p-4 h-80 overflow-auto">
                  <div className="space-y-4">
                    <div className="flex justify-between p-2 border-b">
                      <div>
                        <p className="font-medium">Metrics Comparison</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          Cost: <span className="line-through">$125,000</span> →
                          <span className="text-green-600 font-medium">
                            {" "}
                            $
                            {optimizationLevel === "simple"
                              ? "118,000 (-6%)"
                              : optimizationLevel === "medium"
                                ? "105,000 (-16%)"
                                : "92,000 (-26%)"}
                          </span>
                        </p>
                        <p className="text-sm">
                          Carbon: <span className="line-through">45 tons</span> →
                          <span className="text-green-600 font-medium">
                            {" "}
                            {optimizationLevel === "simple"
                              ? "40 tons (-11%)"
                              : optimizationLevel === "medium"
                                ? "32 tons (-29%)"
                                : "25 tons (-44%)"}
                          </span>
                        </p>
                        <p className="text-sm">
                          Lead Time: <span className="line-through">120 days</span> →
                          <span className="text-green-600 font-medium">
                            {" "}
                            {optimizationLevel === "simple"
                              ? "110 days (-8%)"
                              : optimizationLevel === "medium"
                                ? "95 days (-21%)"
                                : "80 days (-33%)"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Recommended Changes</p>

                      {/* Show only one supplier replacement for "simple" level */}
                      {(optimizationLevel === "simple" ||
                        optimizationLevel === "medium" ||
                        optimizationLevel === "max") && (
                        <div className="p-2 border rounded-md bg-blue-50 border-blue-200">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Replace Supplier 2</p>
                              <p className="text-xs text-gray-500">Current: Fabric Masters (Bangladesh)</p>
                              <p className="text-xs text-blue-700">Recommended: Eco Textiles (Portugal)</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-green-600">-$8,000 cost</p>
                              <p className="text-xs text-green-600">-5 tons CO2</p>
                              <p className="text-xs text-green-600">-10 days</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Show second supplier replacement for "medium" and "max" levels */}
                      {(optimizationLevel === "medium" || optimizationLevel === "max") && (
                        <div className="p-2 border rounded-md bg-blue-50 border-blue-200">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Replace Supplier 4</p>
                              <p className="text-xs text-gray-500">Current: Dye Solutions (China)</p>
                              <p className="text-xs text-blue-700">Recommended: Green Fabrics (Spain)</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-green-600">-$12,000 cost</p>
                              <p className="text-xs text-green-600">-8 tons CO2</p>
                              <p className="text-xs text-green-600">-15 days</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Show additional supplier replacements for "max" level */}
                      {optimizationLevel === "max" && (
                        <>
                          <div className="p-2 border rounded-md bg-blue-50 border-blue-200">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Replace Supplier 1</p>
                                <p className="text-xs text-gray-500">Current: Textile Corp (Vietnam)</p>
                                <p className="text-xs text-blue-700">Recommended: Sustainable Fibers (Thailand)</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-green-600">-$5,000 cost</p>
                                <p className="text-xs text-green-600">-4 tons CO2</p>
                                <p className="text-xs text-green-600">-8 days</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border rounded-md bg-blue-50 border-blue-200">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Replace Supplier 5</p>
                                <p className="text-xs text-gray-500">Current: Thread Makers (Turkey)</p>
                                <p className="text-xs text-blue-700">Recommended: Premium Threads (Italy)</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-green-600">-$8,000 cost</p>
                                <p className="text-xs text-green-600">-3 tons CO2</p>
                                <p className="text-xs text-green-600">-7 days</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {currentStep === 7 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 7: Apply Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Optimization Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Cost Reduction:</span>
                  <span className="font-medium text-green-600">
                    {optimizationLevel === "simple"
                      ? "-$8,000 (6%)"
                      : optimizationLevel === "medium"
                        ? "-$20,000 (16%)"
                        : "-$33,000 (26%)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Carbon Reduction:</span>
                  <span className="font-medium text-green-600">
                    {optimizationLevel === "simple"
                      ? "-5 tons (11%)"
                      : optimizationLevel === "medium"
                        ? "-13 tons (29%)"
                        : "-20 tons (44%)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Lead Time Reduction:</span>
                  <span className="font-medium text-green-600">
                    {optimizationLevel === "simple"
                      ? "-10 days (8%)"
                      : optimizationLevel === "medium"
                        ? "-25 days (21%)"
                        : "-40 days (33%)"}
                  </span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-blue-200">
                  <span className="font-medium">Suppliers to Replace:</span>
                  <span className="font-medium">
                    {optimizationLevel === "simple" ? "1" : optimizationLevel === "medium" ? "2" : "4"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button className="flex-1">Apply Changes</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <div></div>
        )}

        {currentStep < 7 ? (
          <Button onClick={handleNext} disabled={isNextDisabled()}>
            Next
          </Button>
        ) : (
          <Button variant="outline" onClick={handleReset}>
            Start Over
          </Button>
        )}
      </div>
    </div>
  )
}
