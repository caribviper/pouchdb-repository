/**Provides base outline for database index */
export interface IDataIndex {
    name: string;
    fields: string[];
}
/**Provides base outline for database index container*/
export interface IDataIndexContainer {
    index: IDataIndex;
}
/**Manages index implementing IDataIndex */
export declare class DataIndex implements IDataIndex {
    /**Name of the index */
    readonly name: string;
    /**Fields belonging to the index */
    readonly fields: string[];
    /**
     * Creates a new DataIndex
     * @param name Name of the index
     * @param fields Fields of the index
     */
    constructor(name: string, ...fields: string[]);
}
/**Manages the index container by implementing IDataIndexContainer */
export declare class DataIndexContainer implements IDataIndexContainer {
    readonly index: IDataIndex;
    /**
     * Creates a new DataIndexContainer
     * @param index IDataIndex with the index
     */
    constructor(index: IDataIndex);
    /**
     * Creates a new DataIndexContainer with defined index based on paramaters passed
     * @param name Name of the index
     * @param fields Fields of the index
     */
    static createIndex<TValue>(name: string | ((model) => TValue), ...fields: string[]): IDataIndexContainer;
}
