import { OrderRepository } from "@data/interfaces/repositories";
import { OrderRegisterUseCase } from "@domain/interfaces/use-cases";

export class OrderRegister implements OrderRegisterUseCase {
    private orderRepository: OrderRepository
    constructor(orderRepository: OrderRepository) { this.orderRepository = orderRepository }

    execute(value: { quantity: number; productId: number; clientId: number; }): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.orderRepository.insert({ quantity: value.quantity, productId: value.productId, clientId: value.clientId }).then(_ => resolve()).catch(e => reject(e))
        })
    }
}