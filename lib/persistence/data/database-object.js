"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var caribviper_common_1 = require("caribviper-common");
var PouchDB = require("pouchdb");
var PouchDbFind = require("pouchdb-find");
var DatabaseObject = (function () {
    function DatabaseObject(connection) {
        this.initialized = false;
        this.status = '';
        PouchDB.plugin(PouchDbFind);
        if (!!connection) {
            if (typeof connection === 'string')
                this.connect(connection);
            else
                this.connect(connection.server, connection.databaseName, connection.user, connection.password);
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
     */
    DatabaseObject.prototype.connect = function (connection, databaseName, user, password) {
        if (databaseName === void 0) { databaseName = ''; }
        if (user === void 0) { user = ''; }
        if (password === void 0) { password = ''; }
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
            var location_1 = connection.replace('http://', '');
            defaultConn = "http://" + user + ":" + password + "@" + location_1 + dbName;
            this.status = this.status + 'connection ' + defaultConn + '\n';
        }
        this._db = new PouchDB(defaultConn, {
            ajax: {
                cache: false
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
