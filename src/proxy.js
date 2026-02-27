import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";
import cookie from "cookie";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Parse cookies
  const cookies = cookie.parse(request.headers.get("cookie") || "");
  const token = cookies.token;

  // Public API routes that don't require authentication
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  let user = null;
  if (token) {
    user = verifyToken(token);
  }

  // Helper to check if route is API
  const isApiRoute = pathname.startsWith("/api/");

  // Helper to create auth error response
  const authError = (message, status) => {
    if (isApiRoute) {
      return NextResponse.json({ error: message }, { status });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  };

  // Protect /admin routes and /api/admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // /admin/manage-featured and /api/admin/featured are accessible to moderators too
    const isModeratorRoute = 
      pathname === "/admin/manage-featured" || 
      pathname.startsWith("/admin/manage-featured/") ||
      pathname === "/api/admin/featured" ||
      pathname.startsWith("/api/admin/featured/");

    if (!user) {
      return authError("Unauthorized", 401);
    }

    if (isModeratorRoute) {
      // Moderators and admins can access
      if (user.role !== "admin" && user.role !== "moderator") {
        return isApiRoute
          ? NextResponse.json({ error: "Forbidden - Admin or Moderator access required" }, { status: 403 })
          : NextResponse.redirect(new URL("/u/dashboard", request.url));
      }
    } else {
      // Only admins for other admin routes
      if (user.role !== "admin") {
        return isApiRoute
          ? NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
          : NextResponse.redirect(new URL("/u/dashboard", request.url));
      }
    }

    return NextResponse.next();
  }

  // Protect /u routes - logged in users only
  if (pathname.startsWith("/u") || pathname.startsWith("/api/u")) {
    if (!user) {
      return authError("Unauthorized", 401);
    }

    return NextResponse.next();
  }

  // Protect /api/users/search - authenticated users only
  if (pathname === "/api/users/search" || pathname.startsWith("/api/users/search")) {
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Protect /api/upload - authenticated users only
  // Additional folder-based checks are done in the API route itself
  if (pathname === "/api/upload" || pathname.startsWith("/api/upload")) {
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // If trying to access login/signup while logged in, redirect based on role
  if ((pathname === "/login" || pathname === "/sign-up") && user) {
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/admin/create-user", request.url));
    } else if (user.role === "moderator") {
      return NextResponse.redirect(new URL("/admin/manage-featured", request.url));
    }
    return NextResponse.redirect(new URL("/u/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/u/:path*",
    "/login",
    "/sign-up",
    "/api/admin/:path*",
    "/api/u/:path*",
    "/api/auth/me",
    "/api/upload/:path*",
    "/api/users/search",
  ],
};
