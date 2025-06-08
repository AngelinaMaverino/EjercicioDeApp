import { inject, injectable, unmanaged } from "inversify";
import { DataSource, EntityTarget, Repository as TypeOrmRepository } from "typeorm";
import { IRepository } from "../../domain/interfaces/IRepository";
import TYPES from "../../types/types";

@injectable()
export class Repository<T> implements IRepository<T> {
    private repository: TypeOrmRepository<T>;

    constructor(
        @inject(TYPES.DataSource) private dataSource: DataSource,
        @unmanaged() private entityClass: EntityTarget<T>
    ) {
        this.repository = this.dataSource.getRepository(this.entityClass); 
    }

    async getByIdAsync(id: number): Promise<T | null> {
        return await this.repository.findOneBy({ id } as any);
    }

    async getAllAsync(): Promise<T[]> {
        return await this.repository.find();
    }

    async findAsync(predicate: (item: T) => boolean): Promise<T[]> {
        const all = await this.repository.find();
        return all.filter(predicate);
    }

    async add(entity: T): Promise<T> {
        return await this.repository.save(entity);
    }

    async update(entity: T): Promise<void> {
        await this.repository.save(entity);
    }

    async deleteAsync(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
