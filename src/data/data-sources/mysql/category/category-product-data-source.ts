import { CategoryProductDataSource, MYSQLDatabaseWrapper } from "@data/interfaces/data-sources/mysql"
import { CategoryProductModel } from "@domain/models/category"

export class CategoryProductDataSourceImpl implements CategoryProductDataSource {
    private db: MYSQLDatabaseWrapper
    constructor(db: MYSQLDatabaseWrapper) { this.db = db }

    private TABLE_NAME = "category_product"

    findAll(): Promise<CategoryProductModel[]> {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${this.TABLE_NAME}`
            await this.db.query(sql).then(value => resolve(value[0])).catch(e => reject(e))
        })
    }

    insert(name: string, icon: string | null, createdAt: string, updatedAt: string | null): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const fields = "name, icon, created_at, updated_at"
            const iconValue = icon != null ? `'${icon}'` : null
            const updatedValue = updatedAt != null ? `'${updatedAt}'` : null
            const values = `'${name}', ${iconValue}, '${createdAt}', ${updatedValue}`
            this.db.execute(`INSERT INTO ${this.TABLE_NAME}(${fields}) VALUES (${values})`).then(_ => resolve()).catch(e => reject(e))
        })
    }

    findByName(name: string, idsException: number[]): Promise<CategoryProductModel[]> {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${this.TABLE_NAME} WHERE name = '${name}'`
            if (idsException.length > 0) sql += ` AND id NOT IN (${idsException.join()})`
            await this.db.query(sql).then(value => resolve(value[0])).catch(e => reject(e))
        })
    }

    findOneById(id: number): Promise<CategoryProductModel | null> {
        return new Promise(async (resolve, reject) => {
            await this.db.query(`SELECT * FROM ${this.TABLE_NAME} WHERE id = ${id}`).then(value => {
                if (value[0].length > 0) resolve(value[0][0]);
                else resolve(null)
            }).catch(e => reject(e))
        })
    }

    updateAllById(id: number, name: string, icon: string | null, updatedAt: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const iconValue = icon != null ? `'${icon}'` : null
            const values = `name = '${name}', icon = ${iconValue}, updated_at = '${updatedAt}'`
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