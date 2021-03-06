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
    docs: any;
}
/**Get the result from a query */
export interface IDbQueryResult extends IBaseDbQueryResult {
    /**Array of document results */
    docs: any[];
}
/**Get the result from a query with Generics */
export declare class IDbQueryResultGeneric<T> implements IBaseDbQueryResult {
    /**Array of document results */
    docs: T[];
}
/**Manages db selector values */
export declare class DbSelectorValue {
    private selector;
    private propertyContainer;
    private propertyName;
    /**
     *
     * @param selector DbSelector that stores the parent object
     * @param propertyContainer Property container object that stores all properties and valuees
     * @param propertyName Property container value to be used
     */
    constructor(selector: DbSelector, propertyContainer: any, propertyName: string);
    private property;
    /**
     * Adds a value item to the property
     * @param item Value item to be added
     */
    withValue(item: string | number | boolean | {
        propertyName: string;
        value: string | number | boolean;
    }): DbSelectorValue;
    /**
     * Adds an object as a value item
     * @param item DbSelector to be used with the property
     */
    withObjectValue(item: any): DbSelectorValue;
    /**Gets the selector */
    on(): DbSelector;
    /**
     * Create an object with the specified field and value.
     * @param field Name of the field to be used
     * @param value Value to be applied to specified field
     */
    static createPropertyValue<TValue>(field: string | ((model: IEntity) => TValue), value: any): {};
    /**
     * Create an array of objects with specified properties and values
     * @param fields Array of names of the field properties
     * @param values Array of values for the corresponding properties
     */
    static createPropertyArrayValue<TValue>(fields: string[] | ((model: IEntity) => TValue)[], values: any[]): {}[];
}
/**Manages db selector values used mainly for Or/And */
export declare class DbSelectorAsValue {
    private selector;
    private propertyContainer;
    private propertyName;
    /**
     *
     * @param selector DbSelector that stores the parent object
     * @param propertyContainer Property container object that stores all properties and values
     * @param propertyName Property container value to be used
     */
    constructor(selector: DbSelector, propertyContainer: any, propertyName: string);
    private property;
    /**
     * Adds a dbselector as a value item
     * @param item DbSelector to be used with the property
     */
    withSelector(item: DbSelector): DbSelectorAsValue;
    /**
     * Adds an object as a value item
     * @param item DbSelector to be used with the property
     */
    withObject(item: any): DbSelectorAsValue;
    /**
     * Adds an array of objects as the value items
     * @param items An array of objects to be used with the property
     */
    withObjectArray(items: any[]): DbSelectorAsValue;
    /**
     * Adds a new object as a value item
     * @param field Name of the property of the new object to be inserted
     * @param value Value of the property of the new object to be inserted
     */
    withObjectValue<TValue>(field: string | ((model: IEntity) => TValue), value: any): DbSelectorAsValue;
    on(): DbSelector;
}
/**
 * Manages the db selector property
 */
export declare class DbSelector {
    private selectorObject;
    /**Creates a new DbSelctor */
    static create(): DbSelector;
    static createOr(): DbSelector;
    static createWithProperty<TValue>(field: string | ((model: IEntity) => TValue), item: string | {
        propertyName: string;
        value: any;
    }): DbSelector;
    static createWithObjectValue<TValue>(field: string | ((model: IEntity) => TValue), item?: any): DbSelector;
    constructor(selectorObject?: any);
    /**Gets the existing selector */
    readonly selector: any;
    /**
     * Creates the property based on the field passed.
     * @param field Name of the field to be used
     */
    withProperty<TValue>(field: string | ((model: IEntity) => TValue)): DbSelectorValue;
    /**
     * Creates the property based on the field passed
     * @param field Name of the field to be used
     */
    withSelectorProperty<TValue>(field: string | ((model: IEntity) => TValue)): DbSelectorAsValue;
    /**Creates an 'Or' property selector 'or' queries */
    withSelectorPropertyOr(): DbSelectorAsValue;
    /**Creates an Andr' property selector 'and' queries */
    withSelectorPropertyAnd(): DbSelectorAsValue;
    /**
     * Changes the specified property value to the new one passed
     * @param field Name of the field to be used
     * @param value New value to be given to property
     */
    changePropertyValue<TValue>(field: string | ((model: IEntity) => TValue), value: any): void;
    /**
     * Removes a property from the selector
     * @param field Name of field to be removed`
     */
    removeProperty<TValue>(field: string | ((model: IEntity) => TValue)): void;
}
/**Manages sort creation options */
export declare class DbSortManager {
    /**
     * Gets the field name of the property to be sorted
     * @param field Name of property to be sorted
     */
    static createSortValue<TValue>(field: string | ((model: IEntity) => TValue)): string;
    /**
     * Gets the field names of the properties to be sorted
     * @param fields Names of the fields to be sorted
     */
    static createSortArray<TValue>(fields: ((model: IEntity) => TValue)[]): string[];
}
/**Encapsulates all the parameters for a query */
export declare class DbQueryObject {
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
    constructor(selector: DbSelector | any, fields?: string[], sort?: any[], limit?: number, use_index?: string);
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
export declare class DbFetchOptions implements IDbFetchOptions {
    /**Include the document itself in each row in the doc field. Otherwise by default you only get the _id and _rev properties. */
    include_docs: boolean;
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
export declare function applyWildCard(data: string): string;
