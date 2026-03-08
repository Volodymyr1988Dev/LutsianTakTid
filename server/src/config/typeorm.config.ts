import { DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Projects } from '../entities/project.entity';
import { ProjectImage } from '../entities/projectImages.entity';
import { Session } from '../entities/session.entity';

const useSSL = process.env.NEON_DB_URL?.includes('neon.tech') ?? false;

export const mainDbConfig: DataSourceOptions = {
  name: 'main',
  type: 'postgres',
  url: process.env.MAIN_DB_URL, // Fly DB
  entities: [User, Session],
  //synchronize: false,
  //autoLoadEntities: true,
  synchronize: false,
  logging: false,
};
console.log('mainDbConfig', mainDbConfig);
export const projectsDbConfig: DataSourceOptions = {
  name: 'projects',
  type: 'postgres',
  url: process.env.NEON_DB_URL, // readonly_user connection
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  entities: [Projects, ProjectImage],
  synchronize: false,
  logging: false,
};
console.log('projectsDbConfig', projectsDbConfig);
export const neonAnotherConfig: DataSourceOptions = {
  name: 'neonAnother',
  type: 'postgres',
  url: process.env.NEON_DB_2,
  //entities: [...],
  synchronize: false,
};
console.log('MAIN_DB_URL', process.env.MAIN_DB_URL);
console.log('NEON_DB_URL', process.env.NEON_DB_URL);
