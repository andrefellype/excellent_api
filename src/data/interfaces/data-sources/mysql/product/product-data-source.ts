import { ProductModel } from "@domain/models/product";

export interface ProductDataSource {
    findAll(): Promise<ProductModel[]>;
    insert(description: string, grossPrice: string | null, salePrice: string | null, photo: string | null, createdAt: string, updatedAt: string | null): Promise<void>;
    findByDescription(description: string, idsException: number[]): Promise<ProductModel[]>
    findOneById(id: number): Promise<ProductModel | null>
    updateAllById(id: number, description: string, grossPrice: string | null, salePrice: string | null, photo: string | null, updatedAt: string): Promise<void>;
    deleteByIds(ids: number[]): Promise<void>;
}