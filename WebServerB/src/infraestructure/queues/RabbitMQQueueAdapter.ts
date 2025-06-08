import {Channel, Connection, connect} from "amqplib";
import {IQueue} from "../../application/interfaces/IQueue";
export class RabbitMQQueueAdapter<T> implements IQueue<T> {
    private connection!: Connection;
    private publishChannel!: Channel;  
    private consumeChannel!: Channel;  
    private queueName: string;
    private exchangeName?: string;
    private routingKey?: string;

    constructor(queueName: string, exchangeName?: string, routingKey?: string) {
        this.queueName = queueName;
        this.exchangeName = exchangeName;
        this.routingKey = routingKey;
    }

    async init(): Promise<void> {
        console.log("Initializing RabbitMQ Queue");
        this.connection = await connect('amqp://guest:guest@localhost');
        
        this.publishChannel = await this.connection.createChannel();
        this.consumeChannel = await this.connection.createChannel();

        if (this.exchangeName) {
            await this.publishChannel.assertExchange(this.exchangeName, 'topic', { durable: true });

            await this.consumeChannel.assertQueue(this.queueName, { durable: true });
            await this.consumeChannel.bindQueue(this.queueName, this.exchangeName, this.routingKey || '');
        } else {
            await this.consumeChannel.assertQueue(this.queueName, { durable: true });
        }

        await this.consumeChannel.prefetch(1);
    }

    async add(data: T, routingKey?: string): Promise<void> {
        console.log(`[Queue] Agregando mensaje a la cola:`, data);
        if (!this.publishChannel) throw new Error("RabbitMQQueueAdapter not initialized. Call init() first.");

        if (this.exchangeName) {
            this.publishChannel.publish(this.exchangeName, routingKey || this.routingKey || '', Buffer.from(JSON.stringify(data)));
        } else {
            this.publishChannel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(data)));
        }
    }

    private isConsuming = false;

    process(callback: (data: T) => Promise<void>): void {
        if (!this.consumeChannel) throw new Error("RabbitMQQueueAdapter not initialized. Call init() first.");
        if (this.isConsuming) {
            throw new Error("Already consuming on this queue adapter instance.");
        }
        this.isConsuming = true;

        this.consumeChannel.consume(this.queueName, async msg => {
            if (msg !== null) {
                const deliveryTag = msg.fields.deliveryTag;
                try {
                    const data = JSON.parse(msg.content.toString()) as T;
                    console.log(`Consuming message, deliveryTag: ${deliveryTag}`);
                    await callback(data);
                    this.consumeChannel.ack(msg);
                    console.log(`Message acked, deliveryTag: ${deliveryTag}`);
                } catch (error) {
                    console.error('Error processing message:', error);
                    this.consumeChannel.nack(msg, false, false);
                }
            }
        }, { noAck: false });
    }
}
