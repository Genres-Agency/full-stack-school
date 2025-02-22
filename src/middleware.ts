import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth/login");
    const isAuthenticated = !!req.nextauth?.token;

    // Redirect authenticated users away from login
    if (isOnAuthPage && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow public access to auth pages
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true;
        }
        // Require auth for dashboard
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"],
};
