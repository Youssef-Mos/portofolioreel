// src/components/admin/AdminNav.tsx
"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  FolderOpen, 
  Briefcase, 
  Heart, 
  Settings,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true
  },
  {
    href: "/admin/projets",
    label: "Projets",
    icon: FolderOpen
  },
  {
    href: "/admin/experiences", 
    label: "Expériences",
    icon: Briefcase
  },
  {
    href: "/admin/engagements",
    label: "Engagements",
    icon: Heart
  },
  {
    href: "/admin/technologies",
    label: "Technologies",
    icon: Settings
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3
  }
]

export function AdminNav() {
  const pathname = usePathname()
  
  return (
    <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? pathname === item.href
              : pathname.startsWith(item.href)
              
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
        
        {/* Stats Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Aperçu rapide
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Projets</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expériences</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Engagements</span>
              <span className="font-medium">3</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}