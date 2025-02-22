import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role ? String(token.role).toLowerCase() : undefined;

    // Allow access to login page when not authenticated
    if (path.startsWith('/auth/login') && !token) {
      return NextResponse.next();
    }

    // Redirect authenticated users away from login
    if (path.startsWith('/auth/login') && token) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
    }

    // Handle role-based routes
    if (path === '/dashboard/admin' && role !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
    }
    if (path === '/dashboard/teacher' && role !== 'teacher') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
    }
    if (path === '/dashboard/student' && role !== 'student') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Always allow access to auth pages
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true;
        }
        // Require auth for dashboard
        return !!token;
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/admin",
    "/dashboard/teacher",
    "/dashboard/student",
    "/auth/login"
  ]
};