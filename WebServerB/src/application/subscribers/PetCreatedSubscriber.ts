import { injectable, inject } from "inversify";
import TYPES from "../../types/types";
import { IQueue } from "../../application/interfaces/IQueue";
import { PetCreatedEvent } from "../../application/events/PetCreatedEvent";
import { IRepository } from "../../domain/interfaces/IRepository";
import { Pet } from "../../domain/Pet";

@injectable()
export class PetCreatedSubscriber {
    constructor(
        @inject(TYPES.Repository) private repository: IRepository<Pet>
    ) {}

    async handle(event: any): Promise<void> {
        const restoredEvent = Object.assign(new PetCreatedEvent(
            event.id,
            event.name,
            event.age,
            event.type,
            event.createdAt,
            event.updatedAt
        ), event);

        const pet = restoredEvent.toEntity();
        await this.repository.add(pet);
    }

}

