import { ProductEntity } from "@domain/models/product";

export interface ProductOpenAllUseCase { execute(): Promise<ProductEntity[]> }