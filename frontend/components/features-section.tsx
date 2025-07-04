import { Cpu, Upload, GalleryThumbnailsIcon as Gallery, History, BarChart3, Sparkles } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Cpu,
      title: "AI-Powered Generation",
      description: "Advanced machine learning models create realistic synthetic data tailored to your specifications.",
    },
    {
      icon: Upload,
      title: "Custom Model Upload",
      description: "Upload your own trained models and datasets to generate domain-specific synthetic data.",
    },
    {
      icon: Gallery,
      title: "Live Gallery",
      description: "Browse and organize generated datasets with intuitive filtering and categorization.",
    },
    {
      icon: History,
      title: "Generation History",
      description: "Track all your generations with detailed history and easy regeneration capabilities.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Monitor usage, accuracy metrics, and performance with comprehensive analytics.",
    },
    {
      icon: Sparkles,
      title: "AI Suggestions",
      description: "Get intelligent recommendations for optimal generation parameters and improvements.",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
            Everything you need for synthetic data generation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools and features designed to streamline your synthetic data workflow from generation to
            deployment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <feature.icon className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
