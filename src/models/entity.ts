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
  new(): T;
  mapToEntity(obj: any) : T;
}

/**
 * base IEntity implementation
 */
export abstract class Entity implements IEntity {
  /**Unique id of the entity */
  public _id: string;

  /**revision of the entity */
  public _rev: string;

  /**Type of entity */
  public type: string;

  /**Time stamp of when entity was modified */
  public timestamp: number;

  constructor(type: string='', id: string = '', idHasType: boolean = false) {
    this.type = type;
    this._id = idHasType ? id : Entity.generateId(type, id);
    this.update();
  }

  /**
   * Validates an entity
   */
  public abstract validateEntity();

  /**
   * Indicates if the entity is transient
   */
  public get isTransient() : boolean {
    return Entity.isTransient(this);
  }

  /**
   * Indicates whether the entity has the type property set.
   */
  public get hasType(): boolean {
    return Entity.hasType(this);
  }

  /**
   * Changes the value of the timestamp to indicate the most recent update
   */
  public update() {
    this.timestamp = Date.now();
  }

  /**
   * Creates a Unique id based on the data passed
   * @param identifiers Data relevant for creating the id 
   */
  public static generateId(...identifiers: string[]): string {
    if (!!identifiers && identifiers.length > 0) {
      return identifiers.join(':').toLowerCase();
    }
    throw new Error('Unable to create id');
  }

  /**
   * Converts an entity from an existing object
   * @param target Entity to contain the object data
   * @param source Object to be converted from
   */
  public static fromObject(target: Entity, source) {
    let keys: string[] = Object.keys(source);
    keys.forEach(o => {
      target[o] = source[o];
    });
    return target;
  }

  /**
   * Merges an entity object to get a new entity object
   * @param entity Entity to be merged
   * @param obj Obj cotaining entity data
   */
  public static mergeObject<T extends Entity>(entity: T, obj: T): T {
    return Object.assign(entity, obj) as T;
  }

  /**
   * Updates an existing entity timestamp
   * @param entity Entity to have its timestamp updated
   */
  public static updateTimestamp(entity: Entity) {
    if (!entity)
      throw new Error('Invalid entity');
    entity.update();
  }

  /**
   * Gets whether an object is a string
   * @param obj Object to be checked if it is a string
   */
  public static isString(obj: any): boolean { return typeof obj === 'string'; }

  /**
   * Checks to see if an entity is not transient
   * @param entity Entity the checked
   */
  public static isNotTransient<T extends Entity>(entity: T) : boolean {
    return !!entity && !!entity.type && !!entity._id;
  }

  /**
   * Checks whether the entity has a type
   * @param entity Entity to be checked
   */
  public static hasType(entity: Entity) : boolean {
    return !!entity && !!entity.type;
  }

  /**
   * Checks to see if an entity is transient
   * @param entity Entity the checked
   */
  public static isTransient<T extends Entity>(entity: T) : boolean {
    return !this.isNotTransient(entity);
  }

  public static mapToEntity(obj: any) : Entity {
    return obj as Entity;
  }
}

export class EntityFactory {

}
