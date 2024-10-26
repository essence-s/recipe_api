import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipeModule } from './recipe/recipe.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientModule } from './ingredient/ingredient.module';
import { CategoryModule } from './category/category.module';
import { PendingRecipeModule } from './pending-recipe/pending-recipe.module';
import { UtilsModule } from './utils/utils.module';
import { SearchModule } from './search/search.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { PrismaModule } from './prisma.module';
import { MemoRoleModule } from './memo-role/memo-role.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
