import { CategoryProductModel } from "@domain/models/category";

export interface CategoryProductDataSource {
    findAll(): Promise<CategoryProductModel[]>;
    insert(name: string, icon: string | null, createdAt: string, updatedAt: string | null): Promise<void>;
    findByName(name: string, idsException: number[]): Promise<CategoryProductModel[]>
    findOneById(id: number): Promise<CategoryProductModel | null>
    updateAllById(id: number, name: string, icon: string | null, updatedAt: string): Promise<void>;
    deleteByIds(ids: number[]): Promise<void>;
}