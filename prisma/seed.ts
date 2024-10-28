import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.NAME_ADMIN;
  const email = process.env.EMAIL_ADMIN;
  const adminPassword = process.env.PASSWORD_ADMIN;
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      email,
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  // console.log(adminRole);
}

main()
  .then(async () => {
    console.log('Admin user created or already exists.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });