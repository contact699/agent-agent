import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect to appropriate dashboard based on role
    if (path === "/dashboard") {
      if (token?.role === "AGENT") {
        return NextResponse.redirect(new URL("/dashboard/agent", req.url));
      } else if (token?.role === "BROKERAGE") {
        return NextResponse.redirect(new URL("/dashboard/brokerage", req.url));
      }
    }

    // Protect agent routes
    if (path.startsWith("/dashboard/agent") && token?.role !== "AGENT") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Protect brokerage routes
    if (path.startsWith("/dashboard/brokerage") && token?.role !== "BROKERAGE") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Protect onboarding routes
    if (path.startsWith("/onboarding/agent") && token?.role !== "AGENT") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/onboarding/brokerage") && token?.role !== "BROKERAGE") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public routes
        if (
          path === "/" ||
          path.startsWith("/auth") ||
          path.startsWith("/api/auth") ||
          path.startsWith("/api/stripe/webhook")
        ) {
          return true;
        }

        // Protected routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/api/agent/:path*",
    "/api/brokerage/:path*",
    "/api/pitches/:path*",
  ],
};
