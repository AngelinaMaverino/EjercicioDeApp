import "reflect-metadata";
import { DataSource } from "typeorm";
import { Pet } from "../../domain/Pet"; 

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "tu_contraseña",
    database: "nombre_de_tu_base",
    synchronize: true, 
    logging: false,
    entities: [Pet], 
    migrations: [],
    subscribers: [],
});
