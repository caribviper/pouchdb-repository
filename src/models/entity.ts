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
export abstract class Entity implements IEntity {
  /**Unique id of the entity */
  public _id: string;

  /**revision of the entity */
  public _rev: string;

  /**Type of entity */
  public type: string;

  /**Time stamp of when entity was modified */
  public timestamp: number;

  constructor(type: string, id: string = '', idHasType: boolean = false) {
    if (!type)
      throw new Error('Cannot create an entity without a type');
    this.type = type;
    this._id = idHasType ? id : Entity.createId(type, id);
    this.update();
  }

  /**
   * Changes the value of the timestamp to indicate the most recent update
   */
  public update() {
    this.timestamp = Date.now();
  }

  /**
   * Creates a Unique id based on the data passed
   * @param type Type of entity to be created
   * @param identifiers Data relevant for creating the id 
   */
  public static createId(...identifiers: string[]): string {
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
    return !!entity && !!entity._id && !!entity._rev;
  }

  /**
   * Checks to see if an entity is transient
   * @param entity Entity the checked
   */
  public static isTransient<T extends Entity>(entity: T) : boolean {
    return !this.isNotTransient(entity);
  }
}
