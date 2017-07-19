import { IDbInfo } from './data-objects';
import * as PouchDB from 'pouchdb';
export declare class DatabaseObject {
    private initialized;
    private _db;
    constructor(connection: string | {
        server: string;
        databaseName: string;
        user: string;
        password: string;
    });
    /**Gets whether the database has been initialised */
    readonly isInitialized: boolean;
    /**Gets the database used */
    readonly database: PouchDB;
    status: string;
    /**
     * Establishes the connection for remote host
     * @param connection Connection information required to connect to the database
     */
    connect(connection: string, databaseName?: string, user?: string, password?: string): void;
    /**
     * Closes the existing database
     */
    close(): Promise<void>;
    /**
     * Get the database information
     */
    info(): Promise<IDbInfo>;
}
