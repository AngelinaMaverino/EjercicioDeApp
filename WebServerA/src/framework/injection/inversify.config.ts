import 'reflect-metadata';
import { Container } from 'inversify';
import  TYPES  from '../../types/types';
import { IQueueFactory } from '../../application/interfaces/factories/IQueueFactory';
import { QueueFactory } from '../../infraestructure/factories/QueueFactory';
import { PetController } from '../../controllers/PetController';
import {ICreatePetUseCase} from "../../application/interfaces/iusercases/ICreatePetUseCase";
import { CreatePetUseCase } from '../../application/usecases/CreatePetUseCase';
import {IRepository} from "../../domain/interfaces/IRepository";
import {Pet} from "../../domain/Pet";
import {Repository} from "../../infraestructure/dataAccess/Repository";
import {AppDataSource} from "../../infraestructure/dataAccess/data-source";
import {DataSource} from "typeorm";
import {IGetPetByIdUseCase} from "../../application/interfaces/iusercases/IGetPetByIdUseCase";
import { GetPetByIdUseCase } from '../../application/usecases/GetPetByIdUseCase';
import {PetCreatedEvent} from "../../application/events/PetCreatedEvent";
import {IQueue} from "../../application/interfaces/IQueue";
const container = new Container();

container.bind<IRepository<Pet>>(TYPES.Repository).toDynamicValue(() => {
    return new Repository<Pet>(AppDataSource, Pet);
}).inRequestScope();

container.bind<IQueueFactory>(TYPES.IQueueFactory).to(QueueFactory).inSingletonScope();

container.bind<DataSource>(TYPES.DataSource).toConstantValue(AppDataSource);

container.bind<PetController>(TYPES.PetController).to(PetController);
container.bind<ICreatePetUseCase>(TYPES.ICreatePetUseCase).to(CreatePetUseCase);

container.bind<IGetPetByIdUseCase>(TYPES.IGetPetByIdUseCase).to(GetPetByIdUseCase);

const queueFactory = new QueueFactory();

container.bind<QueueFactory>(TYPES.QueueFactory).toConstantValue(queueFactory);

queueFactory.getQueue<PetCreatedEvent>("pet.created.queue").then(queue => {
    container.bind<IQueue<PetCreatedEvent>>(TYPES.PetCreatedQueue).toConstantValue(queue);
});

export { container };