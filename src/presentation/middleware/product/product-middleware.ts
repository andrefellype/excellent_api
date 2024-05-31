import { ProductRepository } from "@data/interfaces/repositories";
import { ProductDeleteById, ProductDeleteByIds, ProductOpenAll, ProductOpenById, ProductRegister, ProductUpdateAllById } from "@domain/use-cases";
import { ProductRouter } from "@routes";
import { ProductValidation } from "@validation";

export const productMiddleWare = (productRepository: ProductRepository) => ProductRouter(
    productRepository, new ProductValidation(),
    new ProductOpenAll(productRepository),
    new ProductRegister(productRepository),
    new ProductOpenById(productRepository),
    new ProductUpdateAllById(productRepository),
    new ProductDeleteById(productRepository),
    new ProductDeleteByIds(productRepository)
)