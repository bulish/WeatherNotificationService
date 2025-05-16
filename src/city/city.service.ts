import { BadRequestException, Injectable } from "@nestjs/common";
import { CityRepository } from "./repository/city.repository";
import { City } from "./entity/city.entity";
import { ICrudService } from "src/common/interfaces/crud-service.interface";
import { CityDto } from "./dto/city.dto";

@Injectable()
export class CityService implements ICrudService<City, CityDto> {

  constructor(private readonly cityRepository: CityRepository) { }

  async getAll(): Promise<City[]> {
    return this.cityRepository.getAll();
  }

  async getById(id: number): Promise<City | null> {
    return this.cityRepository.findCityById(id);
  }

  async create(city: CityDto): Promise<City> {
    const cityExists = await this.cityRepository.findCityByName(city.name);

    if (cityExists) {
      throw new BadRequestException('This city is already stored');
    }
    
    return this.cityRepository.createCity(city);
  }

  async update(id: number, city: CityDto): Promise<City | null> {
    const cityExists = await this.cityRepository.findCityByName(city.name);

    if (cityExists) {
      throw new BadRequestException('This city is already stored');
    }
    
    return this.cityRepository.updateCity(id, city);
  }

  async delete(id: number): Promise<void> {
    return this.cityRepository.removeCity(id);
  }

}
