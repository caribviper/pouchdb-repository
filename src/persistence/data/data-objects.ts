import { Assert, Utilities } from 'caribviper-common';
import { IEntity } from 'caribviper-entities';

/**Database general errors */
export interface IDbError {
  error: string;
  reason: string;
}

/**Database errors as it relates to documents */
export interface IDbErrorDoc extends IDbError {
  id: string;
  rev: string;
}

/**
 * Stores information about the database
 */
export interface IDbInfo {
  /**Name of the database */
  db_name: string;
  /**Number of documents in database */
  doc_count: number;

  /**Update Sequence */
  update_seq: number;
}

/**Stores database response */
export interface IDbResponse {
  /**Indicates whether the response was successful */
  ok: boolean;

  /**Id of the document changed */
  id: string;

  /**revision of the document */
  rev: string;
}

/**Document results returned from a get all  */
export interface IDbDocumentResults {
  /**Total number of row/documents found */
  total_rows: number;

  /**Off set from return records */
  offset: number;

  /**Actual rows of documents found */
  rows: any[];
}

export interface IDbDocumentResultsGeneric<T> {
  /**Total number of row/documents found */
  total_rows: number;

  /**Off set from return records */
  offset: number;

  /**Actual rows of documents found */
  rows: T[];

}

export interface IBaseDbQueryResult {
  /**Array of document results */
  docs;
}

/**Get the result from a query */
export interface IDbQueryResult extends IBaseDbQueryResult {
  /**Array of document results */
  docs: any[];
}

/**Get the result from a query with Generics */
export class IDbQueryResultGeneric<T> implements IBaseDbQueryResult {
  /**Array of document results */
  docs: T[];
}

/**Manages db selector values */
export class DbSelectorValue {

  /**
   * 
   * @param selector DbSelector that stores the parent object
   * @param propertyContainer Property container object that stores all properties and valuees
   * @param propertyName Property container value to be used
   */
  constructor(private selector: DbSelector, private propertyContainer: any, private propertyName: string) {
    Assert.isTruthy(propertyContainer, 'DbSelectorValue: Invalid parent object');
    Assert.isTruthy(propertyName, 'DbSelectorValue: Invalid property name');
    Assert.isTruthy(selector, 'DbSelectorValue: Invalid sector');
  }

  private get property(): any { return this.propertyContainer[this.propertyName]; }

  private set property(value: any) { this.propertyContainer[this.propertyName] = value; }

  /**
   * Adds a value item to the property
   * @param item Value item to be added
   */
  withValue(item: string | number | boolean | { propertyName: string, value: string | number | boolean }): DbSelectorValue {
    if ((typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean')) {
      if (!this.property)
        this.property = item;
      else
        throw new Error('DbSelectorValue: Cannot assign literal to object');
    }
    else {
      if (!this.property)
        this.property = {};
      if (typeof this.property !== 'string' && typeof this.property !== 'number')
        this.property[item.propertyName] = item.value;
      else
        throw new Error('DbSelectorValue: Cannot assign object to literal');
    }
    return this;
  }

  /**
   * Adds an object as a value item
   * @param item DbSelector to be used with the property
   */
  withObjectValue(item: any): DbSelectorValue {
    if (!item)
      throw new Error('DbSelectorValue: Cannot past a falsey item object to withObject');
    this.property = item;
    return this;
  }

  on(): DbSelector { return this.selector; }
}


/**Manages db selector values */
export class DbSelectorAsValue {

  /**
   * 
   * @param selector DbSelector that stores the parent object
   * @param propertyContainer Property container object that stores all properties and values
   * @param propertyName Property container value to be used
   */
  constructor(private selector: DbSelector, private propertyContainer: any, private propertyName: string) {
    Assert.isTruthy(propertyContainer, 'DbSelectorValue: Invalid parent object');
    Assert.isTruthy(propertyName, 'DbSelectorValue: Invalid property name');
    Assert.isTruthy(selector, 'DbSelectorValue: Invalid sector');
  }

  private get property(): any[] { return this.propertyContainer[this.propertyName]; }

  private set property(value: any[]) { this.propertyContainer[this.propertyName] = value; }

  /**
   * Adds a dbselector as a value item
   * @param item DbSelector to be used with the property
   */
  withSelector(item: DbSelector): DbSelectorAsValue {
    this.property.push(item.selector);
    return this;
  }

  /**
   * Adds an object as a value item
   * @param item DbSelector to be used with the property
   */
  withObject(item: any): DbSelectorAsValue {
    if (!item)
      throw new Error('DbSelectorAsValue: Cannot past a falsey item object to withObject');
    this.property.push(item);
    return this;
  }

  on(): DbSelector { return this.selector; }
}

/**
 * Manages the db selector property
 */
export class DbSelector {
  /**Creates a new DbSelctor */
  static create(): DbSelector {
    return new DbSelector();
  }

  static createOr(): DbSelector {
    const selector = new DbSelector();
    selector.withSelectorProperty('$or');
    return selector;
  }

  static createWithProperty<TValue>(field: string | ((model: IEntity) => TValue), item: string | { propertyName: string, value: any }): DbSelector {
    const selector = new DbSelector();
    return selector.withProperty(Utilities.getPropertyName(field)).withValue(item).on();
  }

  static createWithObjectValue<TValue>(field: string | ((model: IEntity) => TValue), item: any = {}): DbSelector {
    const selector = new DbSelector();
    return selector.withProperty(Utilities.getPropertyName(field)).withObjectValue(item).on();
  }

  constructor(private selectorObject: any = {}) {
  }

  /**Gets the existing selector */
  get selector(): any {
    return this.selectorObject;
  }

  /**
   * Creates the property based on the field passed.
   * @param field Name of the field to be used
   */
  withProperty<TValue>(field: string | ((model: IEntity) => TValue)): DbSelectorValue {
    Assert.isTruthy(field, 'DbSelector: Property field cannot be null/empty');
    const name = Utilities.getPropertyName(field);
    return new DbSelectorValue(this, this.selectorObject, name);
  }

  /**
   * Creates the property based on the field passed
   * @param field Name of the field to be used
   */
  withSelectorProperty<TValue>(field: string | ((model: IEntity) => TValue)): DbSelectorAsValue {
    Assert.isTruthy(field, 'DbSelector: Property field cannot be null/empty');
    const name = Utilities.getPropertyName(field);
    return new DbSelectorAsValue(this, this.selectorObject, name);
  }


}


/**Encapsulates all the parameters for a query */
export class DbQueryObject {

  /**Gets/sets the items to queried on */
  selector: any;

  /**Gets/sets the fields to be returned */
  fields: string[];

  /**Gets/sets the fields to have sorted by and the sort order (asc/desc) */
  sort: any[];

  /**Gets/sets the maximum rows/documents to return */
  limit: number;

  /**The index that should be used */
  use_index: string;

  constructor(selector: DbSelector | any, fields: string[] = [], sort: any[] = [], limit: number = undefined, use_index: string = undefined) {
    this.selector = (!!selector.selector) ? selector.selector : selector;
    this.fields = fields || [];
    this.sort = sort || [];
    this.limit = (!limit || limit < 1) ? undefined : limit;
    this.use_index = (!use_index) ? undefined : use_index;
  }
}

/**Encapsulation of fetch all options */
export interface IDbFetchOptions {
  /**Include the document itself in each row in the doc field. Otherwise by default you only get the _id and _rev properties. */
  include_docs: boolean;

  /**Get documents with IDs in a certain range (inclusive/inclusive). */
  startkey: string;

  /**Get documents with IDs in a certain range (inclusive/inclusive). */
  endkey: string;

  /**Maximum number of documents to return. */
  limit: number;

  /**Number of docs to skip before returning (warning: poor performance on IndexedDB/LevelDB!). */
  skip: number;

  /**Reverse the order of the output documents. Note that the order of startkey and endkey is reversed when descending:true. */
  descending: boolean;

  /**Only return documents with IDs matching this string key. */
  key: string;

  /**Array of string keys to fetch in a single shot. */
  keys: string[];
}

/**Implementation of IDbFetchOptions */
export class DbFetchOptions implements IDbFetchOptions {

  /**Include the document itself in each row in the doc field. Otherwise by default you only get the _id and _rev properties. */
  include_docs: boolean = false;

  /**Get documents with IDs in a certain range (inclusive/inclusive). */
  startkey: any;

  /**Get documents with IDs in a certain range (inclusive/inclusive). */
  endkey: any;

  /**Maximum number of documents to return. */
  limit: number;

  /**Number of docs to skip before returning (warning: poor performance on IndexedDB/LevelDB!). */
  skip: number;

  /**Reverse the order of the output documents. Note that the order of startkey and endkey is reversed when descending:true. */
  descending: boolean;

  /**Only return documents with IDs matching this string key. */
  key: any;

  /**Array of string keys to fetch in a single shot. */
  keys: any[];
}

/**Applies a wild card to end of a string */
export function applyWildCard(data: string): string {
  return data + '\ufff0';
}
