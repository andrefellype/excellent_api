import { MYSQLDatabaseWrapper } from "@data/interfaces/data-sources/mysql"
import { OrderDataSource } from "@data/interfaces/data-sources/mysql/order/order-data-source"
import { OrderModel } from "@domain/models/order"

export class OrderDataSourceImpl implements OrderDataSource {
    private db: MYSQLDatabaseWrapper
    constructor(db: MYSQLDatabaseWrapper) { this.db = db }

    private TABLE_NAME = "order_product"

    findAll(): Promise<OrderModel[]> {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${this.TABLE_NAME}`
            await this.db.query(sql).then(value => resolve(value[0])).catch(e => reject(e))
        })
    }

    insert(quantity: number, productId: number, clientId: number, createdAt: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const fields = "quantity, product_id, client_id, created_at"
            const values = `${quantity}, ${productId}, ${clientId}, '${createdAt}'`
            this.db.execute(`INSERT INTO ${this.TABLE_NAME}(${fields}) VALUES (${values})`).then(_ => resolve()).catch(e => reject(e))
        })
    }

    deleteByIds(ids: number[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (ids.length > 0) this.db.execute(`DELETE FROM ${this.TABLE_NAME} WHERE id IN (${ids.join()})`).then(_ => resolve()).catch(e => reject(e));
            else resolve()
        })
    }
}