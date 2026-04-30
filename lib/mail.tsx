import nodemailer from 'nodemailer';
import { render } from 'react-email';
import ResetPasswordMail from '@/components/emails/ResetPassword';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendResetPasswordMail(
  email: string,
  token: string,
  fullName: string,
) {
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/sifremi-unuttum?t=${token}`;
  const html = await render(
    <ResetPasswordMail fullName={fullName} resetLink={resetLink} />,
  );

  return transporter.sendMail({
    from: `"Can Gayrimenkul" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Şifre Sıfırlama',
    html,
  });
}

export async function sendOtpMail(email: string, type: string, otp: string) {
  const html = `<h1>Şifre sıfırlama kodunuz: ${otp}</h1>`;

  return transporter.sendMail({
    from: `"Can Gayrimenkul <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'OTP',
    html,
  });
}
