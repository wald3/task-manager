import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sqliteConfig } from './config/typeorm.sqlite3.config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(sqliteConfig),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
