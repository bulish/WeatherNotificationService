import { Entity, PrimaryGeneratedColumn, Column, Index  } from 'typeorm';

@Entity()
@Index('IDX_USER_EMAIL', ['email'], { unique: true })
@Index('IDX_USER_USERNAME', ['username'], { unique: true })
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  password: string;

}
