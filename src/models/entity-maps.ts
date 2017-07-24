import { Entity, IEntity } from './entity';

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
   * Entities will be automatically mapped provided there is a mapping function
   */
  public static autoMap: boolean = true;

  /**
   * Adds/replaces a map of an entity
   * @param type String type entity to be mapped from the entity's type field
   * @param mapFunction Function to execute the mapping
   */
  public static addEntityMap<T extends Entity>(type: string, mapFunction: IEntityMapFunction<T>) {
    this.maps[type] = mapFunction;
  }

  /**
   * Executes the mapping function, resulting with a new entity with all 
   * functions or the original entity on failure
   * @param source Source entity to be mapped
   * @param autoMapOverride If true will map regardless of autoMap setting and false will use automap setting
   */
  public static mapEntity<T extends Entity>(source: T, autoMapOverride: boolean = true) : T {
    //excute map if source is null or maps[source.type] is null  or both autoMap and autoMapOverride is false
    return (!source || !this.maps[source.type] || (!this.autoMap && !autoMapOverride) ) ? source : this.maps[source.type](source) || source;
  }

  /**
   * Executes the mapping function for a set entities
   * @param sources Array of entities to be mapped`
   * @param autoMapOverride If true will map regardless of autoMap setting and false will use automap setting
   */
  public static mapEntityArray(sources: IEntity[], autoMapOverride: boolean = true) : any[] {
    let targets: any[] = [];
    sources.forEach((source: Entity) => {
      targets.push(EntityMaps.mapEntity(source));
    });
    return targets;
  }
}
