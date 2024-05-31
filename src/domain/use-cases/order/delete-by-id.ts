import { OrderRepository } from "@data/interfaces/repositories"
import { OrderDeleteByIdUseCase } from "@domain/interfaces/use-cases"

export class OrderDeleteById implements OrderDeleteByIdUseCase {
    private orderRepository: OrderRepository
    constructor(orderRepository: OrderRepository) { this.orderRepository = orderRepository }

    async execute(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.orderRepository.deleteByIds([id]).then(_ => resolve()).catch(e => reject(e))
        })
    }
}