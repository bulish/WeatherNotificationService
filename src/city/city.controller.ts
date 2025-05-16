import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, ValidationPipe } from "@nestjs/common";
import { CityService } from "./city.service";
import { City } from "./entity/city.entity";
import { plainToInstance } from "class-transformer";
import { CityDto } from "./dto/city.dto";
import { IController, IControllerError } from "src/common/interfaces/controller.interface";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller('cities')
export class CityController implements IController<City, CityDto> {

  constructor(private readonly cityService: CityService) { }

  @Get()
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
      return { statusCode: 404, message: 'City not found' };
    }

    return plainToInstance(City, city);
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) createCityDto: CityDto
  ): Promise<City | IControllerError> {
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
      return { statusCode: 404, message: 'City not found' };
    }

    const updateCity = await this.cityService.update(id, {
      ...city,
      ...updateCityDto
    });

    return plainToInstance(City, updateCity);
  }

    @Delete(':id')
    async delete(
      @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
      id: number,
    ): Promise<void | IControllerError>  {
      const city = await this.cityService.getById(id);
  
      if (!city) {
        return { statusCode: 404, message: 'City not found' };
      }
  
      await this.cityService.delete(id);
      return { statusCode: 204, message: 'City was successfully deleted' };
    }

}
