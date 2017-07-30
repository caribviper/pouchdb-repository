import { IDbInfo, IDbError } from './data-objects';
import { Assert } from 'caribviper-common';
import * as PouchDB from 'pouchdb';
import * as PouchDbFind from 'pouchdb-find';


export class DatabaseObject {
  private initialized: boolean = false;
  private _db: PouchDB;

  constructor(connection: string | { server: string, databaseName: string, user: string, password: string }) {
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
   */
  connect(connection: string, databaseName: string = '', user: string = '', password: string = '') {
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
        cache: false
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


