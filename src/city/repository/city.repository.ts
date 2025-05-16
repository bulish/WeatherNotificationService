import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { City } from "../entity/city.entity";
import { Repository } from "typeorm";
import { CityDto } from "../dto/city.dto";

@Injectable()
export class CityRepository {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async findCityById(id: number): Promise<City | null> {
    return this.cityRepository.findOne({ where: { id } });
  }

  async findCityByName(name: string): Promise<City | null> {
    return this.cityRepository.findOne({ where: { name } });
  }

  async getAll(): Promise<City[]> {
    return await this.cityRepository.find();
  }

  async createCity(city: CityDto) {
    const newCity = this.cityRepository.create(city);
    return this.cityRepository.save(newCity);
  }

  async updateCity(id: number, updates: Partial<City>): Promise<City | null> {
    await this.cityRepository.update(id, updates);
    return this.cityRepository.findOne({ where: { id } });
  }

  async removeCity(id: number): Promise<void> {
    await this.cityRepository.delete(id);
  }

}
