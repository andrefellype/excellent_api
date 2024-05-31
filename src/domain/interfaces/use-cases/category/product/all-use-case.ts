import { CategoryProductEntity } from "@domain/models/category";

export interface CategoryProductOpenAllUseCase { execute(): Promise<CategoryProductEntity[]> }