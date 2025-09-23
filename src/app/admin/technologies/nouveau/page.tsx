// src/app/admin/technologies/nouveau/page.tsx
import { TechnologyForm } from "@/components/admin/TechnologyForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewTechnologyPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/technologies">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouvelle technologie</h1>
            <p className="text-gray-600 mt-2">
              Ajoutez une nouvelle technologie ou compétence à votre portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <TechnologyForm />
      </div>
    </div>
  )
}