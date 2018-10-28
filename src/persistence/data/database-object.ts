import { IDbInfo, IDbError } from './data-objects';
import { Assert } from 'caribviper-common';
import * as PouchDB from 'pouchdb';
import * as PouchDbFind from 'pouchdb-find';

/**
 * Creates a new DatabaseServerConnection object
 */
export class DatabaseServerConnection {
  /**
   * Creates a new DatabaseServerConnection
   * @param server Host or location of the server
   * @param databaseName Name of the database trying to connection to
   * @param user Username to connect to the database
   * @param password Password associated with the database
   * @param timeout Time out period
   * @param secure Indicates whether the connection should be secured. Defaults to false
   */
  constructor(public readonly server: string, public readonly databaseName: string, public readonly user: string, public readonly password: string, public readonly timeout: number, public readonly secure: boolean = false) {
  }
  
  /**
   * Creates a new DatabaseServerConnection with an existing connection and a new database
   * @param oldConnection existing DatabaseServerConnection
   * @param newDatabase New database to be applied
   */
  public static createNewConnection(oldConnection: DatabaseServerConnection, newDatabase: string) : DatabaseServerConnection {
    return new DatabaseServerConnection(oldConnection.server, newDatabase, oldConnection.user, oldConnection.password, oldConnection.timeout, oldConnection.secure);
  }
}

export class DatabaseObject {
  private initialized: boolean = false;
  private _db: PouchDB;

  constructor(connection: string | DatabaseServerConnection) {
    PouchDB.plugin(PouchDbFind);
    if (!!connection) {
      if (typeof connection === 'string')
        this.connect(connection);
      else
        this.connect(connection.server, connection.databaseName, connection.user, connection.password);
    }
  }

  /**Gets whether the database has been initialised */
  get isInitialized(): boolean { return this.initialized; }

  /**Gets the database used */
  get database(): PouchDB {
    return this.initialized ? this._db : undefined;
  }

  public status: string = '';

  /**
   * Establishes the connection for remote host
   * @param connection Connection information required to connect to the database
   * @param databaseName Name of the database
   * @param user Username to use to connect to the database
   * @param password Password to connect to the database
   * @param timeout Timeout period to connect. Set to 10000 by default (maximum time)
   */
  connect(connection: string, databaseName: string = '', user: string = '', password: string = '', timeout: number = 10000) {
    let defaultConn: string = connection,
      dbName: string = databaseName;
    this.status = this.status + 'creating connectionn\n';
    Assert.isTrue((!!user && !!password) || (!user && !password), 'Both the username and password must be specified to user user/password credentials');

    this.status = this.status + 'passed user|password\n';
    if (!!user) {
      if (!!dbName) {
        dbName = dbName.replace('/\//g', '');
        if (!!dbName)
          dbName = `/${dbName}`;
        dbName = dbName.toLowerCase();
      }
      let location: string = connection.replace('http://', '');
      defaultConn = `http://${user}:${password}@${location}${dbName}`;

      this.status = this.status + 'connection ' + defaultConn + '\n';
    }
    this._db = new PouchDB(defaultConn, {
      ajax: {
        cache: false,
        timeout: !timeout || timeout < 1000 || timeout > 10000 ? 10000 : timeout
      }
    });
    this.initialized = true;
  }

  /**
   * Closes the existing database
   */
  close(): Promise<void> {
    if (!!this._db)
      return this._db.close();
  }

  /**
   * Get the database information
   */
  info(): Promise<IDbInfo> {
    return this.database.info().then((result: IDbInfo) => {
      return result;
    }).catch((err: IDbError) => {
      return Promise.reject(err);
    });
  }
}


