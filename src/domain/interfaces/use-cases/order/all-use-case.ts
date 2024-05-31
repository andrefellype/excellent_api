import { OrderEntity } from "@domain/models/order";

export interface OrderOpenAllUseCase { execute(): Promise<OrderEntity[]> }