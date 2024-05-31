import { ProductEntity } from "@domain/models/product";

export interface ProductOpenByIdUseCase { execute(productId: number): Promise<ProductEntity> }