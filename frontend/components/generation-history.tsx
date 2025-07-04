"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, RotateCcw, Trash2, Download } from "lucide-react"

export function GenerationHistory() {
  const [history] = useState([
    {
      id: 1,
      title: "Police Dataset #1",
      category: "police",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "completed",
      outputSize: 100,
      accuracy: 94,
    },
    {
      id: 2,
      title: "Mandala Collection",
      category: "mandala",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: "completed",
      outputSize: 50,
      accuracy: 91,
    },
    {
      id: 3,
      title: "Portrait Series",
      category: "portrait",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "failed",
      outputSize: 75,
      accuracy: 0,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <History className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 font-display">Recent History</h3>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm mb-1">{item.title}</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {item.category}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</Badge>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div>Size: {item.outputSize} samples</div>
                  {item.status === "completed" && <div>Accuracy: {item.accuracy}%</div>}
                  <div>{formatTimeAgo(item.createdAt)}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {item.status === "completed" && (
                <>
                  <Button size="sm" variant="ghost" className="h-7 px-2">
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2">
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </>
              )}
              <Button size="sm" variant="ghost" className="h-7 px-2 text-red-600 hover:text-red-700">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
          View Full History
        </Button>
      </div>
    </div>
  )
}
