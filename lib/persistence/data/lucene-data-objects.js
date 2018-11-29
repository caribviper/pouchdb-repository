"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var caribviper_common_1 = require("caribviper-common");
var caribviper_entity_1 = require("caribviper-entity");
/**Implementation for Lucene searches against the db */
var LuceneFetchOptions = (function () {
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
    function LuceneFetchOptions(luceneServer, databaseName, indexPath, q, include_docs, limit, skip, secure, bookmark) {
        if (include_docs === void 0) { include_docs = false; }
        if (limit === void 0) { limit = 25; }
        if (skip === void 0) { skip = 0; }
        if (secure === void 0) { secure = false; }
        if (bookmark === void 0) { bookmark = ''; }
        this.luceneServer = luceneServer;
        this.databaseName = databaseName;
        this.indexPath = indexPath;
        this.q = q;
        this.include_docs = include_docs;
        this.limit = limit;
        this.skip = skip;
        this.secure = secure;
        this.bookmark = bookmark;
        caribviper_common_1.Assert.isTruthy(this.luceneServer, 'Index url cannot be null/empty');
        caribviper_common_1.Assert.isTruthy(this.databaseName, 'Database name cannot be null/empty');
        caribviper_common_1.Assert.isTruthy(this.indexPath, 'Index path cannot be null/empty');
        caribviper_common_1.Assert.isTruthy(this.q, 'Search parameter cannot be null/empty');
        if (!limit || limit < 1)
            limit = 25;
        if (!skip || skip < 0)
            skip = 0;
    }
    Object.defineProperty(LuceneFetchOptions.prototype, "url", {
        get: function () {
            var query = caribviper_common_1.StringUtilities.replaceAll(this.q, '/', '//');
            query = caribviper_common_1.StringUtilities.replaceAll(query, '\\*', '%2A');
            query = caribviper_common_1.StringUtilities.replaceAll(query, '\\?', '%3F');
            var parameters = "?q=" + query + "&include_docs=" + this.include_docs + "&limit=" + this.limit + "&skip=" + this.skip;
            if (!!this.bookmark)
                parameters = parameters + ("&bookmark=\"" + this.bookmark + "\"");
            var path = "http" + (this.secure ? 's' : '') + "://" + caribviper_common_1.Utilities.join(this.luceneServer, this.databaseName, '_design', this.indexPath);
            path += parameters;
            return path;
        },
        enumerable: true,
        configurable: true
    });
    return LuceneFetchOptions;
}());
exports.LuceneFetchOptions = LuceneFetchOptions;
/**Implements a lucene scored row result */
var LuceneScoredRow = (function () {
    function LuceneScoredRow() {
    }
    /**
     * Converts a document to the desired entity type
     * @param mapBuilder Entity type to convert to
     */
    LuceneScoredRow.prototype.convertDocument = function (mapBuilder) {
        if (!!this.doc)
            return caribviper_entity_1.EntityMaps.mapEntityMap(mapBuilder, this.doc);
        return null;
    };
    /**
     * Clone a row to a new LuceneScoredRow
     * @param row Row to be cloned
     */
    LuceneScoredRow.clone = function (row) {
        return Object.assign(new LuceneScoredRow(), row);
    };
    /**
     * Assigns a  row to itself as new LuceneScoredRow
     * @param row
     */
    LuceneScoredRow.reAssign = function (row) {
        row = this.clone(row);
    };
    return LuceneScoredRow;
}());
exports.LuceneScoredRow = LuceneScoredRow;
/**Fetch results from a lucene search */
var LuceneFetchResults = (function () {
    function LuceneFetchResults() {
    }
    return LuceneFetchResults;
}());
exports.LuceneFetchResults = LuceneFetchResults;
