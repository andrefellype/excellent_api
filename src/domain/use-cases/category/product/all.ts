import { CategoryProductRepository } from "@data/interfaces/repositories"
import { CategoryProductOpenAllUseCase } from "@domain/interfaces/use-cases"
import { CategoryProductEntity, CategoryProductRequest } from "@domain/models/category"

export class CategoryProductOpenAll implements CategoryProductOpenAllUseCase {
    private categoryProductRepository: CategoryProductRepository
    constructor(categoryProductRepository: CategoryProductRepository) { this.categoryProductRepository = categoryProductRepository }

    execute(): Promise<CategoryProductEntity[]> {
        return new Promise((resolve, reject) => {
            this.categoryProductRepository.findAll().then(async valuesCategory => {
                const categories: CategoryProductEntity[] = valuesCategory.map(c => CategoryProductRequest(c))
                resolve(categories)
            }).catch(err => reject(err))
        })
    }
}