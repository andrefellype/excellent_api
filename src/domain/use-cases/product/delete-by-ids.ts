import { ProductRepository } from "@data/interfaces/repositories"
import { ProductDeleteByIdsUseCase } from "@domain/interfaces/use-cases"

export class ProductDeleteByIds implements ProductDeleteByIdsUseCase {
    private productRepository: ProductRepository
    constructor(productRepository: ProductRepository) { this.productRepository = productRepository }

    async execute(ids: number[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.productRepository.deleteByIds(ids).then(_ => resolve()).catch(e => reject(e))
        })
    }
}