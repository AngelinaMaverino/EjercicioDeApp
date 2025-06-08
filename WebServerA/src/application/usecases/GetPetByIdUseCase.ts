import {inject, injectable } from "inversify";
import { redisClient } from "../../infraestructure/cache/RedisClient";
import { IGetPetByIdUseCase } from "../interfaces/iusercases/IGetPetByIdUseCase";
import {IRepository} from "../../domain/interfaces/IRepository";
import TYPES from "../../types/types";
import {Pet} from "../../domain/Pet";
import {GetPetDTO} from "../DTOs/Out/GetPetDTO";

@injectable()
export class GetPetByIdUseCase implements IGetPetByIdUseCase {
    constructor(
        @inject(TYPES.Repository)
        private petRepository: IRepository<Pet>
    ) {}

    async execute(id: number): Promise<GetPetDTO> {
        const cacheKey = `pet:${id}`;
        
        const cachedPet = await redisClient.get(cacheKey);
        if (cachedPet) {
            return JSON.parse(cachedPet);
        }
        
        const pet = await this.petRepository.getByIdAsync(id);
        if (!pet) {
            throw new Error(`Pet with id ${id} not found`);
        }

        const dto = GetPetDTO.fromEntity(pet);
        
        await redisClient.set(cacheKey, JSON.stringify(dto), {
            EX: 60 * 5,
        });

        return dto;
    }
}

