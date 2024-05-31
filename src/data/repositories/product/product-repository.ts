import { ProductDataSource } from "@data/interfaces/data-sources/mysql"
import { ProductRepository } from "@data/interfaces/repositories"
import { ProductModel } from "@domain/models/product"
import { CONVERT_DATE_TIME_BY_DATE_STR } from "@utils"

export class ProductRepositoryImpl implements ProductRepository {
    private productDataSource: ProductDataSource
    constructor(productDataSource: ProductDataSource) { this.productDataSource = productDataSource }

    findAll(): Promise<ProductModel[]> { return this.productDataSource.findAll() }

    insert(value: { description: string; grossPrice: string | null, salePrice: string | null, photo: string | null; }): Promise<void> {
        return this.productDataSource.insert(value.description, value.grossPrice, value.salePrice, value.photo, CONVERT_DATE_TIME_BY_DATE_STR(), null)
    }

    findByDescription(desccription: string, idsException?: number[]): Promise<ProductModel[]> {
        const idsExceptionValue = typeof idsException != "undefined" ? idsException : []
        return this.productDataSource.findByDescription(desccription, idsExceptionValue)
    }

    findOneById(id: number): Promise<ProductModel | null> { return this.productDataSource.findOneById(id) }

    updateAllById(id: number, value: { description: string; grossPrice: string | null, salePrice: string | null, photo: string | null; }): Promise<void> {
        return this.productDataSource.updateAllById(id, value.description, value.grossPrice, value.salePrice, value.photo, CONVERT_DATE_TIME_BY_DATE_STR())
    }

    deleteByIds(ids: number[]): Promise<void> { return this.productDataSource.deleteByIds(ids) }
}