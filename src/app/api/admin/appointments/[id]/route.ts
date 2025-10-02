// src/app/api/admin/appointments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"
import { sendConfirmationEmail, sendCancellationEmail } from "@/lib/email"

// GET - Récupérer un rendez-vous spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: "Rendez-vous non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: appointment.id,
      date: appointment.date.toISOString(),
      timeSlot: appointment.timeSlot,
      name: appointment.name,
      email: appointment.email,
      phone: appointment.phone,
      message: appointment.message,
      status: appointment.status,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'appointment:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'appointment" },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour le statut d'un rendez-vous
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    const body = await request.json()
    const { status, date, timeSlot, name, email, phone, message } = body

    // Validation du statut si fourni
    if (status && !["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      )
    }

    // Préparer les données à mettre à jour
    const updateData: any = {}
    
    if (status) updateData.status = status
    if (date) updateData.date = new Date(date)
    if (timeSlot) updateData.timeSlot = timeSlot
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (phone !== undefined) updateData.phone = phone || null
    if (message !== undefined) updateData.message = message || null

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: updateData
    })

    // Envoyer les emails de notification
    if (status === "CONFIRMED") {
      await sendConfirmationEmail(appointment)
      console.log("Email de confirmation envoyé à", appointment.email)
    } else if (status === "CANCELLED") {
      await sendCancellationEmail(appointment)
      console.log("Email d'annulation envoyé à", appointment.email)
    }

    return NextResponse.json({ 
      success: true, 
      appointment: {
        id: appointment.id,
        date: appointment.date.toISOString(),
        timeSlot: appointment.timeSlot,
        name: appointment.name,
        email: appointment.email,
        phone: appointment.phone,
        message: appointment.message,
        status: appointment.status,
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
      }
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'appointment:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'appointment" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un rendez-vous
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    await prisma.appointment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true,
      message: "Rendez-vous supprimé avec succès"
    })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'appointment:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'appointment" },
      { status: 500 }
    )
  }
}