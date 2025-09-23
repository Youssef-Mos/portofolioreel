// src/app/admin/technologies/page.tsx
import { TechnologiesTable } from "@/components/admin/TechnologiesTable"
import { Button } from "@/components/ui/button"
import { Plus, Info } from "lucide-react"
import Link from "next/link"

export default function AdminTechnologiesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Technologies</h1>
          <p className="text-gray-600 mt-2">
            Gérez les technologies et compétences de votre portfolio
          </p>
        </div>
        
        <Link href="/admin/technologies/nouveau">
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouvelle technologie</span>
          </Button>
        </Link>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">À propos des technologies</h3>
            <p className="text-sm text-blue-700 mt-1">
              Les technologies utilisées sont automatiquement liées aux projets, expériences et engagements. 
              Vous ne pouvez supprimer une technologie que si elle n'est utilisée nulle part.
            </p>
          </div>
        </div>
      </div>

      {/* Technologies Table */}
      <TechnologiesTable />
    </div>
  )
}