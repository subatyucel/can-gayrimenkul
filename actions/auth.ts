"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import nodemailer from "nodemailer";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Giriş bilgileri hatalı!" };
  }

  const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("5d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 5, //5 days
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.set("admin_session", "", {
    path: "/",
    maxAge: 0,
  });

  redirect("/admin/login");
}

export async function registerWithInvite(formData: FormData) {
  const token = formData.get("token") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token || !fullName || !email || !password || !confirmPassword) {
    return { error: "Tüm alanları doldurun!" };
  }

  if (password.length < 6) {
    return { error: "Şifre en az 6 karakter olmalıdır!" };
  }

  if (password !== confirmPassword) {
    return { error: "Şifreler eşleşmiyor!" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Geçerli bir e-posta adresi girin!" };
  }

  try {
    await jwtVerify(token, SECRET);
  } catch {
    return { error: "Davet linki geçersiz veya süresi dolmuş!" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Bu e-posta adresi zaten kullanılıyor!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.create({
      data: { fullName, email, password: hashedPassword, role: "admin" },
    }),
  ]);

  redirect("/admin/giris-yap");
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "E-posta adresi gerekli!" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      success: "Eğer bu e-posta kayıtlıysa, şifre sıfırlama linki gönderildi.",
    };
  }

  const token = await new SignJWT({ purpose: "password-reset", email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30m")
    .sign(SECRET);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/admin/sifremi-unuttum/${token}`;

  await transporter.sendMail({
    from: `"Can Gayrimenkul" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Şifre Sıfırlama",
    html: `
    <h2>Şifre Sıfırlama</h2>
    <p>Merhaba ${user.fullName},</p>
    <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın. Bu link 30 dakika geçerlidir.</p>
    <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">Şifremi Sıfırla</a>
    <p style="color:#666;font-size:13px;">Bu işlemi siz yapmadıysanız bu e-postayı görmezden gelin.</p>
  `,
  });

  return {
    success: "Eğer bu e-posta kayıtlıysa, şifre sıfırlama linki gönderildi.",
  };
}

export async function resetPasswordWithToken(formData: FormData) {
  const token = formData.get("token") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token || !newPassword || !confirmPassword) {
    return { error: "Tüm alanları doldurun!" };
  }

  if (newPassword.length < 6) {
    return { error: "Şifre en az 6 karakter olmalıdır!" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Şifreler eşleşmiyor!" };
  }

  let email: string;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.purpose !== "password-reset") {
      return { error: "Geçersiz link!" };
    }
    email = payload.email as string;
  } catch {
    return { error: "Şifre sıfırlama linki geçersiz veya süresi dolmuş!" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Kullanıcı bulunamadı!" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  redirect("/admin/giris-yap?reset=success");
}
