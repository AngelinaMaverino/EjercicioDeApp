
export interface IRepository<T, TEntity = T>  {
    getByIdAsync(id: number): Promise<T | null>;
    getAllAsync(): Promise<T[]>;
    findAsync(predicate: (item: T) => boolean): Promise<T[]>;
    add(entity: T): Promise<T>;
    update(entity: T): Promise<void>;
    deleteAsync(id: number): Promise<void>
}