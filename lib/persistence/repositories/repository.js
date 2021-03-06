"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var caribviper_common_1 = require("caribviper-common");
var caribviper_entity_1 = require("caribviper-entity");
var lucene_data_objects_1 = require("./../data/lucene-data-objects");
var request = require("request");
/**Creates a new repository */
var Repository = (function () {
    /**
     * Create a new Repository
     * @param dbo Database object to be used
     */
    function Repository(dbo) {
        this.dbo = dbo;
    }
    Object.defineProperty(Repository.prototype, "db", {
        /**Gets the database used */
        get: function () {
            return this.dbo.database;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Saves an entity/document to the database
     * @param entity Entity/document to be saved
     * @param dbGenerateId Indicates to use a database generated id if id is missing
     */
    Repository.prototype.save = function (entity, dbGenerateId, mapBuilder) {
        if (dbGenerateId === void 0) { dbGenerateId = true; }
        if (mapBuilder === void 0) { mapBuilder = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1, orginalEntity, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!entity._id && !dbGenerateId)
                            throw this.generateError('Failed to create entity', 'Invalid entity id');
                        //validate entity
                        entity.validateEntity();
                        if (!(entity.hasType && !entity._id && dbGenerateId)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.db.post(entity)];
                    case 2:
                        response = _a.sent();
                        if (response.ok) {
                            entity._rev = response.rev;
                            entity._id = response.id;
                            return [2 /*return*/, caribviper_entity_1.EntityMaps.mapEntityMap(mapBuilder, entity)];
                        }
                        throw this.generateUnknownError();
                    case 3:
                        error_1 = _a.sent();
                        throw this.generateError('Failed to save', 'Unable to save entity');
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        _a.trys.push([5, 8, , 9]);
                        if (entity.isTransient)
                            throw this.generateError('Failed to save', 'Entity is transient');
                        return [4 /*yield*/, this.db.get(entity._id)];
                    case 6:
                        orginalEntity = _a.sent();
                        entity._rev = orginalEntity._rev;
                        return [4 /*yield*/, this.db.put(entity)];
                    case 7:
                        response = _a.sent();
                        if (response.ok) {
                            entity._rev = response.rev;
                            return [2 /*return*/, caribviper_entity_1.EntityMaps.mapEntityMap(mapBuilder, entity)];
                        }
                        throw this.generateError('Failed to save', 'Unknown error occurred');
                    case 8:
                        error_2 = _a.sent();
                        if (!!error_2.error)
                            throw new Error(error_2.error);
                        throw this.generateError('Failed to save', 'Unknown error occurred');
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Saves an entity without checking for the newest revision first.
     * Has the greatest chances of having a conflict
     * @param entity Entity to be saved
     */
    Repository.prototype.quickSave = function (entity, mapBuilder) {
        if (mapBuilder === void 0) { mapBuilder = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (entity.isTransient)
                            throw this.generateError('Failed to save', 'Entity is transient');
                        //validate entity
                        entity.validateEntity();
                        return [4 /*yield*/, this.db.put(entity)];
                    case 1:
                        response = _a.sent();
                        if (response.ok) {
                            entity._id = response.id;
                            entity._rev = response.rev;
                            return [2 /*return*/, caribviper_entity_1.EntityMaps.mapEntityMap(mapBuilder, entity)];
                        }
                        throw this.generateUnknownError();
                    case 2:
                        error_3 = _a.sent();
                        throw new Error(JSON.stringify(error_3));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes an entity/document from the database
     * @param entity Entity to be removed
     */
    Repository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var entity, error_4, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        entity = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.db.get(id)];
                    case 2:
                        entity = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        if (!!error_4.error)
                            throw new Error(error_4.error);
                        throw this.generateError('Unable to delete entity.', 'Possibly invalid id for entity');
                    case 4: return [4 /*yield*/, this.db.remove(entity)];
                    case 5:
                        response = _a.sent();
                        return [2 /*return*/, response.ok];
                    case 6:
                        error_5 = _a.sent();
                        throw this.generateError('Unable to delete entity', error_5);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the requested entity
     * @param id Id of the entity/document to be fetched
     */
    Repository.prototype.get = function (id, mapBuilder) {
        if (mapBuilder === void 0) { mapBuilder = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id)
                            throw this.generateError('Unable to fetch requested entity due to invalid id', '');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.db.get(id)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, caribviper_entity_1.EntityMaps.mapEntityMap(mapBuilder, result)];
                    case 3:
                        error_6 = _a.sent();
                        if (!!error_6.error)
                            throw new Error(error_6.error);
                        throw this.generateError('Unable to fetch requested entity', error_6);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Searches the database based on the criteria passed
     * @param query DbQueryObject specifying the criteria to be searched on
     */
    Repository.prototype.find = function (query, mapBuilder, retryAttempts) {
        if (mapBuilder === void 0) { mapBuilder = undefined; }
        if (retryAttempts === void 0) { retryAttempts = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var results, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 5]);
                        return [4 /*yield*/, this.db.find(query)];
                    case 1:
                        results = _a.sent();
                        if (!results)
                            throw new Error();
                        return [2 /*return*/, caribviper_entity_1.EntityMaps.mapEntityMapArray(mapBuilder, results.docs)];
                    case 2:
                        error_7 = _a.sent();
                        if (!((error_7.error === 'too_many_requests' || error_7.status === 429 || error_7.status === 500) && retryAttempts > 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.find(query, mapBuilder, --retryAttempts)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw this.generateError('An error occurred executing the query', error_7);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all entities within the document of the desired type
     * @param options Options used to aide in the retrieval of data
     */
    Repository.prototype.fetchAllByType = function (options, mapBuilder, retryAttempts) {
        if (options === void 0) { options = undefined; }
        if (mapBuilder === void 0) { mapBuilder = undefined; }
        if (retryAttempts === void 0) { retryAttempts = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var results, results, entities_1, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 8]);
                        if (!!options) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.allDocs()];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.rows];
                    case 2:
                        options.include_docs = true;
                        return [4 /*yield*/, this.db.allDocs(options)];
                    case 3:
                        results = _a.sent();
                        entities_1 = [];
                        results.rows.forEach(function (row) {
                            entities_1.push(caribviper_entity_1.EntityMaps.mapEntityMap(mapBuilder, row.doc));
                        });
                        return [2 /*return*/, entities_1];
                    case 4: return [3 /*break*/, 8];
                    case 5:
                        error_8 = _a.sent();
                        if (!((error_8.error === 'too_many_requests' || error_8.status === 429 || error_8.status === 500) && retryAttempts > 1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.fetchAllByType(options, mapBuilder, --retryAttempts)];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: throw this.generateError('An error occurred fetching the entities', error_8);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all entities within the result returning only documents
     * @param options Options used to aide in the retrieval of data
     */
    Repository.prototype.fetchAll = function (options, retryAttempts) {
        if (options === void 0) { options = undefined; }
        if (retryAttempts === void 0) { retryAttempts = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var results, _a, rows_1, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 8]);
                        if (!(!options)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.allDocs()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.db.allDocs(options)];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        results = _a;
                        if (options.include_docs) {
                            rows_1 = [];
                            results.rows.forEach(function (row) {
                                rows_1.push(row.doc);
                            });
                            return [2 /*return*/, rows_1];
                        }
                        else
                            return [2 /*return*/, results.rows];
                        return [3 /*break*/, 8];
                    case 5:
                        error_9 = _b.sent();
                        if (!((error_9.error === 'too_many_requests' || error_9.status === 429 || error_9.status === 500) && retryAttempts > 1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.fetchAll(options, --retryAttempts)];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7: throw this.generateError('An error occurred fetching the entities', error_9);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.queryByType = function (view, options, mapBuilder, retryAttempts) {
        if (options === void 0) { options = undefined; }
        if (mapBuilder === void 0) { mapBuilder = undefined; }
        if (retryAttempts === void 0) { retryAttempts = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var results, results, entities_2, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 8]);
                        if (!!options) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.query(view)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.rows];
                    case 2:
                        options.include_docs = true;
                        return [4 /*yield*/, this.db.query(view, options)];
                    case 3:
                        results = _a.sent();
                        entities_2 = [];
                        results.rows.forEach(function (row) {
                            entities_2.push(caribviper_entity_1.EntityMaps.mapEntityMap(mapBuilder, row.doc));
                        });
                        return [2 /*return*/, entities_2];
                    case 4: return [3 /*break*/, 8];
                    case 5:
                        error_10 = _a.sent();
                        if (!((error_10.error === 'too_many_requests' || error_10.status === 429 || error_10.status === 500) && retryAttempts > 1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.queryByType(view, options, mapBuilder, --retryAttempts)];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: throw this.generateError('An error occurred fetching the entities from the view', error_10);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.query = function (view, options, retryAttempts) {
        if (options === void 0) { options = undefined; }
        if (retryAttempts === void 0) { retryAttempts = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var results, _a, error_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 8]);
                        if (!(!options)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.query(view)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.db.query(view, options)];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        results = _a;
                        return [2 /*return*/, results.rows];
                    case 5:
                        error_11 = _b.sent();
                        if (!((error_11.error === 'too_many_requests' || error_11.status === 429 || error_11.status === 500) && retryAttempts > 1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.query(view, options, --retryAttempts)];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7: throw this.generateError('An error occurred fetching the entities from the view', error_11);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Executes a query against the specified lucene server and couchdb database
     * @param options LuceneFetchOptions required to perform search
     * @param mapBuilder Entity mapping data
     */
    Repository.prototype.luceneQuery = function (options, mapBuilder, retryAttempts) {
        if (mapBuilder === void 0) { mapBuilder = undefined; }
        if (retryAttempts === void 0) { retryAttempts = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var result, i, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 5]);
                        if (!options)
                            throw new Error('Invalid Lucene Fetch Options');
                        return [4 /*yield*/, this.executeLuceneSearch(options.url, options.secure)];
                    case 1:
                        result = _a.sent();
                        //map
                        for (i = 0; i < result.rows.length; i++) {
                            result.rows[i] = lucene_data_objects_1.LuceneScoredRow.clone(result.rows[i]);
                            if (!!result.rows[i].doc)
                                result.rows[i].doc = caribviper_entity_1.EntityMaps.mapEntityMap(mapBuilder, result.rows[i].doc);
                        }
                        return [2 /*return*/, result];
                    case 2:
                        error_12 = _a.sent();
                        if (!((error_12.error === 'too_many_requests' || error_12.status === 429 || error_12.status === 500) && retryAttempts > 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.luceneQuery(options, mapBuilder, --retryAttempts)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw this.generateError('An error occurred fetching the entities from the lucene index', error_12);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates, updates or delete documents in bulk
     * @param docs Documents to be created/updated/deleted
     */
    Repository.prototype.bulkDocs = function (docs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!docs || docs.length < 1)
                            throw this.generateError('Bulk doc error', 'Unable to execute bulk document request due to empty docs parameter');
                        return [4 /*yield*/, this.db.bulkDocs(docs)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    /**
     * Creates a new db error
     * @param error Error type
     * @param reason Reason error occurred
     */
    Repository.prototype.generateError = function (error, reason) {
        return Repository.createError(error, reason);
    };
    /**
     * Creates a new db unknown error
     */
    Repository.prototype.generateUnknownError = function () {
        return Repository.createError('Unknown error occurred');
    };
    /**
     * Creates a new error message
     * @param error Error message
     * @param reason Reason for error
     */
    Repository.createError = function (error, reason) {
        if (reason === void 0) { reason = ''; }
        caribviper_common_1.Assert.isTruthy(error, 'Error for error message cannot be null/empty');
        var e = {
            error: error,
            reason: !reason ? error : reason
        };
        return e;
    };
    /**
    * Executes a lucene search
    * @param url Url to the resource
    * @param secure Determines whether to use http/https
    */
    Repository.prototype.executeLuceneSearch = function (url, secure) {
        if (secure === void 0) { secure = false; }
        var data;
        return new Promise(function (resolve, reject) {
            if (url.indexOf('http:') !== 0 && url.indexOf('https:') !== 0) {
                url = "http" + (secure ? 's' : '') + "://" + url;
            }
            request(url, null, function (error, res, body) {
                if (!!error)
                    return reject(error);
                if (!body)
                    return resolve(JSON.parse('{}'));
                return resolve(JSON.parse(body));
            });
        });
    };
    return Repository;
}());
exports.Repository = Repository;
