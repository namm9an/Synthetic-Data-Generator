"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Zap, Settings } from "lucide-react"

export function GenerationControls() {
  const [classLabel, setClassLabel] = useState("")
  const [noiseLevel, setNoiseLevel] = useState([0.3])
  const [outputSize, setOutputSize] = useState(100)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900 font-display">Generation Controls</h2>
      </div>

      {/* Class Label Selection */}
      <div className="space-y-2">
        <Label htmlFor="class-label">Class Label</Label>
        <Select value={classLabel} onValueChange={setClassLabel}>
          <SelectTrigger>
            <SelectValue placeholder="Select or search class..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adult">ADULT</SelectItem>
            <SelectItem value="police">POLICE</SelectItem>
            <SelectItem value="mandala">MANDALA</SelectItem>
            <SelectItem value="portrait">PORTRAIT</SelectItem>
            <SelectItem value="landscape">LANDSCAPE</SelectItem>
            <SelectItem value="abstract">ABSTRACT</SelectItem>
          </SelectContent>
        </Select>

        {/* Popular suggestions */}
        <div className="flex flex-wrap gap-2 mt-2">
          {["Police", "Mandala", "Portrait"].map((tag) => (
            <button
              key={tag}
              onClick={() => setClassLabel(tag.toLowerCase())}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Noise Level Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Noise Level</Label>
          <span className="text-sm text-gray-500">{noiseLevel[0].toFixed(1)}</span>
        </div>
        <Slider value={noiseLevel} onValueChange={setNoiseLevel} max={1} min={0} step={0.1} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Balanced</span>
          <span>Noisy</span>
        </div>
      </div>

      {/* Output Size */}
      <div className="space-y-2">
        <Label htmlFor="output-size">Output Size</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="output-size"
            type="number"
            value={outputSize}
            onChange={(e) => setOutputSize(Number(e.target.value))}
            min={1}
            max={1000}
            className="flex-1"
          />
          <div className="flex flex-col">
            <button
              onClick={() => setOutputSize((prev) => Math.min(1000, prev + 10))}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-t"
            >
              +
            </button>
            <button
              onClick={() => setOutputSize((prev) => Math.max(1, prev - 10))}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-b"
            >
              -
            </button>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !classLabel}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
      >
        {isGenerating ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Generate Data</span>
          </div>
        )}
      </Button>

      {/* Upload Custom Model */}
      <Button variant="outline" className="w-full bg-transparent">
        <Upload className="w-4 h-4 mr-2" />
        Upload Custom Model
      </Button>

      <div className="text-xs text-gray-500 mt-2">Supported formats: .pt, .pth, .onnx, .csv, .npz</div>
    </div>
  )
}
