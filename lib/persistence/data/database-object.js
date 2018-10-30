"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var caribviper_common_1 = require("caribviper-common");
var PouchDB = require("pouchdb");
var PouchDbFind = require("pouchdb-find");
/**
 * Creates a new DatabaseServerConnection object
 */
var DatabaseServerConnection = (function () {
    /**
     * Creates a new DatabaseServerConnection
     * @param server Host or location of the server
     * @param databaseName Name of the database trying to connection to
     * @param user Username to connect to the database
     * @param password Password associated with the database
     * @param secure Indicates whether the connection should be secured. Defaults to false
     * @param timeout Time out period
     */
    function DatabaseServerConnection(server, databaseName, user, password, secure, timeout) {
        if (secure === void 0) { secure = false; }
        if (timeout === void 0) { timeout = 10000; }
        this.server = server;
        this.databaseName = databaseName;
        this.user = user;
        this.password = password;
        this.secure = secure;
        this.timeout = timeout;
    }
    /**
     * Creates a new DatabaseServerConnection with an existing connection and a new database
     * @param oldConnection existing DatabaseServerConnection
     * @param newDatabase New database to be applied
     */
    DatabaseServerConnection.createNewConnection = function (oldConnection, newDatabase) {
        return new DatabaseServerConnection(oldConnection.server, newDatabase, oldConnection.user, oldConnection.password, oldConnection.secure, oldConnection.timeout);
    };
    return DatabaseServerConnection;
}());
exports.DatabaseServerConnection = DatabaseServerConnection;
var DatabaseObject = (function () {
    function DatabaseObject(connection) {
        this.initialized = false;
        this.status = '';
        PouchDB.plugin(PouchDbFind);
        if (!!connection) {
            if (typeof connection === 'string')
                this.connect(connection);
            else
                this.connect(connection.server, connection.databaseName, connection.user, connection.password, connection.secure);
        }
    }
    Object.defineProperty(DatabaseObject.prototype, "isInitialized", {
        /**Gets whether the database has been initialised */
        get: function () { return this.initialized; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatabaseObject.prototype, "database", {
        /**Gets the database used */
        get: function () {
            return this.initialized ? this._db : undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Establishes the connection for remote host
     * @param connection Connection information required to connect to the database
     * @param databaseName Name of the database
     * @param user Username to use to connect to the database
     * @param password Password to connect to the database
     * @param timeout Timeout period to connect. Set to 10000 by default (maximum time)
     */
    DatabaseObject.prototype.connect = function (connection, databaseName, user, password, secure, timeout) {
        if (databaseName === void 0) { databaseName = ''; }
        if (user === void 0) { user = ''; }
        if (password === void 0) { password = ''; }
        if (secure === void 0) { secure = false; }
        if (timeout === void 0) { timeout = 10000; }
        var defaultConn = connection, dbName = databaseName;
        this.status = this.status + 'creating connectionn\n';
        caribviper_common_1.Assert.isTrue((!!user && !!password) || (!user && !password), 'Both the username and password must be specified to user user/password credentials');
        this.status = this.status + 'passed user|password\n';
        if (!!user) {
            if (!!dbName) {
                dbName = dbName.replace('/\//g', '');
                if (!!dbName)
                    dbName = "/" + dbName;
                dbName = dbName.toLowerCase();
            }
            var location_1 = connection.replace('http://', '').replace('https://', '');
            defaultConn = "http" + (secure ? 's' : '') + "://" + user + ":" + password + "@" + location_1 + dbName;
            this.status = this.status + 'connection ' + defaultConn + '\n';
        }
        this._db = new PouchDB(defaultConn, {
            ajax: {
                cache: false,
                timeout: !timeout || timeout < 1000 || timeout > 10000 ? 10000 : timeout
            }
        });
        this.initialized = true;
    };
    /**
     * Closes the existing database
     */
    DatabaseObject.prototype.close = function () {
        if (!!this._db)
            return this._db.close();
    };
    /**
     * Get the database information
     */
    DatabaseObject.prototype.info = function () {
        return this.database.info().then(function (result) {
            return result;
        }).catch(function (err) {
            return Promise.reject(err);
        });
    };
    return DatabaseObject;
}());
exports.DatabaseObject = DatabaseObject;
