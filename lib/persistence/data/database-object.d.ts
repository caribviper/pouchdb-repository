import { IDbInfo } from './data-objects';
import * as PouchDB from 'pouchdb';
/**
 * Creates a new DatabaseServerConnection object
 */
export declare class DatabaseServerConnection {
    readonly server: string;
    readonly databaseName: string;
    readonly user: string;
    readonly password: string;
    readonly secure: boolean;
    readonly timeout: number;
    /**
     * Creates a new DatabaseServerConnection
     * @param server Host or location of the server
     * @param databaseName Name of the database trying to connection to
     * @param user Username to connect to the database
     * @param password Password associated with the database
     * @param secure Indicates whether the connection should be secured. Defaults to false
     * @param timeout Time out period
     */
    constructor(server: string, databaseName: string, user: string, password: string, secure?: boolean, timeout?: number);
    /**
     * Creates a new DatabaseServerConnection with an existing connection and a new database
     * @param oldConnection existing DatabaseServerConnection
     * @param newDatabase New database to be applied
     */
    static createNewConnection(oldConnection: DatabaseServerConnection, newDatabase: string): DatabaseServerConnection;
}
export declare class DatabaseObject {
    private initialized;
    private _db;
    constructor(connection: string | DatabaseServerConnection);
    /**Gets whether the database has been initialised */
    readonly isInitialized: boolean;
    /**Gets the database used */
    readonly database: PouchDB;
    status: string;
    /**
     * Establishes the connection for remote host
     * @param connection Connection information required to connect to the database
     * @param databaseName Name of the database
     * @param user Username to use to connect to the database
     * @param password Password to connect to the database
     * @param timeout Timeout period to connect. Set to 10000 by default (maximum time)
     */
    connect(connection: string, databaseName?: string, user?: string, password?: string, secure?: boolean, timeout?: number): void;
    /**
     * Closes the existing database
     */
    close(): Promise<void>;
    /**
     * Get the database information
     */
    info(): Promise<IDbInfo>;
}
