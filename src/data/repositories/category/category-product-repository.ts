import { CategoryProductDataSource } from "@data/interfaces/data-sources/mysql"
import { CategoryProductRepository } from "@data/interfaces/repositories"
import { CategoryProductModel } from "@domain/models/category"
import { CONVERT_DATE_TIME_BY_DATE_STR } from "@utils"

export class CategoryProductRepositoryImpl implements CategoryProductRepository {
    private categoryProductDataSource: CategoryProductDataSource
    constructor(categoryProductDataSource: CategoryProductDataSource) { this.categoryProductDataSource = categoryProductDataSource }

    findAll(): Promise<CategoryProductModel[]> { return this.categoryProductDataSource.findAll() }

    insert(value: { name: string; icon: string | null; }): Promise<void> {
        return this.categoryProductDataSource.insert(value.name, value.icon, CONVERT_DATE_TIME_BY_DATE_STR(), null)
    }

    findByName(name: string, idsException?: number[]): Promise<CategoryProductModel[]> {
        const idsExceptionValue = typeof idsException != "undefined" ? idsException : []
        return this.categoryProductDataSource.findByName(name, idsExceptionValue)
    }

    findOneById(id: number): Promise<CategoryProductModel | null> { return this.categoryProductDataSource.findOneById(id) }

    updateAllById(id: number, value: { name: string; icon: string | null; }): Promise<void> {
        return this.categoryProductDataSource.updateAllById(id, value.name, value.icon, CONVERT_DATE_TIME_BY_DATE_STR())
    }

    deleteByIds(ids: number[]): Promise<void> { return this.categoryProductDataSource.deleteByIds(ids) }
}