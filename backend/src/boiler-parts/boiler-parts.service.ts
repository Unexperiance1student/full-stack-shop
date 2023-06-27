import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IBoilerPartsQuery } from './types';
import { Op } from 'sequelize';
import { BoilerParts } from './entity/boilerParts.model';

@Injectable()
export class BoilerPartsService {
  constructor(
    @InjectModel(BoilerParts) private boilerPartsRep: typeof BoilerParts,
  ) {}

  async paginatedAndFilter(
    query: IBoilerPartsQuery,
  ): Promise<{ count: number; rows: BoilerParts[] }> {
    const limit = +query.limit;
    const offset = +query.offset * 20;
    return this.boilerPartsRep.findAndCountAll({
      limit,
      offset,
    });
  }

  async bestsellers(): Promise<{ count: number; rows: BoilerParts[] }> {
    return this.boilerPartsRep.findAndCountAll({
      where: { bestseller: true },
    });
  }

  async new(): Promise<{ count: number; rows: BoilerParts[] }> {
    return this.boilerPartsRep.findAndCountAll({
      where: { new: true },
    });
  }

  async findOne(id: number | string): Promise<BoilerParts> {
    return this.boilerPartsRep.findOne({
      where: { id },
    });
  }

  async findOneByName(name: string): Promise<BoilerParts> {
    return this.boilerPartsRep.findOne({
      where: { name },
    });
  }

  async searchByString(
    str: string,
  ): Promise<{ count: number; rows: BoilerParts[] }> {
    return this.boilerPartsRep.findAndCountAll({
      limit: 20,
      where: { name: { [Op.like]: `%${str}%` } },
    });
  }
}
