import { ClientDataSource, MYSQLDatabaseWrapper } from "@data/interfaces/data-sources/mysql"
import { ClientModel } from "@domain/models/client"
import { VARIABLES_VALIDATION } from "@utils"

export class ClientDataSourceImpl implements ClientDataSource {

    private TABLE_NAME = "client"

    private db: MYSQLDatabaseWrapper
    constructor(db: MYSQLDatabaseWrapper) { this.db = db }

    insert(name: string, documentNumber: string, email: string, createdAt: string, updatedAt: string | null): Promise<number> {
        return new Promise(async (resolve, reject) => {
            const fields = "name, document_number, email, created_at, updated_at"
            const updatedValue = updatedAt != null ? `'${updatedAt}'` : null
            const values = `'${name}', '${documentNumber}', '${email}', '${createdAt}', ${updatedValue}`
            this.db.execute(`INSERT INTO ${this.TABLE_NAME}(${fields}) VALUES (${values})`).then(valuesId => {
                if (valuesId.length > 0) resolve(valuesId[0].insertId);
                else reject(VARIABLES_VALIDATION.FAIL)
            }).catch(e => reject(e))
        })
    }

    findByDocumentNumber(documentNumber: string, idsException: number[]): Promise<ClientModel[]> {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${this.TABLE_NAME} WHERE document_number = '${documentNumber}'`
            if (idsException.length > 0) sql += ` AND id NOT IN (${idsException.join()})`
            await this.db.query(sql).then(value => resolve(value[0])).catch(e => reject(e))
        })
    }

    findAll(): Promise<ClientModel[]> {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${this.TABLE_NAME}`
            await this.db.query(sql).then(value => resolve(value[0])).catch(e => reject(e))
        })
    }

    findOneById(id: number): Promise<ClientModel | null> {
        return new Promise(async (resolve, reject) => {
            await this.db.query(`SELECT * FROM ${this.TABLE_NAME} WHERE id = ${id}`).then(value => {
                if (value[0].length > 0) resolve(value[0][0]); else resolve(null)
            }).catch(e => reject(e))
        })
    }

    updateAllById(id: number, name: string, email: string, updatedAt: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const values = `name = '${name}', email = '${email}', updated_at = '${updatedAt}'`
            this.db.execute(`UPDATE ${this.TABLE_NAME} SET ${values} WHERE id = ${id}`).then(_ => resolve()).catch(e => reject(e))
        })
    }

    deleteByIds(ids: number[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (ids.length > 0) {
                this.db.execute(`DELETE FROM ${this.TABLE_NAME} WHERE id IN (${ids.join()})`).then(_ => resolve()).catch(e => reject(e))
            } else resolve()
        })
    }
}