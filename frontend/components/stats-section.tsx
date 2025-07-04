import { TrendingUp, Database, Shield, Clock } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Database,
      value: "10M+",
      label: "Datasets Generated",
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      value: "99.9%",
      label: "Accuracy Rate",
      color: "text-green-500",
    },
    {
      icon: Shield,
      value: "100%",
      label: "Privacy Protected",
      color: "text-purple-500",
    },
    {
      icon: Clock,
      value: "3s",
      label: "Average Generation Time",
      color: "text-orange-500",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
            Trusted by 10,000+ researchers worldwide
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join leading organizations using SynthGen to accelerate their AI development with high-quality synthetic
            data.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg mb-4">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 font-display">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
