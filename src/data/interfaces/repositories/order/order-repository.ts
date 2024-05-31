import { OrderModel } from "@domain/models/order";

export interface OrderRepository {
    findAll(): Promise<OrderModel[]>;
    insert(value: { quantity: number, productId: number, clientId: number }): Promise<void>;
    deleteByIds(ids: number[]): Promise<void>;
}