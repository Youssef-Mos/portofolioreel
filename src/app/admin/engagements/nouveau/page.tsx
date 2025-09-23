// src/app/admin/engagements/nouveau/page.tsx
import { EngagementForm } from "@/components/admin/EngagementForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewEngagementPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/engagements">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouvel engagement</h1>
            <p className="text-gray-600 mt-2">
              Ajoutez un engagement associatif ou bénévole à votre portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <EngagementForm />
      </div>
    </div>
  )
}