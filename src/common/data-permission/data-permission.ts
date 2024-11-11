enum TYPE_REQUEST {
  VIEW = 'find',
  UPDATE = 'update',
  DELETE = 'delete',
  CREATE = 'create',
}

export const dataPermission = {
  users: {
    name: 'users',
    functions: {
      create: { typePermission: TYPE_REQUEST.CREATE },
      findAll: { typePermission: TYPE_REQUEST.VIEW },
      findOne: { typePermission: TYPE_REQUEST.VIEW },
      update: { typePermission: TYPE_REQUEST.UPDATE },
      remove: {
        typePermission: TYPE_REQUEST.DELETE,
        requiredPermissions: [
          {
            name: 'recipe',
            permission: TYPE_REQUEST.DELETE,
          },
        ],
      },
      removeMany: '',
    },
  },
  role: {
    name: 'role',
    functions: {
      create: { name: 'role', typePermission: TYPE_REQUEST.CREATE },
      findAll: { name: 'role', typePermission: TYPE_REQUEST.VIEW },
      findOne: { name: 'role', typePermission: TYPE_REQUEST.VIEW },
      update: { name: 'role', typePermission: TYPE_REQUEST.UPDATE },
      remove: {
        name: 'role',
        typePermission: TYPE_REQUEST.DELETE,
        verificationPermissions: [
          {
            name: 'user',
            checkRelation: 'roleId',
            permission: TYPE_REQUEST.DELETE,
          },
          {
            name: 'recipe',
            checkRelation: 'authorId',
            permission: TYPE_REQUEST.DELETE,
          },
          // {
          //   name: 'recipeCategory',
          //   checkRelation: 'recipeId',
          //   permission: TYPE_REQUEST.DELETE,
          // },
        ],
      },
      removeMany: '',
    },
  },

  recipe: {
    name: 'recipe',
    functions: {
      create: { typePermission: TYPE_REQUEST.CREATE },
      findAll: { typePermission: TYPE_REQUEST.VIEW },
      findOne: { typePermission: TYPE_REQUEST.VIEW },
      update: { typePermission: TYPE_REQUEST.UPDATE },
      remove: { typePermission: TYPE_REQUEST.DELETE },
      removeMany: '',
    },
  },
};
