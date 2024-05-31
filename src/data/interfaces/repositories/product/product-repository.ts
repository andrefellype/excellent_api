import { ProductModel } from "@domain/models/product";

export interface ProductRepository {
    findAll(): Promise<ProductModel[]>;
    insert(value: { description: string, grossPrice: string | null, salePrice: string | null, photo: string | null }): Promise<void>;
    findByDescription(description: string, idsException?: number[]): Promise<ProductModel[]>
    findOneById(id: number): Promise<ProductModel | null>
    updateAllById(id: number, value: { description: string, grossPrice: string | null, salePrice: string | null, photo: string | null }): Promise<void>;
    deleteByIds(ids: number[]): Promise<void>;
}