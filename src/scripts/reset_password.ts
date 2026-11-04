import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'asdf@hotmail.com'
  const newPassword = 'Evseren2026!'
  
  console.log(`Updating password for ${email}...`)
  
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  const user = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  })
  
  console.log('Password successfully updated for:', user.email)
  
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
