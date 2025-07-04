import { Header } from "@/components/header"
import { GenerationControls } from "@/components/generation-controls"
import { LiveGallery } from "@/components/live-gallery"
import { AISuggestions } from "@/components/ai-suggestions"
import { GenerationHistory } from "@/components/generation-history"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {/* Left Sidebar - Generation Controls */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
          <GenerationControls />
        </div>

        {/* Main Content - Live Gallery */}
        <div className="flex-1 p-6">
          <LiveGallery />
        </div>

        {/* Right Panel - AI Suggestions & History */}
        <div className="w-80 bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto">
          <div className="p-4 space-y-6">
            <AISuggestions />
            <GenerationHistory />
          </div>
        </div>
      </div>
    </div>
  )
}
