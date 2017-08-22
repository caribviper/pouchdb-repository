import { Entity, IEntityMapBuilder } from 'caribviper-entities';
import { IDbResponse, IDbError, DbQueryObject, IDbFetchOptions } from './../data/data-objects';
import { DatabaseObject } from './../data/database-object';
/**Creates a new repository */
export declare class Repository {
    private dbo;
    /**
     * Create a new Repository
     * @param dbo Database object to be used
     */
    constructor(dbo: DatabaseObject);
    /**Gets the database used */
    private readonly db;
    /**
     * Saves an entity/document to the database
     * @param entity Entity/document to be saved
     * @param dbGenerateId Indicates to use a database generated id if id is missing
     */
    save<T extends Entity>(entity: T, dbGenerateId?: boolean, mapBuilder?: IEntityMapBuilder<T>): Promise<T>;
    /**
     * Saves an entity without checking for the newest revision first.
     * Has the greatest chances of having a conflict
     * @param entity Entity to be saved
     */
    quickSave<T extends Entity>(entity: T, mapBuilder?: IEntityMapBuilder<T>): Promise<T>;
    /**
     * Removes an entity/document from the database
     * @param entity Entity to be removed
     */
    delete(id: string): Promise<boolean | IDbError>;
    /**
     * Gets the requested entity
     * @param id Id of the entity/document to be fetched
     */
    get<T extends Entity>(id: any, mapBuilder?: IEntityMapBuilder<T>): Promise<T>;
    /**
     * Searches the database based on the criteria passed
     * @param query DbQueryObject specifying the criteria to be searched on
     */
    find<T extends Entity>(query: DbQueryObject, mapBuilder?: IEntityMapBuilder<T>): Promise<T[]>;
    /**
     * Get all entities within the document of the desired type
     * @param options Options used to aide in the retrieval of data
     */
    fetchAllByType<T extends Entity>(options?: IDbFetchOptions, mapBuilder?: IEntityMapBuilder<T>): Promise<T[]>;
    /**
     * Get all entities within the document
     * @param options Options used to aide in the retrieval of data
     */
    fetchAll(options?: IDbFetchOptions): Promise<any[]>;
    queryByType<T extends Entity>(view: string, options?: IDbFetchOptions, mapBuilder?: IEntityMapBuilder<T>): Promise<T[]>;
    query(view: string, options?: IDbFetchOptions): Promise<any[]>;
    /**
     * Creates, updates or delete documents in bulk
     * @param docs Documents to be created/updated/deleted
     */
    bulkDocs(docs: any[]): Promise<IDbResponse[]>;
    /**
     * Creates a new db error
     * @param error Error type
     * @param reason Reason error occurred
     */
    private generateError(error, reason?);
    /**
     * Creates a new db unknown error
     */
    private generateUnknownError();
    /**
     * Creates a new error message
     * @param error Error message
     * @param reason Reason for error`
     */
    static createError(error: string, reason?: string): IDbError;
}
