import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  console.log('🔍 Test de configuration email');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Défini' : '❌ Manquant');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.verify();
    console.log('✅ Connexion SMTP réussie');

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test email',
      text: 'Si tu reçois ceci, ça marche !',
    });

    console.log('✅ Email envoyé:', info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}