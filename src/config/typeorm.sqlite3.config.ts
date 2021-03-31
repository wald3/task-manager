import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

let dbConfig = config.get('db'); 

export const sqliteConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  database: process.env.DATABASE || dbConfig.database,
  entities: [
    __dirname + '/../**/entities/*.entity.{js,ts}'
  ],
  synchronize: process.env.SYNCHRONIZE || dbConfig.synchronize,
}

// example of postgres db config + amazon rds env variables
export const postgresConfig: TypeOrmModuleOptions = {
  type: dbConfig.type, // postgres

  // commented in development.yml
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [
    __dirname + '/../**/entities/*.entity.{js,ts}'
  ],
  synchronize: dbConfig.synchronize || false,
}