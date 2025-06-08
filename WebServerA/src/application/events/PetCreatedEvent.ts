import {Pet} from "../../domain/Pet";

export class PetCreatedEvent {
    id: number;
    name: string;
    age: number;
    type: string;

    constructor(id: number, name: string, age: number, type: string) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.type = type;
    }

    static fromEntity(pet: Pet): PetCreatedEvent {
        return new PetCreatedEvent(pet.id, pet.name, pet.age, pet.type);
    }
}
