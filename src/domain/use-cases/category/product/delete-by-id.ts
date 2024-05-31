import { CategoryProductRepository } from "@data/interfaces/repositories"
import { CategoryProductDeleteByIdUseCase } from "@domain/interfaces/use-cases"

export class CategoryProductDeleteById implements CategoryProductDeleteByIdUseCase {
    private categoryProductRepository: CategoryProductRepository
    constructor(categoryProductRepository: CategoryProductRepository) { this.categoryProductRepository = categoryProductRepository }

    async execute(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.categoryProductRepository.deleteByIds([id]).then(_ => resolve()).catch(e => reject(e))
        })
    }
}