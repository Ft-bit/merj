import { NextResponse } from 'next/server'
import { adminAuth } from '../../../../lib/firebaseAdmin'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
})

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  try {
    const link = await adminAuth.generatePasswordResetLink(email, {
      url: 'https://merj-seven.vercel.app/auth/action?type=reset',
    })

    await transporter.sendMail({
      from: `Merj <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Reset your Merj password',
      html: `<div style="font-family:sans-serif;background:#060606;color:#fff;padding:32px;border-radius:16px;max-width:420px;margin:0 auto;">
        <h2 style="color:#00e676;">Reset your password</h2>
        <p>Click the button below to choose a new password.</p>
        <a href="${link}" style="display:inline-block;margin-top:16px;padding:14px 28px;background:#00e676;color:#000;text-decoration:none;font-weight:700;border-radius:10px;">Reset password</a>
        <p style="color:#999;font-size:13px;margin-top:24px;">If you didn't request this, you can ignore this email.</p>
      </div>`,
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not send email' }, { status: 500 })
  }
}
