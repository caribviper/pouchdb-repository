import { Entity, IEntityMapBuilder } from 'caribviper-entity';
/**Implementation for Lucene searches against the db */
export declare class LuceneFetchOptions {
    luceneServer: string;
    databaseName: string;
    indexPath: string;
    q: string;
    include_docs: boolean;
    limit: number;
    skip: number;
    secure: boolean;
    bookmark: string;
    /**
     * Creates a lucene fetch option
     * @param luceneServer Location to the lucene server
     * @param databaseName Name of the database to execute fetch against
     * @param indexPath Path to the index e.g. lucene\by_name
     * @param q Query parameter being sought
     * @param include_docs Indicates whether to include documents
     * @param limit Specify the default limit of records to return, default is 25
     * @param skip Number of th records to skip
     * @param secure Determines whether the url is send as https
     * @param bookmark Used in cloudant
     */
    constructor(luceneServer: string, databaseName: string, indexPath: string, q: string, include_docs?: boolean, limit?: number, skip?: number, secure?: boolean, bookmark?: string);
    readonly url: string;
}
/**Implements a lucene scored row result */
export declare class LuceneScoredRow {
    score: number;
    doc: any;
    id: string;
    /**
     * Converts a document to the desired entity type
     * @param mapBuilder Entity type to convert to
     */
    convertDocument<T extends Entity>(mapBuilder: IEntityMapBuilder<T>): T;
    /**
     * Clone a row to a new LuceneScoredRow
     * @param row Row to be cloned
     */
    static clone(row: LuceneScoredRow): LuceneScoredRow;
    /**
     * Assigns a  row to itself as new LuceneScoredRow
     * @param row
     */
    static reAssign(row: LuceneScoredRow): void;
}
/**Fetch results from a lucene search */
export declare class LuceneFetchResults {
    q: string;
    fetch_duration: number;
    total_rows: number;
    limit: number;
    search_duration: number;
    skip: number;
    rows: LuceneScoredRow[];
}
