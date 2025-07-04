"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, Download, Search, Filter, Grid, List } from "lucide-react"

export function LiveGallery() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  // Mock data
  const categories = [
    { id: "all", name: "All", count: 156 },
    { id: "police", name: "Police", count: 42 },
    { id: "mandala", name: "Mandala", count: 38 },
    { id: "portrait", name: "Portrait", count: 51 },
    { id: "landscape", name: "Landscape", count: 25 },
  ]

  const mockImages = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    url: `/placeholder.svg?height=300&width=300`,
    category: ["police", "mandala", "portrait", "landscape"][i % 4],
    likes: Math.floor(Math.random() * 50) + 5,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    isLiked: Math.random() > 0.7,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Live Gallery</h1>
          <p className="text-gray-600">Browse and manage your generated datasets</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === category.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category.name}
            <Badge variant="secondary" className="ml-2">
              {category.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={`Generated ${image.category}`}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button size="sm" variant="secondary">
                    View Full
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="capitalize">
                    {image.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{image.createdAt.toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    className={`flex items-center space-x-1 text-sm ${
                      image.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                    } transition-colors`}
                  >
                    <Heart className={`w-4 h-4 ${image.isLiked ? "fill-current" : ""}`} />
                    <span>{image.likes}</span>
                  </button>

                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {mockImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
              <img
                src={image.url || "/placeholder.svg"}
                alt={`Generated ${image.category}`}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline" className="capitalize">
                    {image.category}
                  </Badge>
                  <span className="text-sm text-gray-500">{image.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className={`flex items-center space-x-1 text-sm ${
                      image.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                    } transition-colors`}
                  >
                    <Heart className={`w-4 h-4 ${image.isLiked ? "fill-current" : ""}`} />
                    <span>{image.likes}</span>
                  </button>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {mockImages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h3>
          <p className="text-gray-600 mb-4">Start generating synthetic data to see your results here.</p>
          <Button className="bg-blue-500 hover:bg-blue-600">Generate Your First Dataset</Button>
        </div>
      )}
    </div>
  )
}
