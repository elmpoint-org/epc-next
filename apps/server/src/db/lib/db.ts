import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  BatchGetCommand,
  BatchWriteCommand,
  QueryCommandInput,
  UpdateCommandInput,
  DeleteCommandInput,
  GetCommandInput,
  PutCommandInput,
  BatchWriteCommandInput,
  BatchGetCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { ExpressionAttributes } from './ExpressionAttributes';

const dbClient = new DynamoDBClient();
const db = DynamoDBDocumentClient.from(dbClient);

export class SimpleDynamo {
  TableName: string;
  constructor(TableName: string) {
    this.TableName = TableName;
  }

  async get(Key: KeyType) {
    if (!Key) throw new Error('Missing primary key.');

    const params: GetCommandInput = {
      TableName: this.TableName,
      Key,
    };
    return (await db.send(new GetCommand(params))).Item;
  }

  async put(Item: unknown) {
    if (!Item) throw new Error('Missing item.');

    const params: PutCommandInput = { TableName: this.TableName, Item };
    await db.send(new PutCommand(params));
  }

  async delete(Key: KeyType) {
    const params: DeleteCommandInput = {
      TableName: this.TableName,
      Key,
      ReturnValues: 'ALL_OLD',
    };
    return (await db.send(new DeleteCommand(params))).Attributes;
  }

  /**
   * run a query with a complex sort term (e.g. a range of values)
   *
   * [see the list of valid operands](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#DDB-Query-request-KeyConditionExpression)
   *
   * @param {*} options { index, query, limit?{number} }
   * @example
   *
   * query({
   *   index: 'indexName',
   *   query: {
   *     primaryKey: ['key1', 'key1value'],
   *     sortKey: ['key2', 'BETWEEN', 5, 10],
   *     // -- OR --
   *     sortKey: ['key2', '<=', 45],
   *   },
   *   limit: 5
   * });
   *
   */
  async query<Op extends QueryOp | null>(opts: {
    /** global index name */
    index?: string;
    /** query object */
    query: {
      /** primary key, value */
      primaryKey: [keyName: string, keyValue: unknown];
      /** sort key, operand, value(s). set to `NO_SORT_KEY` if you don't need one. */
      sortKey: [
        keyName: string,
        op: Op,
        ...vals: Op extends null
          ? []
          : Op extends 'BETWEEN'
          ? [startVal: unknown, endVal: unknown]
          : [val: unknown]
      ];
    };
    limit?: number;
  }) {
    const {
      index,
      query: {
        primaryKey: [primaryKey, primaryVal],
        sortKey: [sortKey, operand, ...sortVals],
      },
      limit,
    } = opts;

    // run query
    const { N, V, expressionAttributes } = new ExpressionAttributes();
    const params: QueryCommandInput = {
      TableName: this.TableName,
      KeyConditionExpression:
        `${N(primaryKey)} = ${V(primaryVal)}` + // primary key expression
        (!!operand // sort key expression...
          ? ` AND ${N(sortKey)} ${operand} ${sortVals.map(V).join(' AND ')}`
          : ''),
      ...expressionAttributes(),
    };
    if (index) params.IndexName = index;
    if (limit) params.Limit = limit;
    return (await db.send(new QueryCommand(params))).Items ?? [];
  }

  /** update a particular item. pass a key and add or remove commands */
  async update(opts: {
    Key: KeyType;
    add?: KeyValueType;
    remove?: KeyValueType;
  }) {
    const { Key, add, remove } = opts;

    // setup
    const { N, V, expressionAttributes } = new ExpressionAttributes();
    function updateExpression(command: string, object?: KeyValueType) {
      if (!object || !Object.keys(object ?? {}).length) return '';

      return `${command} ${Object.keys(object)
        .map((key) => `${N(key)} = ${V(object[key])}`)
        .join(', ')} `;
    }

    // run query
    const params: UpdateCommandInput = {
      TableName: this.TableName,
      Key,
      ReturnValues: 'ALL_NEW',
      UpdateExpression:
        updateExpression('set', add) + updateExpression('remove', remove),
      ...expressionAttributes(),
    };
    return (await db.send(new UpdateCommand(params))).Attributes;
  }

  /**
   * write or delete the items provided.
   *
   * if remove=true, pass an array of keys as `items`.
   * */
  async batchWrite(items: KeyValueType[], remove = false) {
    const REQLIM = 25; // max requests allowed in one api call.

    // build expressions
    const requests: BatchWriteCommandInput['RequestItems'][] = [];
    for (let i = 0; i < Math.ceil(items.length / REQLIM); i++) {
      requests.push({
        [this.TableName]: Object.assign([], items)
          .splice(i * REQLIM, REQLIM)
          .map((it) =>
            !remove
              ? {
                  PutRequest: {
                    Item: it,
                  },
                }
              : {
                  DeleteRequest: {
                    Key: it,
                  },
                }
          ),
      });
    }

    // run requests
    await Promise.all(
      requests.map(async (req) => {
        const { UnprocessedItems: unproc } = await db.send(
          new BatchWriteCommand({
            RequestItems: req,
          })
        );
        console.log(unproc);
      })
    );
  }

  /** get multiple items by their IDs */
  async batchGet(Keys: KeyType[]) {
    const REQLIM = 100; // max items allowed per request

    // create requests
    const requests: BatchGetCommandInput[] = [];
    for (let i = 0; i < Math.ceil(Keys.length / REQLIM); i++) {
      requests.push({
        RequestItems: {
          [this.TableName]: { Keys: Object.assign([], Keys) },
        },
      });
    }

    // run requests
    const recurse = async (request: BatchGetCommandInput) => {
      const { Responses, UnprocessedKeys } = await db.send(
        new BatchGetCommand(request)
      );
      const out = Responses?.[this.TableName] ?? [];
      if (Object.keys(UnprocessedKeys ?? {}).length)
        out.push(await recurse({ RequestItems: UnprocessedKeys }));
      return out;
    };
    return (await Promise.all(requests.map(recurse))).flat();
  }
}

// ------------------------------------

/** an AWS key */
export type KeyType = Record<string, unknown>;
/** same as KeyType, but this is not an AWS Key (it's for other values.) */
export type KeyValueType = KeyType;

export type QueryOp = '=' | '<' | '<=' | '>' | '>=' | 'BETWEEN';

export type QuerySK = Parameters<SimpleDynamo['query']>[0]['query']['sortKey'];
export type QuerySKBetween = Extract<QuerySK, { length: 4 }>;
export type QuerySKStandard = Exclude<QuerySK, QuerySKBetween>;

/** pass into query() if you don't need a sort key. */
export const NO_SORT_KEY: QuerySK = ['', null];
