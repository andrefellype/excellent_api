import { OrderDataSource } from "@data/interfaces/data-sources/mysql/order/order-data-source"
import { OrderRepository } from "@data/interfaces/repositories"
import { OrderModel } from "@domain/models/order"
import { CONVERT_DATE_TIME_BY_DATE_STR } from "@utils"

export class OrderRepositoryImpl implements OrderRepository {
    private orderDataSource: OrderDataSource
    constructor(orderDataSource: OrderDataSource) { this.orderDataSource = orderDataSource }

    findAll(): Promise<OrderModel[]> { return this.orderDataSource.findAll() }

    insert(value: { quantity: number; productId: number; clientId: number; }): Promise<void> {
        return this.orderDataSource.insert(value.quantity, value.productId, value.clientId, CONVERT_DATE_TIME_BY_DATE_STR())
    }

    deleteByIds(ids: number[]): Promise<void> { return this.orderDataSource.deleteByIds(ids) }
}