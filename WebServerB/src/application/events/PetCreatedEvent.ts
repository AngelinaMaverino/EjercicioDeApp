import { Pet } from "../../domain/Pet";

export class PetCreatedEvent {
    id: number;
    name: string;
    age: number;
    type: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, name: string, age: number, type: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toEntity(): Pet {
        const pet = new Pet();
        pet.id = this.id;
        pet.name = this.name;
        pet.age = this.age;
        pet.type = this.type;
        pet.createdAt = this.createdAt;
        pet.updatedAt = this.updatedAt;
        return pet;
    }
}

