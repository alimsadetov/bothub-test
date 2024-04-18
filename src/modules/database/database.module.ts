import { BaseRepository } from './base.repository';
import { Global, Module } from '@nestjs/common';
import { MigrationsService } from './migrations.service';

@Global()
@Module({
  providers: [BaseRepository, MigrationsService],
  exports: [BaseRepository],
})
export class DatabaseModule {}
