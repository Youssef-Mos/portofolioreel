// src/app/admin/projets/page.tsx
import { ProjectsTable } from "@/components/admin/ProjectsTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos projets de portfolio
          </p>
        </div>
        
        <Link href="/admin/projets/nouveau">
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouveau projet</span>
          </Button>
        </Link>
      </div>

      {/* Projects Table */}
      <ProjectsTable />
    </div>
  )
}

