import { ProductRepository } from "@data/interfaces/repositories"
import { ProductDeleteByIdUseCase } from "@domain/interfaces/use-cases"

export class ProductDeleteById implements ProductDeleteByIdUseCase {
    private productRepository: ProductRepository
    constructor(productRepository: ProductRepository) { this.productRepository = productRepository }

    async execute(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.productRepository.deleteByIds([id]).then(_ => resolve()).catch(e => reject(e))
        })
    }
}