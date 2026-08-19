import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
// Protects every dashboard route: requires a session, and additionally
// requires role === "ADMIN" for /admin/*. Public routes (/, /login,
// /register) and the /api/auth/* handler are left untouched.
export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.role;
    const isProtected = pathname.startsWith("/dashboard") ||
        pathname.startsWith("/items") ||
        pathname.startsWith("/my-items") ||
        pathname.startsWith("/requests") ||
        pathname.startsWith("/notifications") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/admin");
    if (isProtected && !isLoggedIn) {
        const loginUrl = new URL("/login", req.nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
    return NextResponse.next();
});
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/items/:path*",
        "/my-items/:path*",
        "/requests/:path*",
        "/notifications/:path*",
        "/profile/:path*",
        "/admin/:path*",
    ],
};
