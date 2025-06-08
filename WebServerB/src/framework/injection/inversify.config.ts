import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from '../../types/types';
import { IQueueFactory } from '../../application/interfaces/factories/IQueueFactory';
import { QueueFactory } from '../../infraestructure/factories/QueueFactory';
import { PetCreatedEvent } from '../../application/events/PetCreatedEvent';
import { IQueue } from '../../application/interfaces/IQueue';
import { IRepository } from '../../domain/interfaces/IRepository';
import { Pet } from '../../domain/Pet';
import {Repository} from "../../infraestructure/dataAccess/Repository";
import {PetCreatedSubscriber} from "../../application/subscribers/PetCreatedSubscriber";
import { IGetAllPetsUseCase } from '../../application/interfaces/iusercases/IGetAllPetsUseCase';
import {GetAllPetsUseCase} from "../../application/usecases/GetAllPetsUseCase";

const container = new Container();


container.bind<IGetAllPetsUseCase>(TYPES.GetAllPetsUseCase).to(GetAllPetsUseCase);

container.bind<IQueueFactory>(TYPES.IQueueFactory).to(QueueFactory).inSingletonScope();
container.bind<IRepository<Pet>>(TYPES.Repository).to(Repository);
container.bind<PetCreatedSubscriber>(TYPES.PetCreatedSubscriber).to(PetCreatedSubscriber);

async function initQueueBindings(): Promise<void> {
    const queueFactory = container.get<IQueueFactory>(TYPES.IQueueFactory);
    const queue = await queueFactory.getQueue<PetCreatedEvent>("pet.created.queue");
    container.bind<IQueue<PetCreatedEvent>>(TYPES.PetCreatedQueue).toConstantValue(queue);
}

export { container, initQueueBindings };
