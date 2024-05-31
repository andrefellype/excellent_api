import { CategoryProductModel } from "@domain/models/category";

export interface CategoryProductRepository {
    findAll(): Promise<CategoryProductModel[]>;
    insert(value: { name: string, icon: string | null }): Promise<void>;
    findByName(name: string, idsException?: number[]): Promise<CategoryProductModel[]>
    findOneById(id: number): Promise<CategoryProductModel | null>
    updateAllById(id: number, value: { name: string, icon: string | null }): Promise<void>;
    deleteByIds(ids: number[]): Promise<void>;
}