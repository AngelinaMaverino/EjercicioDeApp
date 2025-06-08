import {GetPetDTO} from "../../DTOs/Out/GetPetDTO";

export interface IGetPetByIdUseCase {
    execute(id: number): Promise<GetPetDTO>;
}