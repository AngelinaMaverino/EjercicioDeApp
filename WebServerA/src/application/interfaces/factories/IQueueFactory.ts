import {IQueue} from "../IQueue";

export interface IQueueFactory {
    getQueue<T>(queueName: string, exchange?: string, routingKey?: string): Promise<IQueue<T>>;
}