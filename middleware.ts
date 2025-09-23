import { withAuth } from "next-auth/middleware"

export default withAuth({
callbacks: {
authorized: ({ token }) => {
// autorisé uniquement si connecté ET admin
return !!token && (token as any).isAdmin === true
},
},
})

export const config = { matcher: ["/admin/:path*"] }