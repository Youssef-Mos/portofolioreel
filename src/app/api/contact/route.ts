// app/api/contact/route.ts
// 🔧 SOLUTION AVEC NODEMAILER (Alternative Gmail)
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

// Labels pour les sujets
const subjectLabels: Record<string, string> = {
  stage: '🎓 Proposition de stage',
  freelance: '💼 Mission freelance/prestataire',
  emploi: '🏢 Opportunité d\'emploi',
  collaboration: '🤝 Collaboration sur un projet',
  conseil: '💡 Demande de conseil technique',
  formation: '📚 Cours particuliers',
  autre: '🔍 Autre demande'
};

// Configuration du transporteur email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Template HTML élégant pour l'email
const createEmailTemplate = (data: ContactFormData) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                📬 Nouveau Message de Contact
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                Message reçu depuis votre portfolio
              </p>
            </td>
          </tr>

          <!-- Badge du thème -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <div style="background: linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%); border-radius: 12px; padding: 16px; text-align: center;">
                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1e40af;">
                  ${subjectLabels[data.subject] || data.subject}
                </p>
              </div>
            </td>
          </tr>

          <!-- Informations de l'expéditeur -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 140px; vertical-align: top;">
                          <span style="font-weight: 600; color: #6b7280; font-size: 14px;">👤 Nom</span>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #111827; font-size: 15px; font-weight: 500;">${data.name}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 140px; vertical-align: top;">
                          <span style="font-weight: 600; color: #6b7280; font-size: 14px;">📧 Email</span>
                        </td>
                        <td style="vertical-align: top;">
                          <a href="mailto:${data.email}" style="color: #2563eb; font-size: 15px; text-decoration: none; font-weight: 500;">
                            ${data.email}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${data.company ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 140px; vertical-align: top;">
                          <span style="font-weight: 600; color: #6b7280; font-size: 14px;">🏢 Entreprise</span>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #111827; font-size: 15px; font-weight: 500;">${data.company}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}

                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 140px; vertical-align: top;">
                          <span style="font-weight: 600; color: #6b7280; font-size: 14px;">🕐 Date</span>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #111827; font-size: 15px;">
                            ${new Date().toLocaleDateString('fr-FR', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #f9fafb; border-left: 4px solid #2563eb; border-radius: 8px; padding: 20px;">
                <p style="margin: 0 0 8px 0; font-weight: 600; color: #374151; font-size: 15px;">
                  💬 Message :
                </p>
                <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
${data.message}
                </p>
              </div>
            </td>
          </tr>

          <!-- Bouton de réponse -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <a href="mailto:${data.email}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px;">
                ↩️ Répondre à ${data.name}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                Message envoyé depuis votre portfolio
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} - Tous droits réservés
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Validation des données
const validateContactData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('L\'email est requis');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Format d\'email invalide');
  }

  if (!data.subject || typeof data.subject !== 'string') {
    errors.push('Le thème est requis');
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Le message doit contenir au moins 10 caractères');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    console.log('📨 Nouvelle demande de contact:', {
      name: body.name,
      email: body.email,
      subject: body.subject
    });

    // Validation
    const validation = validateContactData(body);
    if (!validation.valid) {
      console.error('❌ Validation échouée:', validation.errors);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données invalides', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Vérification de la configuration email
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ Configuration email manquante');
      console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Défini' : '❌ Manquant');
      console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Défini' : '❌ Manquant');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuration email manquante. Vérifiez EMAIL_USER et EMAIL_PASSWORD dans .env.local' 
        },
        { status: 500 }
      );
    }

    console.log('✅ Configuration email OK');
    console.log('📧 Envoi depuis:', process.env.EMAIL_USER);
    console.log('📧 Envoi vers:', process.env.EMAIL_USER);

    // Créer le transporteur
    const transporter = createTransporter();

    // Vérifier la connexion
    console.log('🔌 Vérification de la connexion SMTP...');
    try {
      await transporter.verify();
      console.log('✅ Connexion SMTP OK');
    } catch (verifyError) {
      console.error('❌ Erreur de connexion SMTP:', verifyError);
      if (verifyError instanceof Error) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Erreur de connexion Gmail. Vérifiez votre mot de passe d\'application.',
            details: verifyError.message 
          },
          { status: 500 }
        );
      }
      throw verifyError;
    }

    // Envoi de l'email
    console.log('📤 Envoi de l\'email...');
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: body.email,
      subject: `📬 Nouveau contact : ${body.name} - ${subjectLabels[body.subject] || body.subject}`,
      html: createEmailTemplate(body),
    });

    console.log('✅ Email envoyé avec succès!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📊 Response:', info.response);

    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ ERREUR SERVEUR:', error);
    
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

/* 
═══════════════════════════════════════════════════════════
CONFIGURATION REQUISE dans .env.local :
═══════════════════════════════════════════════════════════

EMAIL_USER=youssefmosbah04@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx

═══════════════════════════════════════════════════════════
OBTENIR UN MOT DE PASSE D'APPLICATION GMAIL :
═══════════════════════════════════════════════════════════

1. Va sur https://myaccount.google.com/security
2. Active "Validation en deux étapes" si ce n'est pas déjà fait
3. Cherche "Mots de passe des applications" (en bas de la page)
4. Sélectionne "Mail" + "Autre (nom personnalisé)"
5. Entre "Portfolio" comme nom
6. Copie le mot de passe de 16 caractères généré
7. Colle-le dans EMAIL_PASSWORD (avec ou sans espaces)

═══════════════════════════════════════════════════════════
*/