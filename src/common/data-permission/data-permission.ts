enum TYPE_REQUEST {
  VIEW = 'find',
  UPDATE = 'update',
  DELETE = 'delete',
  CREATE = 'create',
}

enum ROUTE {}
enum NAMETABLE {
  USER = 'user',
  ROLE = 'role',
  RECIPE = 'recipe',
  PENDING_RECIPE = 'pendingRecipe',
}

enum CHECK_RELATION {
  USER = 'user',
  ROLE = 'role',
  RECIPE = 'recipe',
  PENDING_RECIPE = 'pendingRecipe',
}

export const dataPermission = {
  user: {
    name: 'user',
    functions: {
      create: { name: 'user', typePermission: TYPE_REQUEST.CREATE },
      findAll: { name: 'user', typePermission: TYPE_REQUEST.VIEW },
      findOne: { name: 'user', typePermission: TYPE_REQUEST.VIEW },
      update: { name: 'user', typePermission: TYPE_REQUEST.UPDATE },
      remove: {
        name: 'user',
        typePermission: TYPE_REQUEST.DELETE,
        reassign: {
          name: 'recipe',
          checkRelation: 'userId',
          permission: TYPE_REQUEST.UPDATE,
        },
        permissionsDeleteCascade: [
          {
            name: 'recipe',
            checkRelation: 'userId',
            permission: TYPE_REQUEST.DELETE,
          },
        ],
      },
      removeMany: { name: 'user', typePermission: TYPE_REQUEST.DELETE },
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
        reassign: {
          name: 'user',
          checkRelation: 'roleId',
          permission: TYPE_REQUEST.UPDATE,
        },
        permissionsDeleteCascade: [
          {
            name: 'user',
            checkRelation: 'roleId',
            permission: TYPE_REQUEST.DELETE,
          },
          {
            name: 'recipe',
            checkRelation: 'userId',
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
      create: { name: 'recipe', typePermission: TYPE_REQUEST.CREATE },
      findAll: { name: 'recipe', typePermission: TYPE_REQUEST.VIEW },
      findOne: { name: 'recipe', typePermission: TYPE_REQUEST.VIEW },
      update: { name: 'recipe', typePermission: TYPE_REQUEST.UPDATE },
      remove: { name: 'recipe', typePermission: TYPE_REQUEST.DELETE },
      removeMany: { name: 'recipe', typePermission: TYPE_REQUEST.DELETE },
    },
  },
  categoryGroup: {
    name: 'category-group',
    functions: {
      create: { name: 'category-group', typePermission: TYPE_REQUEST.CREATE },
      findAll: { name: 'category-group', typePermission: TYPE_REQUEST.VIEW },
      findOne: { name: 'category-group', typePermission: TYPE_REQUEST.VIEW },
      update: { name: 'category-group', typePermission: TYPE_REQUEST.UPDATE },
      remove: { name: 'category-group', typePermission: TYPE_REQUEST.DELETE },
      removeMany: {
        name: 'category-group',
        typePermission: TYPE_REQUEST.DELETE,
      },
    },
  },
  category: {
    name: 'category',
    functions: {
      create: { name: 'category', typePermission: TYPE_REQUEST.CREATE },
      findAll: { name: 'category', typePermission: TYPE_REQUEST.VIEW },
      findOne: { name: 'category', typePermission: TYPE_REQUEST.VIEW },
      update: { name: 'category', typePermission: TYPE_REQUEST.UPDATE },
      remove: { name: 'category', typePermission: TYPE_REQUEST.DELETE },
      removeMany: { name: 'category', typePermission: TYPE_REQUEST.DELETE },
    },
  },
};
