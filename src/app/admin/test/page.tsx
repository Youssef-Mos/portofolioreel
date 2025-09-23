import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SignOutButton } from "@/components/auth/SignOutButton"

export default async function AdminTestPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return <div className="p-6">Accès refusé</div>

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Espace admin — Test</h1>
      <p>Bienvenue {session.user.email}</p>
      <SignOutButton />
    </div>
  )
}
