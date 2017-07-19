"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * base IEntity implementation
 */
var Entity = (function () {
    function Entity(type, id) {
        if (id === void 0) { id = ''; }
        if (!type)
            throw new Error('Cannot create an entity without a type');
        this.type = type;
        this._id = Entity.createId(type, id);
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
        if (!!identifiers && identifiers.length > 0)
            return identifiers.join(':').toLowerCase();
        throw new Error('Unable to create id');
    };
    /**
     * Converts an entity from an existing object
     * @param obj Object to be converted from
     * @param entity Entity to contain the object data
     */
    Entity.fromObject = function (obj, entity) {
        var keys = Object.keys(obj);
        keys.forEach(function (o) {
            entity[o] = obj[o];
        });
        return entity;
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
    return Entity;
}());
exports.Entity = Entity;
