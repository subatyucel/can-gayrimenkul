import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export default async function proxy(request: NextRequest) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const session = request.cookies.get("admin_session");
  const isLoginPage = request.nextUrl.pathname === "/admin/giris-yap";
  const isRegisterPage =
    request.nextUrl.pathname.startsWith("/admin/kayit-ol/");
  const isPasswordResetPage = request.nextUrl.pathname.startsWith(
    "/admin/sifremi-unuttum",
  );

  console.log(request.nextUrl.pathname);

  if (isLoginPage || isRegisterPage || isPasswordResetPage) {
    if (session?.value) {
      try {
        await jwtVerify(session.value, secret);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!session || !session.value) {
    return NextResponse.redirect(new URL("/admin/giris-yap", request.url));
  }

  try {
    await jwtVerify(session.value, secret);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(
      new URL("/admin/giris-yap", request.url),
    );
    response.cookies.set("admin_session", "", { path: "/", maxAge: 0 });
    return response;
  }
}

export const config = {
  matcher: ["/admin/(.*)", "/admin"],
};
