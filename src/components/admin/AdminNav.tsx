// src/components/admin/AdminNav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FolderOpen, 
  Briefcase, 
  Heart,
  Calendar,  // <-- NOUVEAU
  Settings,
  BarChart
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projets", href: "/admin/projets", icon: FolderOpen },
  { name: "Expériences", href: "/admin/experiences", icon: Briefcase },
  { name: "Engagements", href: "/admin/engagements", icon: Heart },
  { name: "Rendez-vous", href: "/admin/appointments", icon: Calendar }, // <-- NOUVEAU
  { name: "Analytics", href: "/admin/analytics", icon: BarChart },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                ${isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}