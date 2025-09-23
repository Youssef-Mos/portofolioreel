import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function requireAdmin() {
const session = await getServerSession(authOptions)
if (!session?.user?.isAdmin) {
return { ok: false as const, error: new Response("Forbidden", { status: 403 }) }
}
return { ok: true as const }
}