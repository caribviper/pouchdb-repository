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
        timeout: number;
    });
    /**Gets whether the database has been initialised */
    readonly isInitialized: boolean;
    /**Gets the database used */
    readonly database: PouchDB;
    status: string;
    /**
     *
     * Establishes the connection for remote host
     * @param connection Connection information required to connect to the database
     * @param databaseName Name of the database
     * @param user Username to use to connect to the database
     * @param password Password to connect to the database
     * @param timeout Timeout period to connect. Set to 10000 by default (maximum time)
     */
    connect(connection: string, databaseName?: string, user?: string, password?: string, timeout?: number): void;
    /**
     * Closes the existing database
     */
    close(): Promise<void>;
    /**
     * Get the database information
     */
    info(): Promise<IDbInfo>;
}
