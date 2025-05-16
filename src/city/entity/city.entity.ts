import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index('IDX_CITY_NAME', ['name'], { unique: true })
export class City {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

}
