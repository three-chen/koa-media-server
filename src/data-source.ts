import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { User } from '@/entity/User'
import { Room } from './entity/Room'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'mylive_server',
  synchronize: true,
  logging: true,
  entities: [User, Room],
  subscribers: [],
  migrations: []
})
