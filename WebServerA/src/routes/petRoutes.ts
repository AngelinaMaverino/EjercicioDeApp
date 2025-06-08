import { Router } from "express";
import {PetController} from "../controllers/PetController";
import TYPES from "../types/types";
import {container} from "../framework/injection/inversify.config";

const router = Router();

router.post("/pets", async (req, res, next) => {
    try {
        const controller = container.get<PetController>(TYPES.PetController);
        await controller.postPet(req, res);
    } catch (err) {
        next(err);
    }
});

router.get("/pets/:id", async (req, res, next) => {
    try {
        const controller = container.get<PetController>(TYPES.PetController);
        await controller.getPetById(req, res);
    } catch (err) {
        next(err);
    }
});

export default router;
