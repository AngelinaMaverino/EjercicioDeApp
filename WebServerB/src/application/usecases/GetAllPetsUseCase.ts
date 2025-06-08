import { inject, injectable } from "inversify";
import TYPES from "../../types/types";
import { Pet } from "../../domain/Pet";
import { IRepository } from "../../domain/interfaces/IRepository";
import {GetPetDTO} from "../DTOs/Out/GetPetDTO";
import {IGetAllPetsUseCase} from "../interfaces/iusercases/IGetAllPetsUseCase";


@injectable()
export class GetAllPetsUseCase implements IGetAllPetsUseCase {
    constructor(
        @inject(TYPES.Repository)
        private repository: IRepository<Pet>
    ) {}

    async execute(): Promise<GetPetDTO[]> {
        const pets = await this.repository.getAllAsync();
        return pets.map(GetPetDTO.fromEntity);
    }
}