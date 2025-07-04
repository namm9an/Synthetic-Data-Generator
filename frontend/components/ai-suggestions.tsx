"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Clock, Target } from "lucide-react"

export function AISuggestions() {
  const [suggestions] = useState([
    {
      id: 1,
      title: "High-Quality Portraits",
      description: "Generate realistic human portraits with improved facial features",
      confidence: 92,
      estimatedTime: "2-3 minutes",
      category: "portrait",
      status: "ready",
    },
    {
      id: 2,
      title: "Abstract Art Patterns",
      description: "Create unique abstract patterns for design applications",
      confidence: 87,
      estimatedTime: "1-2 minutes",
      category: "abstract",
      status: "training",
    },
    {
      id: 3,
      title: "Police Vehicle Dataset",
      description: "Expand your police vehicle collection with varied angles",
      confidence: 95,
      estimatedTime: "3-4 minutes",
      category: "police",
      status: "ready",
    },
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 font-display">AI Suggestions</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>

                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>{suggestion.confidence}% confidence</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{suggestion.estimatedTime}</span>
                  </div>
                </div>

                {suggestion.status === "training" && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Training Progress</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-1" />
                  </div>
                )}
              </div>

              <Badge variant="outline" className="capitalize ml-2">
                {suggestion.category}
              </Badge>
            </div>

            <Button
              size="sm"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={suggestion.status === "training"}
            >
              {suggestion.status === "training" ? "Training..." : "Start Training"}
            </Button>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          View All Suggestions
        </Button>
      </div>
    </div>
  )
}
