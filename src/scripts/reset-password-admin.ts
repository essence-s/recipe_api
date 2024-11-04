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
    update: { permission: permission },
    create: {
      name: 'admin',
      permission: permission,
    },
  });

  await prisma.user.upsert({
    where: { username },
    update: {
      password: hashedPassword,
    },
    create: {
      username,
      email,
      password: hashedPassword,
      roleId: adminRole.id,
      phone: '999999999',
      state: 'active',
    },
  });

  // console.log(adminRole);
}

main()
  .then(async () => {
    console.log('Admin user created or reset password');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const permission = [
  {
    name: 'recipe',
    permission: {
      create: true,
      delete: true,
      find: true,
      update: true,
    },
  },
  {
    name: 'recipe-pending',
    permission: {
      create: true,
      delete: true,
      find: true,
      update: true,
    },
  },
  {
    name: 'role',
    permission: {
      create: true,
      delete: true,
      find: true,
      update: true,
    },
  },
  {
    name: 'users',
    permission: {
      create: true,
      delete: true,
      find: true,
      update: true,
    },
  },
  {
    name: 'category',
    permission: {
      create: true,
      delete: true,
      find: true,
      update: true,
    },
  },
  {
    name: 'category-group',
    permission: {
      create: true,
      delete: true,
      find: true,
      update: true,
    },
  },
];
