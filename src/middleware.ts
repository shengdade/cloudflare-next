import { getSessionCookie } from "better-auth/cookies"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const callbackUrl = request.nextUrl.pathname
    const signinUrl = new URL("/auth/signin", request.url)
    signinUrl.searchParams.set("redirect", callbackUrl)

    return NextResponse.redirect(signinUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/chat"],
}
