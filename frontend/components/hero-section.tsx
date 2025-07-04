import { Button } from "@/components/ui/button"
import { Play, Zap, Target, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-white to-blue-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 font-display">
            Create limitless synthetic datasets with <span className="text-blue-600">AI precision</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-serif">
            Generate high-quality synthetic data for machine learning, testing, and research. Powered by advanced AI
            models with enterprise-grade accuracy and privacy protection.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-10 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>HD image in 3s</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-500" />
              <span>99.9% accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>500+ AI models</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3">
              Start Generating
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20"></div>
      </div>
    </section>
  )
}
