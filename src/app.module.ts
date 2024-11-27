import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipeModule } from './modules/recipe/recipe.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryGroupModule } from './modules/category-group/category-group.module';
import { CategoryModule } from './modules/category/category.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { PendingRecipeModule } from './modules/pending-recipe/pending-recipe.module';
import { RoleModule } from './modules/role/role.module';
import { SearchModule } from './modules/search/search.module';
import { UsersModule } from './modules/users/user.module';
import { PrismaModule } from './prisma.module';
import { DeleteCascadeModule } from './shared/delete-cascade/delete-cascade.module';
import { MemoRoleModule } from './shared/memo-role/memo-role.module';
import { UtilsModule } from './utils/utils.module';
import { PublicModule } from './modules/public/public.module';
import { UploadImageModule } from './shared/upload-image/upload-image.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60, // Tiempo de vida de la ventana en segundos (ej. 1 minuto)
        limit: 50, // Número máximo de solicitudes por IP en la ventana de tiempo
      },
    ]),
    DeleteCascadeModule,
    MemoRoleModule,
    PrismaModule,
    UploadImageModule,

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
    PublicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
