import { Entity, IEntity, IEntityMapBuilder } from './entity';

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

  /**
   * Executes the mapping function, resulting with a new entity with all 
   * functions or the original entity on failure
   * @param entityMapBuilder Entity Class to be mapped
   * @param source Source entity to be mapped
   */
  public static mapEntityMap<T extends Entity>(entityMapBuilder: IEntityMapBuilder<T>, source: T) {
    return (!source || !entityMapBuilder) ? source : entityMapBuilder.mapToEntity(source);
  }

  /**
   * Executes the mapping function for a set entities
   * @param entityMapBuilder Entity Class to be mapped
   * @param sources Array of entities to be mapped
   */
  public static mapEntityMapArray<T extends Entity>(entityMapBuilder: IEntityMapBuilder<T>, sources: T[]) : T[] {
    let targets: any[] = [];
    sources.forEach((source: Entity) => {
      targets.push(EntityMaps.mapEntityMap(entityMapBuilder, source));
    });
    return targets; 
  }
}
