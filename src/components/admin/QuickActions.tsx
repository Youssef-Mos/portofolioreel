// src/components/admin/QuickActions.tsx
"use client"
import Link from "next/link"
import { Plus, Edit, BarChart, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const actions = [
  {
    title: "Nouveau projet",
    description: "Ajouter un projet à votre portfolio",
    href: "/admin/projets/nouveau",
    icon: Plus,
    color: "bg-blue-600 hover:bg-blue-700"
  },
  {
    title: "Nouvelle expérience",
    description: "Ajouter une expérience professionnelle",
    href: "/admin/experiences/nouveau", 
    icon: Plus,
    color: "bg-green-600 hover:bg-green-700"
  },
  {
    title: "Modifier le contenu",
    description: "Éditer les projets existants",
    href: "/admin/projets",
    icon: Edit,
    color: "bg-purple-600 hover:bg-purple-700"
  },
  {
    title: "Voir les stats",
    description: "Analytics et performances",
    href: "/admin/analytics",
    icon: BarChart,
    color: "bg-orange-600 hover:bg-orange-700"
  }
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
          >
            <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <div className="ml-4">
              <h4 className="font-medium text-gray-900">{action.title}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

