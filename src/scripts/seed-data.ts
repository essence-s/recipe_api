import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';

const prisma = new PrismaClient();

async function getJsonData() {
  const jsonData = await fs.readFile('prisma/data.json', 'utf8');
  const data = JSON.parse(jsonData);
  return data;
}

async function main() {
  let datajson = await getJsonData();

  const listFood = [
    {
      title: 'Tipos de Comida',
      data: ['Desayuno', 'Entrada', 'Almuerzo', 'Postre', 'Cena', 'Bebida'],
    },
    { title: 'Sabor', data: ['Dulce', 'Salado', 'Amargo'] },
    // { title: 'Dificultad', data: ['Dificil', 'Medio', 'Facil'] },
    // { title: 'Comidas por Lugar', data: [] },
    // { title: 'Comidas por Evento', data: [] },
    // { title: 'Más populares', data: [] },
    // { title: 'Ingredientres', data: [] },
  ];

  const listFoodPromises = listFood.map(async (item) => {
    const categoryGroup = await prisma.categoryGroup.upsert({
      where: { name: item.title },
      update: {},
      create: {
        name: item.title,
      },
    });

    const dataPromises = item.data.map(async (d) => {
      await prisma.category.upsert({
        where: { name: '' },
        update: {},
        create: {
          name: d,
          groupId: categoryGroup.id,
        },
      });
    });

    await Promise.all(dataPromises);
  });

  await Promise.all(listFoodPromises);

  const recipe = datajson[0];
  const recipeRes = await prisma.recipe.create({
    data: {
      ...recipe,
      categories: {
        create: recipe.categories.map((categoryId) => ({
          category: { connect: { name: categoryId } },
        })),
      },
      ingredients: {
        create: [
          {
            name: recipe.ingredients,
          },
        ],
      },
      instructions: {
        create: [{ description: recipe.instructions }],
      },
    },
  });
  console.log(recipeRes);
}

main()
  .then(async () => {
    console.log('Data create.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
