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
    /**Gets the selector */
    DbSelectorValue.prototype.on = function () { return this.selector; };
    /**
     * Create an object with the specified field and value.
     * @param field Name of the field to be used
     * @param value Value to be applied to specified field
     */
    DbSelectorValue.createPropertyValue = function (field, value) {
        caribviper_common_1.Assert.isTruthy(field, 'DbSelectorValue: Property field cannot be null/empty');
        var name = caribviper_common_1.Utilities.getPropertyName(field);
        var o = {};
        o[name] = value;
        return o;
    };
    /**
     * Create an array of objects with specified properties and values
     * @param fields Array of names of the field properties
     * @param values Array of values for the corresponding properties
     */
    DbSelectorValue.createPropertyArrayValue = function (fields, values) {
        caribviper_common_1.Assert.isTruthy(fields, 'DbSelectorValue: Property fields cannot be null/empty');
        caribviper_common_1.Assert.isTruthy(values, 'DbSelectorValue: Property values cannot be null/empty');
        caribviper_common_1.Assert.isTruthy(Array.isArray(fields), 'DbSelectorValue: fields must be an array');
        caribviper_common_1.Assert.isTruthy(Array.isArray(values), 'DbSelectorValue: values must be an array');
        caribviper_common_1.Assert.isTruthy(fields.length > 0, 'DbSelectorValue: fields empty');
        caribviper_common_1.Assert.isTruthy(values.length > 0, 'DbSelectorValue: values empty');
        caribviper_common_1.Assert.isTruthy(values.length === fields.length, 'DbSelectorValue: feilds and values must be the same length');
        var objs = [];
        for (var i = 0; i < fields.length; i++) {
            objs.push(this.createPropertyValue(fields[i], values[i]));
        }
        return objs;
    };
    return DbSelectorValue;
}());
exports.DbSelectorValue = DbSelectorValue;
/**Manages db selector values used mainly for Or/And */
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
        this.property = [];
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
    /**
     * Adds an array of objects as the value items
     * @param items An array of objects to be used with the property
     */
    DbSelectorAsValue.prototype.withObjectArray = function (items) {
        var _this = this;
        if (!items)
            throw new Error('DbSelectorAsValue: Cannot past a falsey items object to withObjectArray');
        items.forEach(function (item) {
            _this.withObject(item);
        });
        return this;
    };
    /**
     * Adds a new object as a value item
     * @param field Name of the property of the new object to be inserted
     * @param value Value of the property of the new object to be inserted
     */
    DbSelectorAsValue.prototype.withObjectValue = function (field, value) {
        caribviper_common_1.Assert.isTruthy(field, 'DbSelector: Property field cannot be null/empty');
        var name = caribviper_common_1.Utilities.getPropertyName(field);
        if (!value)
            throw new Error('DbSelectorAsValue: Cannot past a falsey value object to withObjectValue');
        this.property.push(DbSelectorValue.createPropertyValue(field, value));
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
    /**Creates an 'Or' property selector 'or' queries */
    DbSelector.prototype.withSelectorPropertyOr = function () {
        this.selectorObject['$or'];
        return new DbSelectorAsValue(this, this.selectorObject, '$or');
    };
    /**Creates an Andr' property selector 'and' queries */
    DbSelector.prototype.withSelectorPropertyAnd = function () {
        return new DbSelectorAsValue(this, this.selectorObject, '$and');
    };
    /**
     * Changes the specified property value to the new one passed
     * @param field Name of the field to be used
     * @param value New value to be given to property
     */
    DbSelector.prototype.changePropertyValue = function (field, value) {
        caribviper_common_1.Assert.isTruthy(field, 'DbSelector: Property field cannot be null/empty');
        var name = caribviper_common_1.Utilities.getPropertyName(field);
        caribviper_common_1.Assert.isTruthy(this.selectorObject[name], 'DbSelector: Property field passed does not exist', 'DbSelector');
        this.selectorObject[name] = value;
    };
    /**
     * Removes a property from the selector
     * @param field Name of field to be removed`
     */
    DbSelector.prototype.removeProperty = function (field) {
        caribviper_common_1.Assert.isTruthy(field, 'DbSelector: Property field cannot be null/empty');
        var name = caribviper_common_1.Utilities.getPropertyName(field);
        if (!!this.selectorObject[name])
            delete this.selectorObject[name];
    };
    return DbSelector;
}());
exports.DbSelector = DbSelector;
/**Manages sort creation options */
var DbSortManager = (function () {
    function DbSortManager() {
    }
    /**
     * Gets the field name of the property to be sorted
     * @param field Name of property to be sorted
     */
    DbSortManager.createSortValue = function (field) {
        return caribviper_common_1.Utilities.getPropertyName(field);
    };
    /**
     * Gets the field names of the properties to be sorted
     * @param fields Names of the fields to be sorted
     */
    DbSortManager.createSortArray = function (fields) {
        var _this = this;
        var arr = [];
        fields.forEach(function (field) {
            arr.push(_this.createSortValue(field));
        });
        return arr;
    };
    return DbSortManager;
}());
exports.DbSortManager = DbSortManager;
/**Encapsulates all the parameters for a query */
var DbQueryObject = (function () {
    function DbQueryObject(selector, fields, sort, limit, use_index) {
        if (fields === void 0) { fields = []; }
        if (sort === void 0) { sort = []; }
        if (limit === void 0) { limit = undefined; }
        if (use_index === void 0) { use_index = undefined; }
        this.selector = (!!selector.selector) ? selector.selector : selector;
        this.fields = fields || [];
        this.sort = sort || [];
        this.limit = (!limit || limit < 1) ? undefined : limit;
        this.use_index = (!use_index) ? undefined : use_index;
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
    return data + '\ufff0';
}
exports.applyWildCard = applyWildCard;
