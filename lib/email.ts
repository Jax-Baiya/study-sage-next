import nodemailer from 'nodemailer'

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })

  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your email for StudySage',
    text: `Please click on the following link to verify your email: ${verificationUrl}`,
    html: `
      <p>Please click on the following link to verify your email:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    `,
  })
}

