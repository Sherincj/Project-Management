import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export default async function Middleware(req) {
  const token = cookies().get("access_token")?.value;
  const currentPath = req.nextUrl.pathname;

  console.log("Current path:", currentPath);
  console.log("Token present:", !!token);

  try {
    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/signup"];

    if (!token) {
      // User is not authenticated
      if (!publicRoutes.includes(currentPath)) {
        // Redirect to login for all non-public routes
        console.log("Redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else {
      // User is authenticated
      if (publicRoutes.includes(currentPath)) {
        // Redirect authenticated users to dashboard if they try to access login or signup
        console.log("Redirecting authenticated user to dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Allow access to the requested route
    console.log("Proceeding to requested route");
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};