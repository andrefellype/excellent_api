import { MYSQLDatabaseWrapper, ProductDataSource } from "@data/interfaces/data-sources/mysql"
import { ProductModel } from "@domain/models/product"

export class ProductDataSourceImpl implements ProductDataSource {
    private db: MYSQLDatabaseWrapper
    constructor(db: MYSQLDatabaseWrapper) { this.db = db }

    private TABLE_NAME = "product"

    findAll(): Promise<ProductModel[]> {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${this.TABLE_NAME}`
            await this.db.query(sql).then(value => resolve(value[0])).catch(e => reject(e))
        })
    }

    insert(description: string, grossPrice: string | null, salePrice: string | null, photo: string | null, createdAt: string, updatedAt: string | null): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const fields = "description, gross_price, sale_price, photo, created_at, updated_at"
            const grossPriceValue = grossPrice != null ? `'${grossPrice}'` : null
            const salePriceValue = salePrice != null ? `'${salePrice}'` : null
            const photoValue = photo != null ? `'${photo}'` : null
            const updatedValue = updatedAt != null ? `'${updatedAt}'` : null
            const values = `'${description}', ${grossPriceValue}, ${salePriceValue}, ${photoValue}, '${createdAt}', ${updatedValue}`
            this.db.execute(`INSERT INTO ${this.TABLE_NAME}(${fields}) VALUES (${values})`).then(_ => resolve()).catch(e => reject(e))
        })
    }

    findByDescription(description: string, idsException: number[]): Promise<ProductModel[]> {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${this.TABLE_NAME} WHERE description = '${description}'`
            if (idsException.length > 0) sql += ` AND id NOT IN (${idsException.join()})`
            await this.db.query(sql).then(value => resolve(value[0])).catch(e => reject(e))
        })
    }

    findOneById(id: number): Promise<ProductModel | null> {
        return new Promise(async (resolve, reject) => {
            await this.db.query(`SELECT * FROM ${this.TABLE_NAME} WHERE id = ${id}`).then(value => {
                if (value[0].length > 0) resolve(value[0][0]);
                else resolve(null)
            }).catch(e => reject(e))
        })
    }

    updateAllById(id: number, description: string, grossPrice: string | null, salePrice: string | null, photo: string | null, updatedAt: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const grossPriceValue = grossPrice != null ? `'${grossPrice}'` : null
            const salePriceValue = salePrice != null ? `'${salePrice}'` : null
            const photoValue = photo != null ? `'${photo}'` : null
            const values = `description = '${description}', gross_price = ${grossPriceValue}, sale_price = ${salePriceValue}, photo = ${photoValue}, updated_at = '${updatedAt}'`
            this.db.execute(`UPDATE ${this.TABLE_NAME} SET ${values} WHERE id = ${id}`).then(_ => resolve()).catch(e => reject(e))
        })
    }

    deleteByIds(ids: number[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (ids.length > 0) this.db.execute(`DELETE FROM ${this.TABLE_NAME} WHERE id IN (${ids.join()})`).then(_ => resolve()).catch(e => reject(e));
            else resolve()
        })
    }
}