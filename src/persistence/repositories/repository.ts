import { EntityMaps } from './../../models/entity-maps';
import { Assert } from './../../common/assert';
import { IDbResponse, IDbError, DbQueryObject, IDbDocumentResultsGeneric, IDbFetchOptions, IDbDocumentResults, IDbQueryResultGeneric } from './../data/data-objects';
import { Entity, IEntity, IEntityMapBuilder } from './../../models/entity';
import { DatabaseObject } from './../data/database-object';
import * as PouchDB from 'pouchdb';

/**Creates a new repository */
export class Repository {
  /**
   * Create a new Repository
   * @param dbo Database object to be used
   */
  constructor(private dbo: DatabaseObject) { }

  /**Gets the database used */
  private get db(): PouchDB {
    return this.dbo.database;
  }

  /**
   * Saves an entity/document to the database
   * @param entity Entity/document to be saved
   * @param dbGenerateId Indicates to use a database generated id if id is missing
   */
  public async save<T extends Entity>(entity: T, dbGenerateId: boolean = true, mapBuilder: IEntityMapBuilder<T> = undefined): Promise<T> {
    if (!entity._id && !dbGenerateId)
      throw this.generateError('Failed to create entity', 'Invalid entity id');

    //validate entity
    entity.validateEntity();

    //new entity
    if (entity.hasType && !entity._id && dbGenerateId) {
      try {
        let response: IDbResponse = await this.db.post(entity);
        if (response.ok) {
          entity._rev = response.rev;
          entity._id = response.id;
          return EntityMaps.mapEntityMap(mapBuilder, entity);
        }
        throw this.generateUnknownError();
      } catch (error) {
        throw this.generateError('Failed to save', 'Unable to save entity');
      }
    }
    //saving existing entity
    else {
      try {
        if (entity.isTransient)
          throw this.generateError('Failed to save', 'Entity is transient');

        let orginalEntity: T = await this.db.get(entity._id);
        entity._rev = orginalEntity._rev;
        let response: IDbResponse = await this.db.put(entity);
        if (response.ok) {
          entity._rev = response.rev;
          return EntityMaps.mapEntityMap(mapBuilder, entity);
        }
        throw this.generateError('Failed to save', 'Unknown error occurred');
      } catch (error) {
        throw this.generateError('Failed to save', 'Unknown error occurred');
      }
    }
  }

  /**
   * Saves an entity without checking for the newest revision first.
   * Has the greatest chances of having a conflict
   * @param entity Entity to be saved
   */
  public async quickSave<T extends Entity>(entity: T, mapBuilder: IEntityMapBuilder<T> = undefined): Promise<T> {
    try {
      if (entity.isTransient)
        throw this.generateError('Failed to save', 'Entity is transient');

      //validate entity
      entity.validateEntity();

      let response: IDbResponse = await this.db.put(entity);
      if (response.ok) {
        entity._id = response.id;
        entity._rev = response.rev;
        return EntityMaps.mapEntityMap(mapBuilder, entity);
      }
      throw this.generateUnknownError();
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  /**
   * Removes an entity/document from the database
   * @param entity Entity to be removed
   */
  public async delete(id: string): Promise<boolean | IDbError> {
    try {
      //check if entity exists
      let entity: Entity;
      try {
        entity = await this.db.get(id);
      } catch (error) {
        throw this.generateError('Unable to delete entity.', 'Possibly invalid id for entity');
      }
      //entity exists so delete it
      let response: IDbResponse = await this.db.remove(entity);
      return response.ok;
    } catch (error) {
      return this.generateError('Unable to delete entity');
    }
  }

  /**
   * Gets the requested entity
   * @param id Id of the entity/document to be fetched
   */
  public async get<T extends Entity>(id, mapBuilder: IEntityMapBuilder<T> = undefined): Promise<T> {
    if (!id)
      throw this.generateError('Unable to fetch requested entity due to invalid id');
    try {
      let result = await this.db.get(id);
      return EntityMaps.mapEntityMap(mapBuilder, result);
    } catch (error) {
      throw this.generateError('Unable to fetch requested entity');
    }
  }

  /**
   * Searches the database based on the criteria passed
   * @param query DbQueryObject specifying the criteria to be searched on
   */
  public async find<T extends Entity>(query: DbQueryObject, mapBuilder: IEntityMapBuilder<T> = undefined): Promise<T[]> {
    try {
      let results: IDbQueryResultGeneric<T> = await this.db.find(query);
      if (!results)
        throw new Error();
      return EntityMaps.mapEntityMapArray(mapBuilder, results.docs);
    } catch (error) {
      throw this.generateError('An error occurred executing the query')
    }
  }

  /**
   * Get all entities within the document of the desired type
   * @param options Options used to aide in the retrieval of data
   */
  public async fetchAllByType<T extends Entity>(options: IDbFetchOptions = undefined, mapBuilder: IEntityMapBuilder<T> = undefined): Promise<T[]> {
    try {
      if (!options) {
        let results: IDbDocumentResults = await this.db.allDocs();
        return results.rows;
      }
      else {
        options.include_docs = true;
        let results: IDbDocumentResults = await this.db.allDocs(options);
        let entities: T[] = [];
        results.rows.forEach(row => {
          entities.push(EntityMaps.mapEntityMap(mapBuilder, row.doc));
        });
        return entities;
      }
    } catch (error) {
      throw this.generateError('An error occurred fetching the entities');
    }
  }

  /**
   * Get all entities within the document
   * @param options Options used to aide in the retrieval of data
   */
  public async fetchAll(options: IDbFetchOptions = undefined): Promise<any[]> {
    try {
      let results: IDbDocumentResults = (!options) ? await this.db.allDocs() : await this.db.allDocs(options);
      return results.rows;
    } catch (error) {
      throw this.generateError('An error occurred fetching the entities');
    }
  }

  /**
   * Creates, updates or delete documents in bulk
   * @param docs Documents to be created/updated/deleted
   */
  public async bulkDocs(docs: any[]): Promise<IDbResponse[]> {
    if (!docs || docs.length < 1)
      throw this.generateError('Bulk doc error', 'Unable to execute bulk document request due to empty docs parameter');
    return await this.db.bulkDocs(docs);
  };

  /**
   * Creates a new db error
   * @param error Error type
   * @param reason Reason error occurred
   */
  private generateError(error: string, reason: string = ''): IDbError {
    return Repository.createError(error, reason);
  }
  /**
   * Creates a new db unknown error
   */
  private generateUnknownError(): IDbError {
    return Repository.createError('Unknown error occurred');
  }

  /**
   * Creates a new error message
   * @param error Error message
   * @param reason Reason for error`
   */
  public static createError(error: string, reason: string = ''): IDbError {
    Assert.isTruthy(error, 'Error for error message cannot be null/empty');
    let e: IDbError = {
      error: error,
      reason: !reason ? error : reason
    };
    return e;
  }

}
