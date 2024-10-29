export interface ActiveUserInterface {
  username: string;
  role: string;
}

interface Permission {
  name: string;
  permission: {
    create?: boolean;
    delete?: boolean;
    update?: boolean;
    find?: boolean;
  };
}

// auth       String @default("{create:false,delete:false,update:false,find:false}")
// role       String @default("{create:false,delete:false,update:false,find:false}")
// users      String @default("{create:false,delete:false,update:false,find:false}")
// recipe     String @default("{create:false,delete:false,update:false,find:false}")
// ingredient String @default("{create:false,delete:false,update:false,find:false}")
// category   String @default("{create:false,delete:false,update:false,find:false}")
// search     String @default("{find:true}")

const Permissions: Permission[] = [
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
