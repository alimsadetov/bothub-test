import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Connection } from './connection.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BaseRepository<Type> {
  protected tableName = '';
  protected connection: Connection;

  constructor(private readonly configService: ConfigService) {
    this.connection = new Connection(configService);
  }

  async findOneById(id: number | string): Promise<Type | null> {
    const sql = `SELECT * FROM "${this.tableName}" WHERE id = $1`;
    const source = await this.connection.fetchRow(sql, [id]);
    if (!source) {
      return null;
    }
    return <Type>(<unknown>source);
  }

  async findAll(filter: object = {}): Promise<Array<Type>> {
    let sql = `SELECT * FROM "${this.tableName}"`;
    if (Object.keys(filter).length != 0) {
      const custom_filter = Object.keys(filter)
        .map((key) => {
          if (typeof filter[key] == 'string') {
            return `${key} = '${filter[key]}' `;
          } else {
            return `${key} = ${filter[key]} `;
          }
        })
        .join('AND ');
      sql += ' WHERE ' + custom_filter;
    }

    const sources = await this.connection.fetchRows(sql, []);
    return sources.map((source) => <Type>(<unknown>source));
  }

  async findAllWithLimit(filter: object = {}, limit: number): Promise<Array<Type>> {
    let sql = `SELECT * FROM "${this.tableName}"`;
    if (Object.keys(filter).length != 0) {
      const custom_filter = Object.keys(filter)
        .map((key) => {
          if (typeof filter[key] == 'string') {
            return ` ${key} = '${filter[key]}' `;
          } else {
            return ` ${key} = ${filter[key]} `;
          }
        })
        .join(' AND ');
      sql += ' WHERE ' + custom_filter;
    }
    sql += ' LIMIT $1';

    const sources = await this.connection.fetchRows(sql, [limit]);
    return sources.map((source) => <Type>(<unknown>source));
  }

  async insert(model: Type): Promise<Type> {
    try {
      return <Type>(<unknown>await this.connection.insert(this.tableName, <object>(<unknown>model)));
    } catch (e) {
      console.log(e);
      throw new UnprocessableEntityException(`Could not create ${this.tableName}.`);
    }
  }

  async update(model: Type): Promise<Type> {
    try {
      return <Type>(<unknown>await this.connection.update(this.tableName, <object>(<unknown>model)));
    } catch (e) {
      throw new UnprocessableEntityException(`Could not update ${this.tableName}.`);
    }
  }

  async updateByParams(model: Type, filter: object): Promise<Type> {
    try {
      const columnValues = Object.values(<object>(<unknown>model));
      const sqlSets = Object.keys(<object>(<unknown>model))
        .map((columnName: string, i: number) => `"${columnName}" = $${++i}`)
        .join(', ');
      const paramsSets = Object.keys(filter)
        .map((columnName: string, i: number) => `"${columnName}" = $${++i + Object.keys(<object>(<unknown>model)).length}`)
        .join(' AND ');

      const sql = `UPDATE "${this.tableName}" SET ${sqlSets} WHERE ${paramsSets} RETURNING *`;

      for (const paramValue of Object.values(filter)) {
        columnValues.push(paramValue);
      }

      const res = await this.connection.fetchRow(sql, columnValues);
      if (!res) {
        console.error(`Update error. Statement: ${sql}, params: ${columnValues.join(', ')}.`);
        throw new UnprocessableEntityException('Update error.');
      }
      return <Type>(<unknown>res);
    } catch (e) {
      throw new UnprocessableEntityException(`Could not update ${this.tableName}.`);
    }
  }

  async delete(id: number | string): Promise<Type | null> {
    const sql = `DELETE FROM "${this.tableName}" WHERE id = $1 RETURNING *`;
    const source = await this.connection.fetchRow(sql, [id]);
    if (!source) {
      return null;
    }

    return <Type>(<unknown>source);
  }

  async deleteByParams(columnToValue: object): Promise<Type | null> {
    const columnKeys = Object.keys(columnToValue);
    const values = Object.values(columnToValue);
    const sqlSets = columnKeys.map((columnName: string, index: number) => `"${columnName}" = $${++index}`).join(' AND ');
    const sql = `DELETE FROM "${this.tableName}" WHERE ${sqlSets} RETURNING *`;
    const source = await this.connection.fetchRow(sql, values);
    if (!source) {
      return null;
    }

    return <Type>(<unknown>source);
  }

  async findOneByParams(columnToValue: object): Promise<Type | null> {
    const columnKeys = Object.keys(columnToValue);
    const values = Object.values(columnToValue);
    const sqlSets = columnKeys.map((columnName: string, index: number) => `"${columnName}" = $${++index}`).join(' AND ');

    const sql = `SELECT * FROM "${this.tableName}" WHERE ${sqlSets} LIMIT 1`;
    const source = <Type>(<unknown>await this.connection.fetchRow(sql, values));

    return <Type>(<unknown>source);
  }

  async findOneByParam(columnName: string, columnValue: string): Promise<Type | null> {
    const sql = `SELECT * FROM "${this.tableName}" WHERE $1 = $2 LIMIT 1`;
    const source = await this.connection.fetchRow(sql, [columnName, columnValue]);
    if (!source) {
      return null;
    }
    return <Type>(<unknown>source);
  }

  async findOneByParamsOrCreate(columnToValue: object): Promise<Type> {
    let source = await this.findOneByParams(columnToValue);

    if (!source) {
      source = await this.insert(<Type>(<unknown>columnToValue));
    }
    return <Type>(<unknown>source);
  }
}
