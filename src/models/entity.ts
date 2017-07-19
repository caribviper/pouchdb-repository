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

  constructor(type: string, id: string = '') {
    if (!type)
      throw new Error('Cannot create an entity without a type');
    this.type = type;
    this._id = Entity.createId(type, id);
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
    if (!!identifiers && identifiers.length > 0)
      return identifiers.join(':').toLowerCase();
    throw new Error('Unable to create id');
  }

  /**
   * Converts an entity from an existing object
   * @param obj Object to be converted from
   * @param entity Entity to contain the object data
   */
  public static fromObject(obj, entity: Entity) {
    let keys: string[] = Object.keys(obj);
    keys.forEach(o => {
      entity[o] = obj[o];
    });
    return entity;
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
}
