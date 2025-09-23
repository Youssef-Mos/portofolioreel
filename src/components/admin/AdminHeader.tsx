// src/components/admin/AdminHeader.tsx
"use client"
import { signOut } from "next-auth/react"
import { User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Admin</h1>
          <p className="text-sm text-gray-600">Gestion du contenu</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{user.name || user.email}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

