import { inject, injectable } from "inversify";
import TYPES from "../../types/types";
import { IRepository } from "../../domain/interfaces/IRepository";
import { Pet } from "../../domain/Pet";
import { ICreatePetUseCase } from "../interfaces/iusercases/ICreatePetUseCase";
import { PostPetDTO } from "../DTOs/In/PostPetDTO";
import { GetPetDTO } from "../DTOs/Out/GetPetDTO";
import { IQueue } from "../interfaces/IQueue";
import { PetCreatedEvent } from "../events/PetCreatedEvent";

@injectable()
export class CreatePetUseCase implements ICreatePetUseCase {
    constructor(
        @inject(TYPES.Repository) private petRepository: IRepository<Pet>,
        @inject(TYPES.PetCreatedQueue) private petCreatedQueue: IQueue<PetCreatedEvent>
    ) {}

    async execute(data: PostPetDTO): Promise<GetPetDTO> {
        const savedPet = await this.petRepository.add(data.toEntity());
        const event = PetCreatedEvent.fromEntity(savedPet);
        await this.petCreatedQueue.add(event);

        return GetPetDTO.fromEntity(savedPet);
    }
}
