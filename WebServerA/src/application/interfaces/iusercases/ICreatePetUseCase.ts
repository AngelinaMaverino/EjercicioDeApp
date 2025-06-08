import { PostPetDTO } from "../../DTOs/In/PostPetDTO";
import {GetPetDTO} from "../../DTOs/Out/GetPetDTO";

export interface ICreatePetUseCase {
    execute(data: PostPetDTO): Promise<GetPetDTO>;
}
