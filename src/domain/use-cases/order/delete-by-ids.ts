import { OrderRepository } from "@data/interfaces/repositories"
import { OrderDeleteByIdsUseCase } from "@domain/interfaces/use-cases"

export class OrderDeleteByIds implements OrderDeleteByIdsUseCase {
    private orderRepository: OrderRepository
    constructor(orderRepository: OrderRepository) { this.orderRepository = orderRepository }

    async execute(ids: number[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.orderRepository.deleteByIds(ids).then(_ => resolve()).catch(e => reject(e))
        })
    }
}