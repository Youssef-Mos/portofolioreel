// src/app/api/admin/appointments/export/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { date: "desc" }
    })

    // Générer le CSV
    const headers = [
      "ID",
      "Date",
      "Créneau",
      "Nom",
      "Email",
      "Téléphone",
      "Message",
      "Statut",
      "Créé le",
      "Modifié le"
    ]
    
    const rows = appointments.map(apt => [
      apt.id,
      apt.date.toISOString().split("T")[0],
      apt.timeSlot,
      apt.name,
      apt.email,
      apt.phone || "",
      (apt.message || "").replace(/"/g, '""'), // Échapper les guillemets
      apt.status,
      apt.createdAt.toISOString(),
      apt.updatedAt.toISOString()
    ])

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const filename = `appointments-${new Date().toISOString().split("T")[0]}.csv`

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error("Erreur lors de l'export des appointments:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'export des appointments" },
      { status: 500 }
    )
  }
}