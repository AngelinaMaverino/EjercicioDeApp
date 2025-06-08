import { ObjectId } from "mongodb";
import {Pet} from "../../domain/Pet";
import {IRepository} from "../../domain/interfaces/IRepository";
import {getMongoDb} from "../mongo/mongo-connection";


export class Repository implements IRepository<Pet> {
    private collectionName = "pets";

    private async getCollection() {
        const db = getMongoDb();
        return db.collection(this.collectionName);
    }

    async getByIdAsync(id: number): Promise<Pet | null> {
        const collection = await this.getCollection();
        const doc = await collection.findOne({ id });
        if (!doc) return null;

        return this.mapToEntity(doc);
    }

    async getAllAsync(): Promise<Pet[]> {
        const collection = await this.getCollection();
        const docs = await collection.find().toArray();
        return docs.map(this.mapToEntity);
    }

    async findAsync(predicate: (item: Pet) => boolean): Promise<Pet[]> {
        const all = await this.getAllAsync();
        return all.filter(predicate);
    }

    async add(pet: Pet): Promise<Pet> {
        const collection = await this.getCollection();
        const newId = Date.now();
        const now = new Date();
        const doc = { ...pet, id: newId, createdAt: now, updatedAt: now };
        await collection.insertOne(doc);
        return pet;
    }

    async update(pet: Pet): Promise<void> {
        const collection = await this.getCollection();
        await collection.updateOne({ id: pet.id }, { $set: { ...pet, updatedAt: new Date() } });
    }

    async deleteAsync(id: number): Promise<void> {
        const collection = await this.getCollection();
        await collection.deleteOne({ id });
    }

    async getFilteredWithPagination(
        type: string,
        year: number,
        page: number = 1,
        pageSize: number = 10
    ): Promise<{ total: number; pets: Pet[] }> {
        const collection = await this.getCollection();

        const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
        const endOfYear = new Date(`${year + 1}-01-01T00:00:00Z`);

        const query = {
            type,
            createdAt: {
                $gte: startOfYear,
                $lt: endOfYear
            }
        };

        const total = await collection.countDocuments(query);
        const docs = await collection
            .find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const pets = docs.map(this.mapToEntity);
        return { total, pets };
    }

    private mapToEntity(doc: any): Pet {
        const pet = new Pet();
        pet.id = doc.id;
        pet.name = doc.name;
        pet.age = doc.age;
        pet.type = doc.type;
        pet.createdAt = doc.createdAt;
        pet.updatedAt = doc.updatedAt;
        return pet;
    }
}
