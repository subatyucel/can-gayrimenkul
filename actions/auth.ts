"use server";

import { prisma } from "@/lib/prisma"; //
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Giriş bilgileri hatalı!" };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", user.id, { httpOnly: true, path: "/" });

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
