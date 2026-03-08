import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';

console.log('Main DB URL:', process.env.MAIN_DB_URL);

export default new DataSource({
  type: 'postgres',
  url: process.env.MAIN_DB_URL,
  entities: [User, Session],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
