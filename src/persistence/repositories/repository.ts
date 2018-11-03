import { Assert } from 'caribviper-common';
import { Entity, IEntity, IEntityMapBuilder, EntityMaps } from 'caribviper-entity';
import { IDbResponse, IDbError, DbQueryObject, IDbDocumentResultsGeneric, IDbFetchOptions, IDbDocumentResults, IDbQueryResultGeneric } from './../data/data-objects';
import { LuceneFetchOptions, LuceneFetchResults, LuceneScoredRow } from './../data/lucene-data-objects';
import { DatabaseObject } from './../data/database-object';
import * as PouchDB from 'pouchdb';
import * as request from 'request';
import { RequestCallback } from 'request';

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
        if (!!error.error)
          throw new Error(error.error);
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
        if (!!error.error)
          throw new Error(error.error);
        throw this.generateError('Unable to delete entity.', 'Possibly invalid id for entity');
      }
      //entity exists so delete it
      let response: IDbResponse = await this.db.remove(entity);
      return response.ok;
    } catch (error) {
      throw this.generateError('Unable to delete entity');
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
      if (!!error.error)
        throw new Error(error.error);
      throw this.generateError('Unable to fetch requested entity');
    }
  }

  /**
   * Searches the database based on the criteria passed
   * @param query DbQueryObject specifying the criteria to be searched on
   */
  public async find<T extends Entity>(query: DbQueryObject, mapBuilder: IEntityMapBuilder<T> = undefined, retryAttempts: number = 3): Promise<T[]> {
    try {
      let results: IDbQueryResultGeneric<T> = await this.db.find(query);
      if (!results)
        throw new Error();
      return EntityMaps.mapEntityMapArray(mapBuilder, results.docs);
    } catch (error) {
      //we are retrying
      if ((error.error === 'too_many_requests' || error.status === 429 || error.status === 500) && retryAttempts > 1) {
        return await this.find(query, mapBuilder, --retryAttempts);
      }
      throw this.generateError('An error occurred executing the query')
    }
  }

  /**
   * Get all entities within the document of the desired type
   * @param options Options used to aide in the retrieval of data
   */
  public async fetchAllByType<T extends Entity>(options: IDbFetchOptions = undefined, mapBuilder: IEntityMapBuilder<T> = undefined, retryAttempts: number = 3): Promise<T[]> {
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
      //we are retrying
      if ((error.error === 'too_many_requests' || error.status === 429 || error.status === 500) && retryAttempts > 1) {
        return await this.fetchAllByType(options, mapBuilder, --retryAttempts);
      }
      throw this.generateError('An error occurred fetching the entities');
    }
  }

  /**
   * Get all entities within the result returning only documents
   * @param options Options used to aide in the retrieval of data
   */
  public async fetchAll(options: IDbFetchOptions = undefined, retryAttempts: number = 3): Promise<any[]> {
    try {
      let results: IDbDocumentResults = (!options) ? await this.db.allDocs() : await this.db.allDocs(options);
      if (options.include_docs) {
        let rows = [];
        results.rows.forEach((row) => {
          rows.push(row.doc);
        });
        return rows;
      }
      else
        return results.rows;
    } catch (error) {
      //we are retrying
      if ((error.error === 'too_many_requests' || error.status === 429 || error.status === 500) && retryAttempts > 1) {
        return await this.fetchAll(options, --retryAttempts);
      }
      throw this.generateError('An error occurred fetching the entities');
    }
  }

  public async queryByType<T extends Entity>(view: string, options: IDbFetchOptions = undefined, mapBuilder: IEntityMapBuilder<T> = undefined, retryAttempts: number = 3): Promise<T[]> {
    try {
      if (!options) {
        let results: IDbDocumentResults = await this.db.query(view);
        return results.rows;
      }
      else {
        options.include_docs = true;
        let results: IDbDocumentResults = await this.db.query(view, options);
        let entities: T[] = [];
        results.rows.forEach(row => {
          entities.push(EntityMaps.mapEntityMap(mapBuilder, row.doc));
        });
        return entities;
      }
    } catch (error) {
      //we are retrying
      if ((error.error === 'too_many_requests' || error.status === 429 || error.status === 500) && retryAttempts > 1) {
        return await this.queryByType(view, options, mapBuilder, --retryAttempts);
      }
      throw this.generateError('An error occurred fetching the entities from the view');
    }
  }

  public async query(view: string, options: IDbFetchOptions = undefined, retryAttempts: number = 3): Promise<any[]> {
    try {
      let results: IDbDocumentResults = (!options) ? await this.db.query(view) : await this.db.query(view, options);
      return results.rows;
    } catch (error) {
      //we are retrying
      if ((error.error === 'too_many_requests' || error.status === 429 || error.status === 500) && retryAttempts > 1) {
        return await this.query(view, options, --retryAttempts);
      }
      throw this.generateError('An error occurred fetching the entities from the view');
    }
  }

  /**
   * Executes a query against the specified lucene server and couchdb database
   * @param options LuceneFetchOptions required to perform search
   * @param mapBuilder Entity mapping data
   */
  public async luceneQuery<T extends Entity>(options: LuceneFetchOptions, mapBuilder: IEntityMapBuilder<T> = undefined, retryAttempts: number = 3): Promise<LuceneFetchResults> {
    try {
      if (!options)
        throw new Error('Invalid Lucene Fetch Options');

      let result: LuceneFetchResults = await this.executeLuceneSearch(options.url, options.secure);
      //map
      for (let i = 0; i < result.rows.length; i++) {
        result.rows[i] = LuceneScoredRow.clone(result.rows[i]);
        if (!!result.rows[i].doc)
          result.rows[i].doc = EntityMaps.mapEntityMap(mapBuilder, result.rows[i].doc);
      }
      return result;

    } catch (error) {
      //we are retrying
      if ((error.error === 'too_many_requests' || error.status === 429 || error.status === 500) && retryAttempts > 1) {
        return await this.luceneQuery(options, mapBuilder, --retryAttempts);
      }
      throw this.generateError('An error occurred fetching the entities from the lucene index');
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

  /**
  * Executes a lucene search
  * @param url Url to the resource
  * @param secure Determines whether to use http/https
  */
  private executeLuceneSearch(url: string, secure: boolean = false): Promise<any> {
    let data;
    return new Promise((resolve, reject) => {
      if (url.indexOf('http:') !== 0 && url.indexOf('https:') !== 0) {
        url = `http${secure ? 's' : ''}://` + url;
      }
      request(url, null, (error, res, body) => {
        if (!!error)
          return reject(error);
        if (!body)
          return resolve(JSON.parse('{}'));
        return resolve(JSON.parse(body));
      });
    });

  }

}
