import {RabbitMQQueueAdapter} from "../queues/RabbitMQQueueAdapter";
import {IQueueFactory} from "../../application/interfaces/factories/IQueueFactory";
import {IQueue} from "../../application/interfaces/IQueue";

export class QueueFactory implements IQueueFactory{
    private queues = new Map<string, IQueue<any>>();

     async getQueue<T>(queueName: string, exchange?: string, routingKey?: string): Promise<IQueue<T>> {
        const key = `${queueName}|${exchange || ''}|${routingKey || ''}`;

        if (this.queues.has(key)) {
            return this.queues.get(key) as IQueue<T>;
        }

        const queueType = process.env.QUEUE_TYPE;
        let queue: IQueue<T>;

        switch (queueType) {
            case 'RABBITMQ':
                queue = new RabbitMQQueueAdapter<T>(queueName, exchange, routingKey);
                await queue.init();
                break;
            default:
                throw new Error(`Unsupported queue type: ${queueType}`);
        }

        this.queues.set(key, queue);
        return queue;
    }
}

