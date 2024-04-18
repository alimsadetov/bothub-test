import { PoolClient, QueryResult } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit, UnprocessableEntityException } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { MigrationEntity } from './migration.entity';
import { extname, join } from 'path';
import { readFileSync, readdirSync } from 'fs';

@Injectable()
export class MigrationsService extends BaseRepository<MigrationEntity> implements OnModuleInit {
  private client: PoolClient;

  protected tableName: string = 'migrations';

  constructor(configService: ConfigService) {
    super(configService);
  }

  async onModuleInit() {
    await this.createMigrationsTable();
    this.client = await this.connection.pool.connect();
    const migrations = this.getMigrationFileNames();
    const notExecuted = await this.getNotExecutedMigrations(migrations);
    for (let name of notExecuted) {
      const query = this.readMigrationFile(name);
      try {
        await this.client.query(query);
        await this.insert(<MigrationEntity>{ name });
      } catch (e) {
        console.log(e);
        throw new UnprocessableEntityException('Ошибка в миграции');
      }
    }
  }

  getMigrationFileNames(): string[] {
    const migrationsDir = join(__dirname, '../../../migrations'); // Путь к папке с миграциями
    const files = readdirSync(migrationsDir); // Получить список файлов в папке
    const migrationFiles = files.filter((file) => extname(file) === '.sql'); // Отфильтровать файлы с расширением .sql
    return migrationFiles.map((fileName) => fileName.replace('.sql', ''));
  }

  async getNotExecutedMigrations(names: string[]): Promise<string[]> {
    const executed = await this.findAll();
    return names.filter((name) => {
      return !executed
        .map((ent) => {
          return ent.name;
        })
        .includes(name);
    });
  }

  async createMigrationsTable(): Promise<QueryResult> {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `;
    return this.connection.pool.query(query);
  }

  readMigrationFile(name: string): string {
    console.log(join(__dirname, `../../../migrations/${name}.sql`));
    const file = readFileSync(join(__dirname, `../../../migrations/${name}.sql`), 'utf8');
    return file;
  }
}
