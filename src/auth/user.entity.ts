import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import Task from 'src/tasks/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(
    () => Task,
    task => task.user,
    { eager: true },
  )
  tasks: Task[];
}
