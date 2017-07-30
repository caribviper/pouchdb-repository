"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var caribviper_common_1 = require("caribviper-common");
/**Get the result from a query with Generics */
var IDbQueryResultGeneric = (function () {
    function IDbQueryResultGeneric() {
    }
    return IDbQueryResultGeneric;
}());
exports.IDbQueryResultGeneric = IDbQueryResultGeneric;
/**Manages db selector values */
var DbSelectorValue = (function () {
    /**
     *
     * @param selector DbSelector that stores the parent object
     * @param propertyContainer Property container object that stores all properties and valuees
     * @param propertyName Property container value to be used
     */
    function DbSelectorValue(selector, propertyContainer, propertyName) {
        this.selector = selector;
        this.propertyContainer = propertyContainer;
        this.propertyName = propertyName;
        caribviper_common_1.Assert.isTruthy(propertyContainer, 'DbSelectorValue: Invalid parent object');
        caribviper_common_1.Assert.isTruthy(propertyName, 'DbSelectorValue: Invalid property name');
        caribviper_common_1.Assert.isTruthy(selector, 'DbSelectorValue: Invalid sector');
    }
    Object.defineProperty(DbSelectorValue.prototype, "property", {
        get: function () { return this.propertyContainer[this.propertyName]; },
        set: function (value) { this.propertyContainer[this.propertyName] = value; },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a value item to the property
     * @param item Value item to be added
     */
    DbSelectorValue.prototype.withValue = function (item) {
        if ((typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean')) {
            if (!this.property)
                this.property = item;
            else
                throw new Error('DbSelectorValue: Cannot assign literal to object');
        }
        else {
            if (!this.property)
                this.property = {};
            if (typeof this.property !== 'string' && typeof this.property !== 'number')
                this.property[item.propertyName] = item.value;
            else
                throw new Error('DbSelectorValue: Cannot assign object to literal');
        }
        return this;
    };
    /**
     * Adds an object as a value item
     * @param item DbSelector to be used with the property
     */
    DbSelectorValue.prototype.withObjectValue = function (item) {
        if (!item)
            throw new Error('DbSelectorValue: Cannot past a falsey item object to withObject');
        this.property = item;
        return this;
    };
    DbSelectorValue.prototype.on = function () { return this.selector; };
    return DbSelectorValue;
}());
exports.DbSelectorValue = DbSelectorValue;
/**Manages db selector values */
var DbSelectorAsValue = (function () {
    /**
     *
     * @param selector DbSelector that stores the parent object
     * @param propertyContainer Property container object that stores all properties and values
     * @param propertyName Property container value to be used
     */
    function DbSelectorAsValue(selector, propertyContainer, propertyName) {
        this.selector = selector;
        this.propertyContainer = propertyContainer;
        this.propertyName = propertyName;
        caribviper_common_1.Assert.isTruthy(propertyContainer, 'DbSelectorValue: Invalid parent object');
        caribviper_common_1.Assert.isTruthy(propertyName, 'DbSelectorValue: Invalid property name');
        caribviper_common_1.Assert.isTruthy(selector, 'DbSelectorValue: Invalid sector');
    }
    Object.defineProperty(DbSelectorAsValue.prototype, "property", {
        get: function () { return this.propertyContainer[this.propertyName]; },
        set: function (value) { this.propertyContainer[this.propertyName] = value; },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a dbselector as a value item
     * @param item DbSelector to be used with the property
     */
    DbSelectorAsValue.prototype.withSelector = function (item) {
        this.property.push(item.selector);
        return this;
    };
    /**
     * Adds an object as a value item
     * @param item DbSelector to be used with the property
     */
    DbSelectorAsValue.prototype.withObject = function (item) {
        if (!item)
            throw new Error('DbSelectorAsValue: Cannot past a falsey item object to withObject');
        this.property.push(item);
        return this;
    };
    DbSelectorAsValue.prototype.on = function () { return this.selector; };
    return DbSelectorAsValue;
}());
exports.DbSelectorAsValue = DbSelectorAsValue;
/**
 * Manages the db selector property
 */
var DbSelector = (function () {
    function DbSelector(selectorObject) {
        if (selectorObject === void 0) { selectorObject = {}; }
        this.selectorObject = selectorObject;
    }
    /**Creates a new DbSelctor */
    DbSelector.create = function () {
        return new DbSelector();
    };
    DbSelector.createOr = function () {
        var selector = new DbSelector();
        selector.withSelectorProperty('$or');
        return selector;
    };
    DbSelector.createWithProperty = function (field, item) {
        var selector = new DbSelector();
        return selector.withProperty(caribviper_common_1.Utilities.getPropertyName(field)).withValue(item).on();
    };
    DbSelector.createWithObjectValue = function (field, item) {
        if (item === void 0) { item = {}; }
        var selector = new DbSelector();
        return selector.withProperty(caribviper_common_1.Utilities.getPropertyName(field)).withObjectValue(item).on();
    };
    Object.defineProperty(DbSelector.prototype, "selector", {
        /**Gets the existing selector */
        get: function () {
            return this.selectorObject;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates the property based on the field passed.
     * @param field Name of the field to be used
     */
    DbSelector.prototype.withProperty = function (field) {
        caribviper_common_1.Assert.isTruthy(field, 'DbSelector: Property field cannot be null/empty');
        var name = caribviper_common_1.Utilities.getPropertyName(field);
        return new DbSelectorValue(this, this.selectorObject, name);
    };
    /**
     * Creates the property based on the field passed
     * @param field Name of the field to be used
     */
    DbSelector.prototype.withSelectorProperty = function (field) {
        caribviper_common_1.Assert.isTruthy(field, 'DbSelector: Property field cannot be null/empty');
        var name = caribviper_common_1.Utilities.getPropertyName(field);
        return new DbSelectorAsValue(this, this.selectorObject, name);
    };
    return DbSelector;
}());
exports.DbSelector = DbSelector;
/**Encapsulates all the parameters for a query */
var DbQueryObject = (function () {
    function DbQueryObject(selector, fields, sort, limit) {
        if (fields === void 0) { fields = []; }
        if (sort === void 0) { sort = []; }
        if (limit === void 0) { limit = undefined; }
        this.selector = selector.selector;
        this.fields = fields || [];
        this.sort = sort || [];
        this.limit = (!limit || limit < 1) ? undefined : limit;
    }
    return DbQueryObject;
}());
exports.DbQueryObject = DbQueryObject;
/**Implementation of IDbFetchOptions */
var DbFetchOptions = (function () {
    function DbFetchOptions() {
        /**Include the document itself in each row in the doc field. Otherwise by default you only get the _id and _rev properties. */
        this.include_docs = false;
    }
    return DbFetchOptions;
}());
exports.DbFetchOptions = DbFetchOptions;
/**Applies a wild card to end of a string */
function applyWildCard(data) {
    return data + "\uFFFF";
}
exports.applyWildCard = applyWildCard;
