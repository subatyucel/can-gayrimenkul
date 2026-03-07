"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, fullName: true, role: true },
  });
}

export async function changePassword(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Oturum bulunamadı!" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Tüm alanları doldurun!" };
  }

  if (newPassword.length < 6) {
    return { error: "Yeni şifre en az 6 karakter olmalıdır!" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Yeni şifreler eşleşmiyor!" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "Kullanıcı bulunamadı!" };

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return { error: "Mevcut şifre hatalı!" };

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { success: "Şifre başarıyla değiştirildi!" };
}

export async function changeEmail(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Oturum bulunamadı!" };

  const newEmail = formData.get("newEmail") as string;
  const password = formData.get("password") as string;

  if (!newEmail || !password) {
    return { error: "Tüm alanları doldurun!" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    return { error: "Geçerli bir e-posta adresi girin!" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "Kullanıcı bulunamadı!" };

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return { error: "Şifre hatalı!" };

  const existing = await prisma.user.findUnique({ where: { email: newEmail } });
  if (existing) return { error: "Bu e-posta adresi zaten kullanılıyor!" };

  await prisma.user.update({
    where: { id: userId },
    data: { email: newEmail },
  });

  return { success: "E-posta başarıyla değiştirildi!" };
}

export async function createInvitation() {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Oturum bulunamadı!" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "owner") {
    return {
      error: "Bu işlemi yalnızca Owner yetkisine sahip kullanıcılar yapabilir!",
    };
  }

  const token = await new SignJWT({ purpose: "invite" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(SECRET);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const inviteLink = `${baseUrl}/admin/kayit-ol/${token}`;

  return { success: true, link: inviteLink };
}
