import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../types/types";
import { IGetAllPetsUseCase } from "../application/interfaces/iusercases/IGetAllPetsUseCase";

@injectable()
export class PetController {
    constructor(
        @inject(TYPES.GetAllPetsUseCase)
        private getAllPetsUseCase: IGetAllPetsUseCase
    ) {}

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const pets = await this.getAllPetsUseCase.execute();
            res.status(200).json(pets);
        } catch (error) {
            console.error("Error al obtener mascotas:", error);
            res.status(500).send("Error interno del servidor");
        }
    }
}
