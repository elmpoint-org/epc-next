/* Model.ts - AWS db.js v1.5.0 by mbf. updated 2024.07.06. */

import {
  QueryOp,
  QuerySKStandard,
  QuerySKBetween,
  SimpleDynamo,
  QuerySK,
  KeyValueType,
  NO_SORT_KEY,
} from './db';
import { randomUUID as uuid } from 'node:crypto';

import DataLoader from 'dataloader';

const timestamp = () => Math.round(Date.now() / 1000);

// define custom Partial that allows null values
type Partial<T> = { [P in keyof T]?: T[P] | undefined | null };
export type DBPartial<T> = Partial<T>;
export type InitialType<T> = Omit<T, 'id' | 'timestamp'>;

interface DBTypeProps {
  id: string;
  query: number;
  tcreated: number;
  tupdated: number;
}
export type DBType<T extends KeyValueType> = T & DBTypeProps;

/**
 * Model class for interacting with a database table.
 * @template Type The type of data stored in the table.
 */
abstract class Model<Type extends KeyValueType> {
  /**
   * The data type added as a column to all entries, allowing for multiple data types per table.
   * @abstract
   */
  protected abstract type: string;

  /**
   * The name of the DynamoDB table.
   * @abstract
   */
  protected abstract table: string;

  // DB INSTANCE
  private __db?: SimpleDynamo;
  private get db() {
    if (this.__db) return this.__db;
    return new SimpleDynamo(this.table);
  }

  // add internal properties to this entry, such as created/updated timestamps and a unique id
  protected schema(self: Model<Type>, old?: boolean) {
    return (data: any) => {
      const ts = timestamp();
      let out = data;

      if (!old)
        out = {
          type: self.type,
          id: uuid(),
          ...out,

          query: 0,
          tcreated: ts,
        };
      out.tupdated = ts;

      return Object.keys(out).reduce((obj, it) => {
        if (typeof out[it] !== 'undefined') return { ...obj, [it]: out[it] };
        return obj;
      }, {} as DBType<Type>);
    };
  }

  // deduping function
  private loader = new DataLoader(this.DBbatchGet.bind(this));

  // standard resolver functions (overwrite if needed)

  /**
   * get one object by its id
   * @param id id of item to get (actual key becomes `type, id`)
   * @returns the item
   */
  async get(id: string) {
    return this.loader.load(id) as Promise<DBType<Type>>;
  }

  /**
   * get multiple items by their IDs
   * @param ids array of items to get from db
   * @returns array of items
   */
  async getMultiple(ids: string[]) {
    return this.loader.loadMany(ids) as Promise<(DBType<Type> | undefined)[]>;
  }

  /**
   * get all items stored in table
   * @returns all table items
   */
  async getAll() {
    return this.DBgetAll();
  }

  /**
   * find items matching a certain key:value query
   * @param key the table column to query for
   * @param value the value of that property to match
   * @returns an array of matching items
   */
  async findBy(key: keyof DBType<Type>, value: unknown) {
    return this.DBfind(key as string, value);
  }

  async create(item: InitialType<Type>) {
    return this.DBcreate(item);
  }
  async update(id: string, args: Partial<Type>) {
    return this.DBupdate(id, args);
  }
  async delete(id: string) {
    return this.DBdelete(id);
  }

  async createMultiple(items: InitialType<Type>[]) {
    return this.DBcreateMultiple(items);
  }

  /**
   * delete multiple items by their IDs
   * @param ids ids of items to delete
   * @param output whether or not to also retrieve the data and return it
   * @returns the matching items IF output=true
   */
  async deleteMultiple(ids: string[], output = true) {
    return this.DBdeleteMultiple(ids, output);
  }

  /**
   * run a query on the database
   * @param sortKey the variable to filter by
   * @param op a {@link QueryOp} operator
   * @param vals values to compare to
   * @param limit number of items to return, if needed
   * @returns an array of matching values
   */
  async query<T extends QueryOp>(
    sortKey: keyof DBType<Type> & string,
    op: T,
    ...opts: [
      ...skv: T extends QueryOp & 'BETWEEN'
        ? SKVals<QuerySKBetween>
        : SKVals<QuerySKStandard>,
      limit?: number
    ]
  ) {
    // sort key values
    const sortKeyVals =
      op === 'BETWEEN'
        ? opts.slice(0, 2) // [startVal, endVal]
        : opts.slice(0, 1); // [val]

    // optional limit
    const limit = opts[op === 'BETWEEN' ? 2 : 1] as number | undefined;

    return (await this.db.query({
      index: `type-${sortKey}`,
      query: {
        primaryKey: ['type', this.type],
        sortKey: [sortKey, op, ...sortKeyVals] as QuerySK,
      },
      limit,
    })) as DBType<Type>[];
  }

  // internal: DB CRUD functions
  private async DBget(id: string) {
    return await this.db.get({ type: this.type, id });
  }
  private async DBcreate(item_: InitialType<Type>) {
    const item = this.schema(this)(item_);
    await this.db.put(item);
    return (await this.DBget(item.id)) as DBType<Type>;
  }
  private async DBupdate(id: string, changes: Partial<Type>) {
    const schema = this.schema(this, true);

    return (await this.db.update({
      Key: { type: this.type, id },
      add: schema(changes),
      remove: undefined,
    })) as DBType<Type>;
  }
  private async DBdelete(id: string) {
    return (await this.db.delete({
      type: this.type,
      id,
    })) as DBType<Type>;
  }

  // internal: DB utilities
  private async DBbatchGet(ids: readonly string[]) {
    const type = this.type;
    const items = (await this.db.batchGet(
      ids.map((id) => ({ type, id }))
    )) as DBType<Type>[];

    return ids.map((id) => items.find((it) => it.id === id));
  }
  private async DBgetAll() {
    return (await this.db.query({
      query: {
        primaryKey: ['type', this.type],
        sortKey: NO_SORT_KEY,
      },
    })) as DBType<Type>[];
  }
  private async DBfind(key: string, value: unknown) {
    return (await this.db.query({
      index: `type-${key}`,
      query: {
        primaryKey: ['type', this.type],
        sortKey: [key, '=', value],
      },
    })) as DBType<Type>[];
  }

  private async DBcreateMultiple(items_: InitialType<Type>[]) {
    const schema = this.schema(this);
    const items = items_.map((it) => schema(it));
    const ids = items.map((it) => it.id);

    await this.db.batchWrite(items);
    // return (await this.DBbatchGet(ids)) as DBType<Type>[];
    return items;
  }

  private async DBdeleteMultiple(ids: string[], output = true) {
    const type = this.type;
    const keys = ids.map((id) => ({ type, id }));
    let out;
    if (output) {
      out = (await this.DBbatchGet(ids)) as DBType<Type>[];
    }

    await this.db.batchWrite(keys, /* remove: */ true);

    return out;
  }
}

export default Model;

type SKVals<T extends any[]> = T extends [any, any, ...infer K] ? K : never;
