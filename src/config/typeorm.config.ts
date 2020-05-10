import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'yuriy',
  password: 'Aster456solAr$',
  database: 'tasks',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
