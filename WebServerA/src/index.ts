import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./infraestructure/dataAccess/data-source";
import { redisClient } from "./infraestructure/cache/RedisClient"; // 👈 importás redis

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

async function bootstrap() {
    try {
        await redisClient.connect(); 
        console.log("🧠 Conectado a Redis");

        await AppDataSource.initialize();
        console.log("📦 Conexión a MySQL establecida.");

        const petRoutes = require("./routes/petRoutes").default;
        app.use("/", petRoutes);

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error al inicializar la app:", error);
    }
}

bootstrap();
