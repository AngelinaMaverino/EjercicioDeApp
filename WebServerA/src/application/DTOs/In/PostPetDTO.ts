import { Pet } from "../../../domain/Pet";

export class PostPetDTO {
    name: string;
    age: number;
    type: string;

    constructor(
        name: string,
        age: number,
        type: string,
    ) {
        this.name = name;
        this.age = age;
        this.type = type;
    }

    static fromRequest(req: any): PostPetDTO {
        return new PostPetDTO(
            req.body.name,
            Number(req.body.age),
            req.body.type
        );
    }

    toEntity(): Pet {
        const pet = new Pet();
        pet.name = this.name;
        pet.age = this.age;
        pet.type = this.type;
        return pet;
    }

}
