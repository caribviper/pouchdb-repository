"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * base IEntity implementation
 */
var Entity = (function () {
    function Entity(type, id, idHasType) {
        if (id === void 0) { id = ''; }
        if (idHasType === void 0) { idHasType = false; }
        if (!type)
            throw new Error('Cannot create an entity without a type');
        this.type = type;
        this._id = idHasType ? id : Entity.createId(type, id);
        this.update();
    }
    /**
     * Changes the value of the timestamp to indicate the most recent update
     */
    Entity.prototype.update = function () {
        this.timestamp = Date.now();
    };
    /**
     * Creates a Unique id based on the data passed
     * @param type Type of entity to be created
     * @param identifiers Data relevant for creating the id
     */
    Entity.createId = function () {
        var identifiers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            identifiers[_i] = arguments[_i];
        }
        if (!!identifiers && identifiers.length > 0) {
            return identifiers.join(':').toLowerCase();
        }
        throw new Error('Unable to create id');
    };
    /**
     * Converts an entity from an existing object
     * @param target Entity to contain the object data
     * @param source Object to be converted from
     */
    Entity.fromObject = function (target, source) {
        var keys = Object.keys(source);
        keys.forEach(function (o) {
            target[o] = source[o];
        });
        return target;
    };
    /**
     * Merges an entity object to get a new entity object
     * @param entity Entity to be merged
     * @param obj Obj cotaining entity data
     */
    Entity.mergeObject = function (entity, obj) {
        return Object.assign(entity, obj);
    };
    /**
     * Updates an existing entity timestamp
     * @param entity Entity to have its timestamp updated
     */
    Entity.updateTimestamp = function (entity) {
        if (!entity)
            throw new Error('Invalid entity');
        entity.update();
    };
    /**
     * Gets whether an object is a string
     * @param obj Object to be checked if it is a string
     */
    Entity.isString = function (obj) { return typeof obj === 'string'; };
    /**
     * Checks to see if an entity is not transient
     * @param entity Entity the checked
     */
    Entity.isNotTransient = function (entity) {
        return !!entity && !!entity._id && !!entity._rev;
    };
    /**
     * Checks to see if an entity is transient
     * @param entity Entity the checked
     */
    Entity.isTransient = function (entity) {
        return !this.isNotTransient(entity);
    };
    return Entity;
}());
exports.Entity = Entity;
