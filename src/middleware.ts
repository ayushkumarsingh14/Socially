import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|json)).*)",
    "/api/(.*)", // Protect API routes
    "/dashboard/(.*)", // Example: Protect dashboard routes
    "/profile/(.*)", // Protect user profiles
  ],
};
