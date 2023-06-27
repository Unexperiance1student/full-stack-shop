import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoppingCart } from './entity/shopping-cart.model';
import { UserModule } from 'src/user/user.module';
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ShoppingCart]),
    UserModule,
    BoilerPartsModule,
  ],
  providers: [ShoppingCartService],
  controllers: [ShoppingCartController],
})
export class ShoppingCartModule {}
