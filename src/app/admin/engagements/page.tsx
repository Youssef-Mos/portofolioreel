// src/app/admin/engagements/page.tsx
import { EngagementsTable } from "@/components/admin/EngagementsTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AdminEngagementsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Engagements</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos engagements associatifs et bénévoles
          </p>
        </div>
        
        <Link href="/admin/engagements/nouveau">
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouvel engagement</span>
          </Button>
        </Link>
      </div>

      {/* Engagements Table */}
      <EngagementsTable />
    </div>
  )
}