import { Assert, Utilities } from 'caribviper-common';
import { IEntity } from 'caribviper-entity';

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

  /**Gets the selector */
  on(): DbSelector { return this.selector; }

  /**
   * Create an object with the specified field and value.
   * @param field Name of the field to be used
   * @param value Value to be applied to specified field
   */
  static createPropertyValue<TValue>(field: string | ((model: IEntity) => TValue), value: any): {} {
    Assert.isTruthy(field, 'DbSelectorValue: Property field cannot be null/empty');
    const name = Utilities.getPropertyName(field);
    let o = {};
    o[name] = value;
    return o;
  }

  /**
   * Create an array of objects with specified properties and values
   * @param fields Array of names of the field properties
   * @param values Array of values for the corresponding properties
   */
  static createPropertyArrayValue<TValue>(fields: string[] | ((model: IEntity) => TValue)[], values: any[]): {}[] {
    Assert.isTruthy(fields, 'DbSelectorValue: Property fields cannot be null/empty');
    Assert.isTruthy(values, 'DbSelectorValue: Property values cannot be null/empty');
    Assert.isTruthy(Array.isArray(fields), 'DbSelectorValue: fields must be an array');
    Assert.isTruthy(Array.isArray(values), 'DbSelectorValue: values must be an array');
    Assert.isTruthy(fields.length > 0, 'DbSelectorValue: fields empty');
    Assert.isTruthy(values.length > 0, 'DbSelectorValue: values empty');
    Assert.isTruthy(values.length === fields.length, 'DbSelectorValue: feilds and values must be the same length');
    let objs = [];
    for (let i = 0; i < fields.length; i++) {
      objs.push(this.createPropertyValue(fields[i], values[i]));
    }
    return objs;
  }

}


/**Manages db selector values used mainly for Or/And */
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
    this.property = [];
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

  /**
   * Adds an array of objects as the value items
   * @param items An array of objects to be used with the property
   */
  withObjectArray(items: any[]): DbSelectorAsValue {
    if (!items)
      throw new Error('DbSelectorAsValue: Cannot past a falsey items object to withObjectArray');
    items.forEach(item => {
      this.withObject(item);
    });
    return this;
  }

  /**
   * Adds a new object as a value item
   * @param field Name of the property of the new object to be inserted
   * @param value Value of the property of the new object to be inserted
   */
  withObjectValue<TValue>(field: string | ((model: IEntity) => TValue), value: any): DbSelectorAsValue {
    Assert.isTruthy(field, 'DbSelector: Property field cannot be null/empty');
    const name = Utilities.getPropertyName(field);
    if (!value)
      throw new Error('DbSelectorAsValue: Cannot past a falsey value object to withObjectValue');
    this.property.push(DbSelectorValue.createPropertyValue(field, value));
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

  /**Creates an 'Or' property selector 'or' queries */
  withSelectorPropertyOr(): DbSelectorAsValue {
    this.selectorObject['$or']
    return new DbSelectorAsValue(this, this.selectorObject, '$or');
  }

  /**Creates an Andr' property selector 'and' queries */
  withSelectorPropertyAnd(): DbSelectorAsValue {
    return new DbSelectorAsValue(this, this.selectorObject, '$and');
  }

  /**
   * Changes the specified property value to the new one passed
   * @param field Name of the field to be used
   * @param value New value to be given to property
   */
  changePropertyValue<TValue>(field: string | ((model: IEntity) => TValue), value: any) {
    Assert.isTruthy(field, 'DbSelector: Property field cannot be null/empty');
    const name = Utilities.getPropertyName(field);
    Assert.isTruthy(this.selectorObject[name], 'DbSelector: Property field passed does not exist', 'DbSelector');
    this.selectorObject[name] = value;
  }

  /**
   * Removes a property from the selector
   * @param field Name of field to be removed`
   */
  removeProperty<TValue>(field: string | ((model: IEntity) => TValue)) {
    Assert.isTruthy(field, 'DbSelector: Property field cannot be null/empty');
    const name = Utilities.getPropertyName(field);
    if (!!this.selectorObject[name])
      delete this.selectorObject[name];
  }


}

/**Manages sort creation options */
export class DbSortManager {

  /**
   * Gets the field name of the property to be sorted
   * @param field Name of property to be sorted
   */
  static createSortValue<TValue>(field: string | ((model: IEntity) => TValue)): string {
    return Utilities.getPropertyName(field);
  }

  /**
   * Gets the field names of the properties to be sorted
   * @param fields Names of the fields to be sorted
   */
  static createSortArray<TValue>(fields: ((model: IEntity) => TValue)[]): string[] {
    let arr: string[] = [];
    fields.forEach(field => {
      arr.push(this.createSortValue(field));
    });
    return arr;
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
