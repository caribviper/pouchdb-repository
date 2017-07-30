import { IEntity } from './entity';
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
export interface IEntityMapBuilder<T extends Entity> {
    new (): T;
    mapToEntity(obj: any): T;
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
    constructor(type?: string, id?: string, idHasType?: boolean);
    /**
     * Validates an entity
     */
    abstract validateEntity(): any;
    /**
     * Indicates if the entity is transient
     */
    readonly isTransient: boolean;
    /**
     * Indicates whether the entity has the type property set.
     */
    readonly hasType: boolean;
    /**
     * Changes the value of the timestamp to indicate the most recent update
     */
    update(): void;
    /**
     * Creates a Unique id based on the data passed
     * @param identifiers Data relevant for creating the id
     */
    static generateId(...identifiers: string[]): string;
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
     * Checks whether the entity has a type
     * @param entity Entity to be checked
     */
    static hasType(entity: Entity): boolean;
    /**
     * Checks to see if an entity is transient
     * @param entity Entity the checked
     */
    static isTransient<T extends Entity>(entity: T): boolean;
    static mapToEntity(obj: any): Entity;
}
export declare class EntityFactory {
}
