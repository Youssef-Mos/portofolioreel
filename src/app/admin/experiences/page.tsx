// src/app/admin/experiences/page.tsx
import { ExperiencesTable } from "@/components/admin/ExperiencesTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AdminExperiencesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expériences</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos expériences professionnelles
          </p>
        </div>
        
        <Link href="/admin/experiences/nouveau">
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouvelle expérience</span>
          </Button>
        </Link>
      </div>

      {/* Experiences Table */}
      <ExperiencesTable />
    </div>
  )
}