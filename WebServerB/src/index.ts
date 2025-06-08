import "reflect-metadata";
import express from "express";
import dotenv from 'dotenv';
import { initializeMongo } from "./infraestructure/mongo/mongo-connection";
import {container, initQueueBindings} from "./framework/injection/inversify.config";
import TYPES from "./types/types";
import {IQueue} from "./application/interfaces/IQueue";
import {PetCreatedEvent} from "./application/events/PetCreatedEvent";
import {PetCreatedSubscriber} from "./application/subscribers/PetCreatedSubscriber";


dotenv.config();
const PORT = 4000;
const app = express();
app.use(express.json());

async function bootstrap() {
    await initializeMongo();
    await initQueueBindings(); 

    const queue = container.get<IQueue<PetCreatedEvent>>(TYPES.PetCreatedQueue);
    await queue.init();

    const subscriber = container.get<PetCreatedSubscriber>(TYPES.PetCreatedSubscriber);
    queue.process((event) => subscriber.handle(event));

    const petRoutes = require("./routes/petRoutes").default;
    app.use("/pets", petRoutes);

    app.listen(PORT, () => {
        console.log(`🚀 Servidor (Mongo ReadModel) corriendo en http://localhost:${PORT}`);
    });
}

bootstrap();

