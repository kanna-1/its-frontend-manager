import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth(async function middleware(request) {
  const secureCookie = process.env.NODE_ENV === "production";
  const cookieName = secureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
  const secret = process.env.AUTH_SECRET;
  const token = await getToken({
    req: request,
    secret: secret,
    secureCookie,
    salt: cookieName,
  });
  if (!token) return NextResponse.redirect(new URL("/signin", request.url));

  if (token) {
    switch (token.role) {
    case Role.ADMIN:
      if (!request.nextUrl.pathname.startsWith("/user-management")) {
        return NextResponse.redirect(
          new URL("/user-management", request.url)
        );
      }
      break;
    case Role.TEACHER:
      if (!request.nextUrl.pathname.startsWith("/courses")) {
        return NextResponse.redirect(new URL("/courses", request.url));
      }
      break;
    case Role.STUDENT:
      if (!request.nextUrl.pathname.startsWith("/courses")) {
        return NextResponse.redirect(new URL("/courses", request.url));
      }
      break;
    default:
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|signin|signup|forgot-password|new-password).*)",
  ],
};
