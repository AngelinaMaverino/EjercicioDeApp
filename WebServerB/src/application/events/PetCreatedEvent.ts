import { Pet } from "../../domain/Pet";

export class PetCreatedEvent {
    id: number;
    name: string;
    age: number;
    type: string;
    createdAt: string;
    updatedAt: string;

    constructor(id: number, name: string, age: number, type: string, createdAt: string, updatedAt: string) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromEntity(pet: Pet): PetCreatedEvent {
        return new PetCreatedEvent(
            pet.id,
            pet.name,
            pet.age,
            pet.type,
            pet.createdAt.toISOString(),
            pet.updatedAt.toISOString()
        );
    }

    toEntity(): Pet {
        const pet = new Pet();
        pet.id = this.id;
        pet.name = this.name;
        pet.age = this.age;
        pet.type = this.type;
        pet.createdAt = new Date(this.createdAt);
        pet.updatedAt = new Date(this.updatedAt);
        return pet;
    }
}

