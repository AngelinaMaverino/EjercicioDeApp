import {GetPetDTO} from "../../DTOs/Out/GetPetDTO";

export interface IGetAllPetsUseCase {
    execute(): Promise<GetPetDTO[]>;
}