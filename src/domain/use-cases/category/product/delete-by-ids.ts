import { CategoryProductRepository } from "@data/interfaces/repositories"
import { CategoryProductDeleteByIdsUseCase } from "@domain/interfaces/use-cases"

export class CategoryProductDeleteByIds implements CategoryProductDeleteByIdsUseCase {
    private categoryProductRepository: CategoryProductRepository
    constructor(categoryProductRepository: CategoryProductRepository) { this.categoryProductRepository = categoryProductRepository }

    async execute(ids: number[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.categoryProductRepository.deleteByIds(ids).then(_ => resolve()).catch(e => reject(e))
        })
    }
}