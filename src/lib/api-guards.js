import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
export function jsonError(message, status = 400) {
    return NextResponse.json({ error: message }, { status });
}
export function jsonOk(data, status = 200) {
    return NextResponse.json(data, { status });
}
/**
 * Requires a signed-in user. Returns the session or a 401 response.
 */
export async function requireUser() {
    const session = await auth();
    if (!session?.user) {
        return { session: null, error: jsonError("Unauthorized", 401) };
    }
    return { session, error: null };
}
/**
 * Requires a signed-in ADMIN. Returns the session or a 401/403 response.
 * Only Admin can manage all users, all items, categories, and system settings.
 */
export async function requireAdmin() {
    const session = await auth();
    if (!session?.user) {
        return { session: null, error: jsonError("Unauthorized", 401) };
    }
    if (session.user.role !== "ADMIN") {
        return { session: null, error: jsonError("Forbidden — admin only", 403) };
    }
    return { session, error: null };
}
