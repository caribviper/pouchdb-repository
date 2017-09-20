import { Utilities, Assert, StringUtilities } from 'caribviper-common';
import { Entity, IEntityMapBuilder, EntityMaps } from 'caribviper-entity';


/**Implementation for Lucene searches against the db */
export class LuceneFetchOptions {
  /**
   * Creates a lucene fetch option
   * @param luceneServer Location to the lucene server
   * @param databaseName Name of the database to execute fetch against
   * @param indexPath Path to the index e.g. lucene\by_name
   * @param q Query parameter being sought
   * @param include_docs Indicates whether to include documents
   * @param limit Specify the default limit of records to return, default is 25
   * @param skip Number of th records to skip
   */
  constructor(public luceneServer: string, public databaseName: string, public indexPath: string, public q: string, public include_docs: boolean = false, public limit: number = 25, public skip: number = 0) {
    Assert.isTruthy(this.luceneServer, 'Index url cannot be null/empty')
    Assert.isTruthy(this.databaseName, 'Database name cannot be null/empty');
    Assert.isTruthy(this.indexPath, 'Index path cannot be null/empty');
    Assert.isTruthy(this.q, 'Search parameter cannot be null/empty');
    if (!limit || limit < 1) limit = 25;
    if (!skip || skip < 0) skip = 0;
  }

  get url(): string {
    let query: string = StringUtilities.replaceAll(this.q,'/','//');
    query = StringUtilities.replaceAll(query, '\\*', '%2A');
    query = StringUtilities.replaceAll(query, '\\?', '%3F');
    let parameters = `?q=${query}&include_docs=${this.include_docs}&limit=${this.limit}&skip=${this.skip}`;
    let path = Utilities.join(this.luceneServer, this.databaseName, '_design', this.indexPath);
    path += parameters;
    return path;
  }
}

/**Implements a lucene scored row result */
export class LuceneScoredRow {
  score: number;
  doc: any;
  id: string;

  /**
   * Converts a document to the desired entity type
   * @param mapBuilder Entity type to convert to
   */
  convertDocument<T extends Entity>(mapBuilder: IEntityMapBuilder<T>): T {
    if(!!this.doc)
      return EntityMaps.mapEntityMap(mapBuilder, this.doc);
    return null;
  }

  /**
   * Clone a row to a new LuceneScoredRow
   * @param row Row to be cloned
   */
  public static clone(row: LuceneScoredRow) {
    return Object.assign(new LuceneScoredRow(), row);
  }

  /**
   * Assigns a  row to itself as new LuceneScoredRow
   * @param row 
   */
  public static reAssign(row: LuceneScoredRow) {
    row = this.clone(row);
  }
}

/**Fetch results from a lucene search */
export class LuceneFetchResults {
  q: string;
  fetch_duration: number;
  total_rows: number;
  limit: number
  search_duration: number;
  skip: number;
  rows: LuceneScoredRow[];
}
