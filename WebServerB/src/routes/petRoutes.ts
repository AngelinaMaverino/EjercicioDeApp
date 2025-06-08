
import { Router } from "express";
import { container } from "../framework/injection/inversify.config";
import TYPES from "../types/types";
import { Pet } from "../domain/Pet";
import { IRepository } from "../domain/interfaces/IRepository";

const router = Router();
const repository = container.get<IRepository<Pet>>(TYPES.Repository);

router.get("/", async (_req, res) => {
    const pets = await repository.getAllAsync();
    res.json(pets);
});

export default router;
