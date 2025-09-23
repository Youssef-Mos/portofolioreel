/* eslint-disable */
const { PrismaClient } = require("../src/generated/prisma")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
if (!email || !password) {
console.error("❌ ADMIN_EMAIL et ADMIN_PASSWORD manquants dans .env")
process.exit(1)
}
const passwordHash = await bcrypt.hash(password, 12)
await prisma.user.upsert({
where: { email },
update: { passwordHash, isAdmin: true, name: "Admin" },
create: { email, passwordHash, isAdmin: true, name: "Admin" },
})
console.log("✅ Admin prêt:", email)
}

main().catch(console.error).finally(() => prisma.$disconnect())