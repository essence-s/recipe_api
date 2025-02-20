import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.NAME_ADMIN;
  const email = process.env.EMAIL_ADMIN;
  const adminPassword = process.env.PASSWORD_ADMIN;
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminRole = await prisma.role.upsert({
    where: { identifier: 'superrole' },
    update: {},
    create: {
      name: 'admin',
      permission: permission,
      identifier: 'superrole',
    },
  });

  await prisma.user.upsert({
    where: { identifier: 'superuser' },
    update: {},
    create: {
      username,
      email,
      password: hashedPassword,
      roleId: adminRole.id,
      phone: '999999999',
      state: 'active',
      identifier: 'superuser',
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

const permission = [
  {
    name: 'recipe',
    permission: {
      view: true,
      create: true,
      delete: true,
      update: true,
    },
  },
  {
    name: 'pendingRecipe',
    permission: {
      view: true,
      create: true,
      delete: true,
      update: true,
      approve: true,
    },
  },
  {
    name: 'role',
    permission: {
      view: true,
      create: true,
      delete: true,
      update: true,
    },
  },
  {
    name: 'user',
    permission: {
      view: true,
      create: true,
      delete: true,
      update: true,
    },
  },
  {
    name: 'category',
    permission: {
      view: true,
      create: true,
      delete: true,
      update: true,
    },
  },
  {
    name: 'categoryGroup',
    permission: {
      view: true,
      create: true,
      delete: true,
      update: true,
    },
  },
];
