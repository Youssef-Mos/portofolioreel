import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
adapter: PrismaAdapter(prisma),
session: { strategy: "jwt" },
pages: { signIn: "/login" },
providers: [
CredentialsProvider({
name: "Credentials",
credentials: {
email: { label: "Email", type: "text" },
password: { label: "Password", type: "password" },
},
async authorize(credentials) {
if (!credentials?.email || !credentials?.password) return null
const user = await prisma.user.findUnique({ where: { email: credentials.email } })
if (!user?.passwordHash) return null
if (!user.isAdmin) return null // 🔒 refuse non-admin
const ok = await bcrypt.compare(credentials.password, user.passwordHash)
if (!ok) return null
return { id: user.id, name: user.name, email: user.email, image: user.image, isAdmin: user.isAdmin }
},
}),
],
callbacks: {
async jwt({ token, user }) {
if (user) {
token.isAdmin = (user as any).isAdmin ?? false
token.id = (user as any).id
}
return token
},
async session({ session, token }) {
if (session.user) {
session.user.id = token.id as string
session.user.isAdmin = token.isAdmin === true
}
return session
},
},
secret: process.env.NEXTAUTH_SECRET,
}