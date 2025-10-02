// src/lib/email.ts
import nodemailer from "nodemailer"

interface Appointment {
  id: string
  date: Date
  timeSlot: string
  name: string
  email: string
  phone?: string | null
  message?: string | null
  status: string
}

// Configuration du transporteur Gmail (simple et direct)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

// Email de confirmation de rendez-vous
export async function sendConfirmationEmail(appointment: Appointment) {
  try {
    const formattedDate = new Date(appointment.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    })

    const transporter = createTransporter()

    const mailOptions = {
      from: `"Portfolio - Youssef Mosbah" <${process.env.EMAIL_USER}>`,
      to: appointment.email,
      cc: process.env.EMAIL_USER, // Vous en copie
      subject: `✅ Rendez-vous confirmé - ${formattedDate}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation de rendez-vous</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                          ✅ Rendez-vous confirmé
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                          Bonjour <strong>${appointment.name}</strong>,
                        </p>
                        
                        <p style="margin: 0 0 30px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                          Votre rendez-vous a été <strong style="color: #16a34a;">confirmé avec succès</strong> ! Je me réjouis de notre échange.
                        </p>
                        
                        <!-- Détails du rendez-vous -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eff6ff; border-radius: 12px; border: 2px solid #bfdbfe; margin-bottom: 30px;">
                          <tr>
                            <td style="padding: 24px;">
                              <h2 style="margin: 0 0 16px 0; color: #1e40af; font-size: 18px; font-weight: 600;">
                                📅 Détails du rendez-vous
                              </h2>
                              
                              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 15px;">
                                    <strong>Date :</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 15px; text-align: right;">
                                    ${formattedDate}
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 15px;">
                                    <strong>Heure :</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 15px; text-align: right;">
                                    ${appointment.timeSlot}
                                  </td>
                                </tr>
                                ${appointment.phone ? `
                                <tr>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 15px;">
                                    <strong>Téléphone :</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 15px; text-align: right;">
                                    ${appointment.phone}
                                  </td>
                                </tr>
                                ` : ""}
                                ${appointment.message ? `
                                <tr>
                                  <td colspan="2" style="padding: 16px 0 8px 0; color: #1f2937; font-size: 15px;">
                                    <strong>Sujet :</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2" style="padding: 0; color: #4b5563; font-size: 14px; font-style: italic;">
                                    "${appointment.message}"
                                  </td>
                                </tr>
                                ` : ""}
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Instructions -->
                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
                          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                            <strong>💡 Important :</strong> Si vous avez besoin de modifier ou d'annuler ce rendez-vous, merci de me contacter au moins 24h à l'avance à l'adresse <a href="mailto:youssefmosbah04@gmail.com" style="color: #2563eb; text-decoration: none;">youssefmosbah04@gmail.com</a>
                          </p>
                        </div>
                        
                        <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                          À très bientôt !
                        </p>
                        
                        <p style="margin: 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                          Cordialement,<br>
                          <strong>Youssef Mosbah</strong>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
                          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                        </p>
                        <p style="margin: 0; color: #6b7280; font-size: 13px;">
                          © ${new Date().getFullYear()} Youssef Mosbah - Tous droits réservés
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email de confirmation envoyé:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation:", error)
    return { success: false, error }
  }
}

// Email d'annulation de rendez-vous
export async function sendCancellationEmail(appointment: Appointment) {
  try {
    const formattedDate = new Date(appointment.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    })

    const transporter = createTransporter()

    const mailOptions = {
      from: `"Portfolio - Youssef Mosbah" <${process.env.EMAIL_USER}>`,
      to: appointment.email,
      cc: process.env.EMAIL_USER, // Vous en copie
      subject: `❌ Rendez-vous annulé - ${formattedDate}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Annulation de rendez-vous</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                          ❌ Rendez-vous annulé
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                          Bonjour <strong>${appointment.name}</strong>,
                        </p>
                        
                        <p style="margin: 0 0 30px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                          Je vous informe que votre rendez-vous a été <strong style="color: #dc2626;">annulé</strong>.
                        </p>
                        
                        <!-- Détails du rendez-vous annulé -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef2f2; border-radius: 12px; border: 2px solid #fecaca; margin-bottom: 30px;">
                          <tr>
                            <td style="padding: 24px;">
                              <h2 style="margin: 0 0 16px 0; color: #991b1b; font-size: 18px; font-weight: 600;">
                                📅 Rendez-vous annulé
                              </h2>
                              
                              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 15px;">
                                    <strong>Date :</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 15px; text-align: right;">
                                    ${formattedDate}
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 15px;">
                                    <strong>Heure :</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1f2937; font-size: 15px; text-align: right;">
                                    ${appointment.timeSlot}
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- CTA pour reprendre RDV -->
                        <div style="text-align: center; margin-bottom: 30px;">
                          <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/schedule" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            📅 Reprendre un rendez-vous
                          </a>
                        </div>
                        
                        <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                          Si vous souhaitez planifier un nouveau rendez-vous ou si vous avez des questions, n'hésitez pas à me contacter.
                        </p>
                        
                        <p style="margin: 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                          Cordialement,<br>
                          <strong>Youssef Mosbah</strong><br>
                          <a href="mailto:youssefmosbah04@gmail.com" style="color: #2563eb; text-decoration: none;">youssefmosbah04@gmail.com</a>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
                          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                        </p>
                        <p style="margin: 0; color: #6b7280; font-size: 13px;">
                          © ${new Date().getFullYear()} Youssef Mosbah - Tous droits réservés
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email d'annulation envoyé:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email d'annulation:", error)
    return { success: false, error }
  }
}

// Email de notification pour les nouveaux rendez-vous (pour l'admin)
export async function sendNewAppointmentNotification(appointment: Appointment) {
  try {
    const formattedDate = new Date(appointment.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    })

    const transporter = createTransporter()

    const mailOptions = {
      from: `"Portfolio - Youssef Mosbah" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // À vous-même
      subject: `🔔 Nouveau rendez-vous - ${appointment.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Nouveau rendez-vous</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
              <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                🔔 Nouveau rendez-vous en attente
              </h2>
              
              <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h3>Informations du client :</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="padding: 8px 0;"><strong>Nom :</strong> ${appointment.name}</li>
                  <li style="padding: 8px 0;"><strong>Email :</strong> <a href="mailto:${appointment.email}">${appointment.email}</a></li>
                  ${appointment.phone ? `<li style="padding: 8px 0;"><strong>Téléphone :</strong> <a href="tel:${appointment.phone}">${appointment.phone}</a></li>` : ""}
                  <li style="padding: 8px 0;"><strong>Date :</strong> ${formattedDate}</li>
                  <li style="padding: 8px 0;"><strong>Heure :</strong> ${appointment.timeSlot}</li>
                  ${appointment.message ? `<li style="padding: 8px 0;"><strong>Message :</strong><br><em>${appointment.message}</em></li>` : ""}
                </ul>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/appointments" 
                     style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Gérer les rendez-vous
                  </a>
                </div>
              </div>
            </div>
          </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Notification admin envoyée:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification admin:", error)
    return { success: false, error }
  }
}

/* 
═══════════════════════════════════════════════════════════
CONFIGURATION REQUISE dans .env :
═══════════════════════════════════════════════════════════

EMAIL_USER=youssefmosbah04@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
NEXT_PUBLIC_URL=http://localhost:3000

═══════════════════════════════════════════════════════════
OBTENIR UN MOT DE PASSE D'APPLICATION GMAIL :
═══════════════════════════════════════════════════════════

1. Va sur https://myaccount.google.com/security
2. Active "Validation en deux étapes" si ce n'est pas déjà fait
3. Cherche "Mots de passe des applications"
4. Sélectionne "Mail" + "Autre (nom personnalisé)"
5. Entre "Portfolio" comme nom
6. Copie le mot de passe de 16 caractères généré
7. Colle-le dans EMAIL_PASSWORD (avec ou sans espaces)

═══════════════════════════════════════════════════════════
*/