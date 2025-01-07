import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { edgeConfig } from "@/services/auth/edge-config";

const middleware = NextAuth(edgeConfig).auth(async (req) => {
  if (
    !req.auth &&
    (req.nextUrl.pathname.startsWith("/app") ||
      req.nextUrl.pathname.match(/^\/api\/(?!auth|stripe).*/))
  ) {
    const loginUrl = new URL("/sign-in", req.url);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export default middleware;
