import { UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolConfig } from 'pg';
import { DB_HOST, DB_NAME, DB_PORT, POSTGRES_PASSWORD, POSTGRES_USER } from 'src/config/db.config';

export class Connection {
  readonly pool: Pool;

  constructor(configService: ConfigService) {
    this.pool = new Pool(<PoolConfig>{
      database: configService.get(DB_NAME),
      user: configService.get(POSTGRES_USER),
      password: configService.get(POSTGRES_PASSWORD),
      host: configService.get(DB_HOST),
      port: Number(configService.get(DB_PORT)),
    });
  }
  async fetchRows(sql: string, params: any[] = []): Promise<Array<object>> {
    const client = await this.pool.connect();
    let result;
    try {
      result = await client.query(sql, params);
    } finally {
      client.release();
    }
    return result.rows;
  }

  async fetchRow(sql: string, params: any[] = []): Promise<object | null> {
    const result = await this.fetchRows(sql, params);
    return <object>result[0] || null;
  }

  async fetchScalar(text: string, params: any[] = []): Promise<string | number | boolean | null> {
    const result = await this.fetchRow(text, params);
    if (null === result) {
      return null;
    }

    const keys = Object.keys(result);
    return result[keys[0]];
  }

  async insert(tableName: string, columns: object): Promise<object> {
    const columnValues = Object.values(columns);
    const columnNames = Object.keys(columns)
      .map((columnName: string) => `"${columnName}"`)
      .join(', ');
    const valuesPlaceholder = columnValues.map((_, i: number) => `$${i + 1}`).join(', ');

    const sql = `INSERT INTO "${tableName}" (${columnNames}) VALUES (${valuesPlaceholder}) RETURNING *`;

    const res = await this.fetchRow(sql, columnValues);
    if (!res) {
      console.error(`Insertion error. Statement: ${sql}, params: ${columnValues.join(', ')}.`);
      throw new UnprocessableEntityException('Insertion error.');
    }

    return res;
  }

  async update(tableName: string, columns: object): Promise<object> {
    const columnValues = Object.values(columns);
    const sqlSets = Object.keys(columns)
      .map((columnName: string, i: number) => `"${columnName}" = $${++i}`)
      .join(', ');

    const sql = `UPDATE "${tableName}" SET ${sqlSets} WHERE id = ($${Object.keys(columns).length + 1}) RETURNING *`;
    columnValues.push(columns['id']);
    const res = await this.fetchRow(sql, columnValues);
    if (!res) {
      console.error(`Update error. Statement: ${sql}, params: ${columnValues.join(', ')}.`);
      throw new UnprocessableEntityException('Update error.');
    }

    return res;
  }
}
