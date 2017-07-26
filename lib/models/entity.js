"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * base IEntity implementation
 */
var Entity = (function () {
    function Entity(type, id, idHasType) {
        if (type === void 0) { type = ''; }
        if (id === void 0) { id = ''; }
        if (idHasType === void 0) { idHasType = false; }
        this.type = type;
        this._id = idHasType ? id : Entity.createId(type, id);
        this.update();
    }
    Object.defineProperty(Entity.prototype, "isTransient", {
        /**
         * Indicates if the entity is transient
         */
        get: function () {
            return Entity.isTransient(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "hasType", {
        /**
         * Indicates whether the entity has the type property set.
         */
        get: function () {
            return Entity.hasType(this);
        },
        enumerable: true,
        configurable: true
    });
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
        return !!entity && !!entity.type && !!entity._id;
    };
    /**
     * Checks whether the entity has a type
     * @param entity Entity to be checked
     */
    Entity.hasType = function (entity) {
        return !!entity && !!entity.type;
    };
    /**
     * Checks to see if an entity is transient
     * @param entity Entity the checked
     */
    Entity.isTransient = function (entity) {
        return !this.isNotTransient(entity);
    };
    Entity.mapToEntity = function (obj) {
        return obj;
    };
    return Entity;
}());
exports.Entity = Entity;
var EntityFactory = (function () {
    function EntityFactory() {
    }
    return EntityFactory;
}());
exports.EntityFactory = EntityFactory;
