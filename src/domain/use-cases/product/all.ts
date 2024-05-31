import { ProductRepository } from "@data/interfaces/repositories"
import { ProductOpenAllUseCase } from "@domain/interfaces/use-cases"
import { ProductEntity, ProductRequest } from "@domain/models/product"

export class ProductOpenAll implements ProductOpenAllUseCase {
    private productRepository: ProductRepository
    constructor(productRepository: ProductRepository) { this.productRepository = productRepository }

    execute(): Promise<ProductEntity[]> {
        return new Promise((resolve, reject) => {
            this.productRepository.findAll().then(async valuesProduct => {
                const products: ProductEntity[] = valuesProduct.map(p => ProductRequest(p))
                resolve(products)
            }).catch(err => reject(err))
        })
    }
}