export interface IQueue<T> {
    add(data: T, routingKey?: string): Promise<void>;
    process(callback: (data: T) => Promise<void>): void;
    init(): Promise<void>;
}