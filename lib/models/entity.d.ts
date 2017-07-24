/**
 * Base entity to be implemented
 */
export interface IEntity {
    /**Unique id of the entity */
    _id: string;
    /**revision of the entity */
    _rev: string;
    /**Type of entity */
    type: string;
}
/**
 * base IEntity implementation
 */
export declare abstract class Entity implements IEntity {
    /**Unique id of the entity */
    _id: string;
    /**revision of the entity */
    _rev: string;
    /**Type of entity */
    type: string;
    /**Time stamp of when entity was modified */
    timestamp: number;
    constructor(type: string, id?: string, idHasType?: boolean);
    /**
     * Changes the value of the timestamp to indicate the most recent update
     */
    update(): void;
    /**
     * Creates a Unique id based on the data passed
     * @param type Type of entity to be created
     * @param identifiers Data relevant for creating the id
     */
    static createId(...identifiers: string[]): string;
    /**
     * Converts an entity from an existing object
     * @param target Entity to contain the object data
     * @param source Object to be converted from
     */
    static fromObject(target: Entity, source: any): Entity;
    /**
     * Merges an entity object to get a new entity object
     * @param entity Entity to be merged
     * @param obj Obj cotaining entity data
     */
    static mergeObject<T extends Entity>(entity: T, obj: T): T;
    /**
     * Updates an existing entity timestamp
     * @param entity Entity to have its timestamp updated
     */
    static updateTimestamp(entity: Entity): void;
    /**
     * Gets whether an object is a string
     * @param obj Object to be checked if it is a string
     */
    static isString(obj: any): boolean;
    /**
     * Checks to see if an entity is not transient
     * @param entity Entity the checked
     */
    static isNotTransient<T extends Entity>(entity: T): boolean;
    /**
     * Checks to see if an entity is transient
     * @param entity Entity the checked
     */
    static isTransient<T extends Entity>(entity: T): boolean;
}
