"use server";

import { prisma } from "@/lib/prisma"; //
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

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
      data: { fullName, email, password: hashedPassword },
    }),
  ]);

  redirect("/admin/giris-yap");
}
