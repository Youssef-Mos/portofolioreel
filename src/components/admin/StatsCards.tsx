// src/components/admin/StatsCards.tsx
import { 
  FolderOpen, 
  Briefcase, 
  Heart, 
  Settings,
  TrendingUp,
  Clock
} from "lucide-react"

const stats = [
  {
    title: "Projets",
    value: "5",
    change: "+1 ce mois",
    changeType: "increase" as const,
    icon: FolderOpen,
    color: "bg-blue-500"
  },
  {
    title: "Expériences",
    value: "3", 
    change: "Dernière: IXI Groupe",
    changeType: "neutral" as const,
    icon: Briefcase,
    color: "bg-green-500"
  },
  {
    title: "Engagements",
    value: "3",
    change: "Projets sociaux",
    changeType: "neutral" as const,
    icon: Heart,
    color: "bg-purple-500"
  },
  {
    title: "Technologies",
    value: "25+",
    change: "Web, Data, AI",
    changeType: "neutral" as const,
    icon: Settings,
    color: "bg-orange-500"
  }
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className={`text-sm mt-2 ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-gray-500'
              }`}>
                {stat.change}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}