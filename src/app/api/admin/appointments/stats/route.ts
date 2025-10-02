// src/app/api/admin/appointments/stats/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    const [total, pending, confirmed, cancelled, completed] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.appointment.count({ where: { status: "CONFIRMED" } }),
      prisma.appointment.count({ where: { status: "CANCELLED" } }),
      prisma.appointment.count({ where: { status: "COMPLETED" } }),
    ])

    // Stats du mois en cours
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const thisMonth = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    // Prochains rendez-vous
    const upcoming = await prisma.appointment.count({
      where: {
        date: {
          gte: new Date()
        },
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      }
    })

    return NextResponse.json({
      total,
      pending,
      confirmed,
      cancelled,
      completed,
      thisMonth,
      upcoming
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des stats" },
      { status: 500 }
    )
  }
}

