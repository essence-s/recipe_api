import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipeModule } from './modules/recipe/recipe.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { CategoryModule } from './modules/category/category.module';
import { PendingRecipeModule } from './modules/pending-recipe/pending-recipe.module';
import { UtilsModule } from './utils/utils.module';
import { SearchModule } from './modules/search/search.module';
import { UsersModule } from './modules/users/users.module';
import { RoleModule } from './modules/role/role.module';
import { PrismaModule } from './prisma.module';
import { MemoRoleModule } from './modules/memo-role/memo-role.module';
import { CategoryGroupModule } from './modules/category-group/category-group.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'recipes_db.sqlite', // Nombre del archivo donde se almacenará la base de datos
    //   autoLoadEntities: true,
    //   synchronize: true, // Solo en desarrollo, no en producción
    // }),
    MemoRoleModule,
    PrismaModule,

    RecipeModule,
    IngredientModule,
    CategoryModule,
    PendingRecipeModule,
    UtilsModule,
    SearchModule,
    AuthModule,
    UsersModule,
    RoleModule,
    CategoryGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
