import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { ICreatePetUseCase } from "../application/interfaces/iusercases/ICreatePetUseCase";
import { IGetPetByIdUseCase } from "../application/interfaces/iusercases/IGetPetByIdUseCase";
import TYPES from "../types/types";
import { PostPetDTO } from "../application/DTOs/In/PostPetDTO";

@injectable()
export class PetController {
    constructor(
        @inject(TYPES.ICreatePetUseCase)
        private createPetUseCase: ICreatePetUseCase,

        @inject(TYPES.IGetPetByIdUseCase)
        private getPetByIdUseCase: IGetPetByIdUseCase
    ) {}

    async postPet(req: Request, res: Response) {
        try {
            const createdPet = await this.createPetUseCase.execute(PostPetDTO.fromRequest(req));
            res.status(201).json(createdPet);
        } catch (error) {
            console.error("Error in postPet:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async getPetById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const pet = await this.getPetByIdUseCase.execute(id);
            if (!pet) {
                return res.status(404).send("Pet not found");
            }
            res.json(pet);
        } catch (error) {
            console.error("Error in getPetById:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}
