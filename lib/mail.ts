import nodemailer from 'nodemailer';

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
  userName: string,
) {
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/sifremi-unuttum?t=${token}`;

  return transporter.sendMail({
    from: `"Can Gayrimenkul" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Şifre Sıfırlama',
    html: `
    <h2>Şifre Sıfırlama</h2>
    <p>Merhaba ${userName},</p>
    <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın veya bağlantıyı kopyalayın. Bu bağlantı 30 dakika geçerlidir.</p>
    <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">Şifremi Sıfırla</a>
    <a href="${resetLink}">${resetLink}</a>
    <p style="color:#666;font-size:13px;">Bu işlemi siz yapmadıysanız bu e-postayı görmezden gelin.</p>
  `,
  });
}
