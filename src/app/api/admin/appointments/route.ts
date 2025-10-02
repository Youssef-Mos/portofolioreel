// src/app/api/appointments/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendNewAppointmentNotification } from "@/lib/email"

// GET - Récupérer les créneaux disponibles (PUBLIC)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get("month") // Format: YYYY-MM
    const date = searchParams.get("date") // Format: YYYY-MM-DD

    if (date) {
      // Récupérer les rendez-vous pour une date spécifique
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const appointments = await prisma.appointment.findMany({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: {
            in: ["PENDING", "CONFIRMED"]
          }
        },
        select: {
          timeSlot: true,
        }
      })

      return NextResponse.json({ 
        bookedSlots: appointments.map(a => a.timeSlot)
      })
    }

    if (month) {
      // Récupérer tous les rendez-vous du mois
      const [year, monthNum] = month.split("-")
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59)

      const appointments = await prisma.appointment.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            in: ["PENDING", "CONFIRMED"]
          }
        },
        select: {
          date: true,
          timeSlot: true,
        }
      })

      // Grouper par date
      const bookedDates: { [key: string]: string[] } = {}
      appointments.forEach(apt => {
        const dateKey = apt.date.toISOString().split("T")[0]
        if (!bookedDates[dateKey]) {
          bookedDates[dateKey] = []
        }
        bookedDates[dateKey].push(apt.timeSlot)
      })

      return NextResponse.json({ bookedDates })
    }

    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Erreur lors de la récupération des appointments:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des appointments" },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau rendez-vous (PUBLIC)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, timeSlot, name, email, phone, message } = body

    // Validation
    if (!date || !timeSlot || !name || !email) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      )
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      )
    }

    // Vérifier si le créneau est déjà pris
    const appointmentDate = new Date(date)
    
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: appointmentDate,
        timeSlot,
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: "Ce créneau est déjà réservé" },
        { status: 409 }
      )
    }

    // Vérifier si la date n'est pas dans le passé
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    if (appointmentDate < now) {
      return NextResponse.json(
        { error: "Impossible de réserver une date passée" },
        { status: 400 }
      )
    }

    // Créer le rendez-vous
    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        timeSlot,
        name,
        email,
        phone: phone || null,
        message: message || null,
        status: "PENDING"
      }
    })

    // Envoyer une notification à l'admin
    await sendNewAppointmentNotification(appointment)
    console.log("Notification admin envoyée pour le nouveau RDV")

    return NextResponse.json({ 
      success: true, 
      appointment 
    }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'appointment:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de l'appointment" },
      { status: 500 }
    )
  }
}