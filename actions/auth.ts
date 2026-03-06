"use server";

import { prisma } from "@/lib/prisma"; //
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";

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
