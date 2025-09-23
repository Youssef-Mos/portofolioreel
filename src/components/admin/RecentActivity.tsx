// src/components/admin/RecentActivity.tsx
"use client"
import { Clock, FolderOpen, Briefcase, Heart } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "project",
    action: "Projet créé",
    item: "Classification Musicale Spotify",
    time: "Il y a 2 jours",
    icon: FolderOpen,
    color: "text-blue-600"
  },
  {
    id: 2,
    type: "experience", 
    action: "Expérience ajoutée",
    item: "Assistant Ingénieur chez IXI Groupe",
    time: "Il y a 5 jours",
    icon: Briefcase,
    color: "text-green-600"
  },
  {
    id: 3,
    type: "project",
    action: "Projet modifié",
    item: "Site Web Omegup",
    time: "Il y a 1 semaine",
    icon: FolderOpen,
    color: "text-blue-600"
  },
  {
    id: 4,
    type: "engagement",
    action: "Engagement ajouté",
    item: "Responsable Communication SPT",
    time: "Il y a 2 semaines",
    icon: Heart,
    color: "text-purple-600"
  }
]

export function RecentActivity() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Voir tout
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className={`p-2 rounded-lg bg-gray-50 ${activity.color}`}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.action}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {activity.item}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune activité récente</p>
        </div>
      )}
    </div>
  )
}