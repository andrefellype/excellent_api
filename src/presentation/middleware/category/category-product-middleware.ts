import { CategoryProductRepository } from "@data/interfaces/repositories";
import { CategoryProductDeleteById, CategoryProductDeleteByIds, CategoryProductOpenAll, CategoryProductOpenById, CategoryProductRegister, CategoryProductUpdateAllById } from "@domain/use-cases";
import { CategoryProductRouter } from "@routes";
import { CategoryProductValidation } from "@validation";

export const categoryProductMiddleWare = (categoryProductRepository: CategoryProductRepository) => CategoryProductRouter(
    categoryProductRepository, new CategoryProductValidation(),
    new CategoryProductOpenAll(categoryProductRepository),
    new CategoryProductRegister(categoryProductRepository),
    new CategoryProductOpenById(categoryProductRepository),
    new CategoryProductUpdateAllById(categoryProductRepository),
    new CategoryProductDeleteById(categoryProductRepository),
    new CategoryProductDeleteByIds(categoryProductRepository)
)