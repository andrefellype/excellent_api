import { CategoryProductRepository } from "@data/interfaces/repositories"
import { CategoryProductOpenByIdUseCase } from "@domain/interfaces/use-cases"
import { CategoryProductEntity, CategoryProductRequest } from "@domain/models/category"
import { VARIABLES_VALIDATION } from "@utils"

export class CategoryProductOpenById implements CategoryProductOpenByIdUseCase {
    private categoryProductRepository: CategoryProductRepository
    constructor(categoryProductRepository: CategoryProductRepository) { this.categoryProductRepository = categoryProductRepository }

    execute(categoryId: number): Promise<CategoryProductEntity> {
        return new Promise(async (resolve, reject) => {
            this.categoryProductRepository.findOneById(categoryId).then(async valueCategoryJson => {
                if (valueCategoryJson != null) resolve(CategoryProductRequest(valueCategoryJson))
                else reject(VARIABLES_VALIDATION.FAIL_NULL)
            }).catch(err => reject(err))
        })
    }
}