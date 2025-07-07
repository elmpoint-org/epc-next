/**
 * @description Stores values passed into a DynamoDB expression,
 * protecting against command injection. \
 * The N() and V() functions take the passed variable, create a
 * new Expression Attribute for it, and return the key.
 *
 * @usage
 *
 * Instantiate a new instance before creating a new Command.
 *
 * When creating your expression, wrap each name or value passed in
 * with the N() and V() functions.
 *
 * *After all names and values have been passed in*, include the
 * ExpressionAttribute maps by adding `...expressionAttributes()`
 * to your command parameters.
 *
 * @example
 * // YOUR CODE:
 *
 * const data = { // search i want to run...
 *   primary: { key: 'my-primary-key', value: '1' },
 *   sort: { key: 'my-sort-key', low: 2, high: 3 },
 * };
 *
 * // building query...
 * const { N, V, expressionAttributes } = new ExpressionAttributes();
 * const params: QueryCommandInput = {
 *   TableName: 'my-table',
 *   KeyConditionExpression:
 *     `${N(data.primary.key)} = ${V(data.primary.value)} AND ` +
 *     `${N(data.sort.key)} BETWEEN ${V(data.sort.low)} AND ${V(data.sort.high)}`,
 *   ...expressionAttributes(),
 * };
 * client.send(new QueryCommand(params));
 *
 * // WHICH RESULTS IN:
 *
 * const params = {
 *   TableName: 'my-table',
 *   KeyConditionExpression: '#n0 = :v0 AND #n1 BETWEEN :v1 AND :v2',
 *   ExpressionAttributeNames: {
 *     '#n0': 'my-primary-key',
 *     '#n1': 'my-sort-key',
 *   },
 *   ExpressionAttributeValues: {
 *     ':v0': '1',
 *     ':v1': 2,
 *     ':v2': 3,
 *   },
 * };
 *
 */
export class ExpressionAttributes {
  constructor() {
    this.N = this.N.bind(this);
    this.V = this.V.bind(this);
    this.expressionAttributes = this.expressionAttributes.bind(this);
  }

  /** encode an ExpressionAttributeName */
  N(n: string) {
    return this.storeAttribute(this.name_map, this.NAME_PREFIX, n);
  }
  /** encode an ExpressionAttributeValue */
  V(v: unknown) {
    return this.storeAttribute(this.val_map, this.VALUE_PREFIX, v);
  }

  /** get attribute objects. include with spread operator. */
  expressionAttributes() {
    return {
      ExpressionAttributeNames: Object.fromEntries(this.name_map),
      ExpressionAttributeValues: Object.fromEntries(this.val_map),
    } as const;
  }

  // ------------------------------------

  private name_map: Map<string, string> = new Map();
  private val_map: Map<string, unknown> = new Map();

  private storeAttribute(
    map: Map<unknown, unknown>,
    prefix: string,
    value: unknown
  ) {
    // if value already exists, reuse it!
    if (this.REUSE_VARS)
      for (const [ref, val] of map.entries()) if (val === value) return ref;

    // otherwise create a new one
    const ref = this.makeRef(map.size, prefix);
    map.set(ref, value);
    return ref;
  }

  // ------------------------------------
  // OVERRIDEABLE OPTIONS

  /** override this to change how Attribute refs are created */
  protected makeRef(i: number, prefix: string) {
    return `${prefix}${i.toString(16)}`;
  }

  /** override this to change AttributeName prefix **(MUST START WITH `#`)** */
  protected NAME_PREFIX = '#n';
  /** override this to change AttributeValue prefix **(MUST START WITH `:`)** */
  protected VALUE_PREFIX = ':v';
  /** where possible, whether to reuse already-stored variables if they come up again. */
  protected REUSE_VARS = true;
}
