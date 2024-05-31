import { ClientEntity } from "../client";
import { ProductEntity } from "../product";

export interface OrderModel {
    id: number;
    quantity: number;
    product_id: number;
    client_id: number;
}

export interface OrderEntity {
    id: number;
    quantity: number;
    product: ProductEntity | null;
    client: ClientEntity | null;
}

export const OrderRequest = (orderModel: OrderModel, product: ProductEntity | null = null, client: ClientEntity | null = null): OrderEntity => {
    const dataReturn: OrderEntity = { id: orderModel.id, quantity: orderModel.quantity, product, client }
    return dataReturn
}