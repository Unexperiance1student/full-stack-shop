import { Module } from '@nestjs/common';
import { BoilerPartsController } from './boiler-parts.controller';
import { BoilerPartsService } from './boiler-parts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BoilerParts } from './entity/boilerParts.mode';

@Module({
  controllers: [BoilerPartsController],
  providers: [BoilerPartsService],
  imports: [SequelizeModule.forFeature([BoilerParts])],
  exports: [BoilerPartsService],
})
export class BoilerPartsModule {}
