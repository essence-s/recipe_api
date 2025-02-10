import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipeModule } from './modules/recipe/recipe.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
// import { UtilsModule } from './utilsPrub/utils.module';
import { PublicModule } from './modules/public/public.module';
import { UploadImageModule } from './shared/upload-image/upload-image.module';
import { CryptoModule } from './shared/crypto/crypto.module';
import { APP_GUARD } from '@nestjs/core';
import { RevalidateModule } from './shared/revalidate/revalidate.module';

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
    CryptoModule,
    RevalidateModule,

    RecipeModule,
    IngredientModule,
    CategoryModule,
    PendingRecipeModule,
    SearchModule,
    AuthModule,
    UsersModule,
    RoleModule,
    CategoryGroupModule,
    PublicModule,

    // UtilsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
