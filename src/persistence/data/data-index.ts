import { Assert, Utilities } from 'caribviper-common';

/**Provides base outline for database index */
export interface IDataIndex {
  name: string;
  fields: string[];
}

/**Provides base outline for database index container*/
export interface IDataIndexContainer {
  index: IDataIndex;
}

/**Manages index implementing IDataIndex */
export class DataIndex implements IDataIndex {
  /**Name of the index */
  readonly name: string;
  /**Fields belonging to the index */
  readonly fields: string[];

  /**
   * Creates a new DataIndex
   * @param name Name of the index
   * @param fields Fields of the index
   */
  constructor(name: string, ...fields: string[]) {
    Assert.isTruthy(name, 'DataIndex: Name cannot be null/empty');
    Assert.isNonEmptyArray(fields, 'DataIndex: Fields cannot be null');
    this.name = Utilities.getPropertyName(name);
    this.fields = fields;
  }
}

/**Manages the index container by implementing IDataIndexContainer */
export class DataIndexContainer implements IDataIndexContainer {
  /**
   * Creates a new DataIndexContainer
   * @param index IDataIndex with the index
   */
  constructor(readonly index: IDataIndex) { }

  /**
   * Creates a new DataIndexContainer with defined index based on paramaters passed
   * @param name Name of the index
   * @param fields Fields of the index
   */
  static createIndex<TValue>(name: string | ((model) => TValue), ...fields: string[]) : IDataIndexContainer {
    Assert.isTruthy(name, 'DataIndexContainer: Name cannot be null/empty');
    return new DataIndexContainer(new DataIndex(Utilities.getPropertyName(name), ...fields));
  }
}
