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
import { MemoRoleModule } from './shared/memo-role/memo-role.module';
import { CategoryGroupModule } from './modules/category-group/category-group.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60, // Tiempo de vida de la ventana en segundos (ej. 1 minuto)
        limit: 50, // Número máximo de solicitudes por IP en la ventana de tiempo
      },
    ]),

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
