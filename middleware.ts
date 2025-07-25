import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { edgeConfig } from "@/services/auth.server/edge-config";

const middleware = NextAuth(edgeConfig).auth(async (req) => {
  if (
    !req.auth &&
    (req.nextUrl.pathname.startsWith("/app") ||
      req.nextUrl.pathname.match(/^\/api\/(?!auth|stripe).*/))
  ) {
    const signInUrl = new URL("/sign-in", req.url);

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export default middleware;
