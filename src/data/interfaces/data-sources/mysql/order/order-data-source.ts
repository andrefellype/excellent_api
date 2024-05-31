import { OrderModel } from "@domain/models/order";

export interface OrderDataSource {
    findAll(): Promise<OrderModel[]>;
    insert(quantity: number, productId: number, clientId: number, createdAt: string): Promise<void>;
    deleteByIds(ids: number[]): Promise<void>;
}