import { CategoryProductEntity } from "@domain/models/category";

export interface CategoryProductOpenByIdUseCase { execute(categoryId: number): Promise<CategoryProductEntity> }