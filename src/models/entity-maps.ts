import { Entity } from './entity';

/**
 * Base entity map function
 */
export interface IEntityMapFunction<T extends Entity> {
  (source: T) : T;
}

/**
 * Encapsulates entity mapping
 */
export class EntityMaps {
  //stores all maps
  private static maps: {};

  /**
   * Adds/replaces a map of an entity
   * @param type String type entity to be mapped from the entity's type field
   * @param mapFunction Function to execute the mapping
   */
  public static addMap<T extends Entity>(type: string, mapFunction: IEntityMapFunction<T>) {
    this.maps[type] = mapFunction;
  }

  /**
   * Executes the mapping function, resulting with a new entity with all 
   * functions or the original entity on failure
   * @param source Source entity to be mapped
   */
  public static map(source: Entity) {
    return (!source || !this.maps[source.type]) ? source : this.maps[source.type](source) || source;
  }
}
