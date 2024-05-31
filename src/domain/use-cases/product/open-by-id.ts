import { ProductRepository } from "@data/interfaces/repositories"
import { ProductOpenByIdUseCase } from "@domain/interfaces/use-cases"
import { ProductEntity, ProductRequest } from "@domain/models/product"
import { VARIABLES_VALIDATION } from "@utils"

export class ProductOpenById implements ProductOpenByIdUseCase {
    private productRepository: ProductRepository
    constructor(productRepository: ProductRepository) { this.productRepository = productRepository }

    execute(productId: number): Promise<ProductEntity> {
        return new Promise(async (resolve, reject) => {
            this.productRepository.findOneById(productId).then(async valueProductJson => {
                if (valueProductJson != null) resolve(ProductRequest(valueProductJson))
                else reject(VARIABLES_VALIDATION.FAIL_NULL)
            }).catch(err => reject(err))
        })
    }
}