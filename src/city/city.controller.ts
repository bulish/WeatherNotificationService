import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Post, Put, UseGuards, ValidationPipe } from "@nestjs/common";
import { CityService } from "./city.service";
import { City } from "./entity/city.entity";
import { plainToInstance } from "class-transformer";
import { CityDto } from "./dto/city.dto";
import { IController, IControllerError } from "src/common/interfaces/controller.interface";
import { AuthGuard } from "src/auth/auth.guard";
import { CACHE_MANAGER, CacheKey, CacheTTL } from "@nestjs/cache-manager";
import { CITIES_LIST } from "src/common/constants/cache.constants";
import { CITY_DELETE_SUCCESS, CITY_NOT_FOUND } from "src/common/constants/response.contants";
import { Cache } from 'cache-manager';

@UseGuards(AuthGuard)
@Controller('cities')
export class CityController implements IController<City, CityDto> {

  constructor(
    private readonly cityService: CityService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  @Get()
  @CacheTTL(60)
  @CacheKey(CITIES_LIST)
  async getAll(): Promise<City[]> {
    return await this.cityService.getAll()
  }

  @Get(':id')
  async getById(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
  ): Promise<City | IControllerError> {
    const city = await this.cityService.getById(id);

    if (!city) {
      return { statusCode: 404, message: CITY_NOT_FOUND };
    }

    return plainToInstance(City, city);
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) createCityDto: CityDto
  ): Promise<City | IControllerError> {
    await this.cacheManager.del(CITIES_LIST);
    return await this.cityService.create(createCityDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
    @Body(new ValidationPipe()) updateCityDto: CityDto
  ): Promise<City | IControllerError> {
    const city = await this.cityService.getById(id);

    if (!city) {
      return {
        statusCode: 404, message: CITY_NOT_FOUND
      };
    }

    const updateCity = await this.cityService.update(id, {
      ...city,
      ...updateCityDto
    });

    await this.cacheManager.del(CITIES_LIST);
    return plainToInstance(City, updateCity);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
  ): Promise<void | IControllerError> {
    const city = await this.cityService.getById(id);

    if (!city) {
      return { statusCode: 404, message: CITY_NOT_FOUND };
    }

    await this.cityService.delete(id);
    await this.cacheManager.del(CITIES_LIST);
    return { statusCode: 204, message: CITY_DELETE_SUCCESS };
  }

}
