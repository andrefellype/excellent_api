import { MYSQLDatabaseWrapper, UserDataSource } from "@data/interfaces/data-sources/mysql"
import { UserModel } from "@domain/models/user"
import { VARIABLES_VALIDATION } from "@utils"

export class UserDataSourceImpl implements UserDataSource {

    private TABLE_NAME = "user"

    private db: MYSQLDatabaseWrapper
    constructor(db: MYSQLDatabaseWrapper) { this.db = db }

    insert(name: string, cellphone: string, password: string, isAdmin: boolean, isEnabled: boolean, createdAt: string, updatedAt: string | null): Promise<number> {
        return new Promise(async (resolve, reject) => {
            const fields = "name, cellphone, password, is_admin, is_enabled, created_at, updated_at"
            const cellphoneValue = cellphone != null ? `'${cellphone}'` : null
            const updatedValue = updatedAt != null ? `'${updatedAt}'` : null
            const values = `'${name}', ${cellphoneValue}, '${password}', ${isAdmin}, ${isEnabled}, '${createdAt}', ${updatedValue}`
            this.db.execute(`INSERT INTO ${this.TABLE_NAME}(${fields}) VALUES (${values})`).then(valuesId => {
                if (valuesId.length > 0) resolve(valuesId[0].insertId);
                else reject(VARIABLES_VALIDATION.FAIL)
            }).catch(e => reject(e))
        })
    }

    findOneById(id: number): Promise<UserModel | null> {
        return new Promise(async (resolve, reject) => {
            await this.db.query(`SELECT * FROM ${this.TABLE_NAME} WHERE id = ${id}`).then(value => {
                if (value[0].length > 0) resolve(value[0][0]); else resolve(null)
            }).catch(e => reject(e))
        })
    }

    findByCellphone(cellphone: string, idsException: number[]): Promise<UserModel[]> {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${this.TABLE_NAME} WHERE cellphone = '${cellphone}'`
            if (idsException.length > 0) sql += ` AND id NOT IN (${idsException.join()})`
            await this.db.query(sql).then(value => resolve(value[0])).catch(e => reject(e))
        })
    }

    findOneByCellphoneAndPassword(cellphone: string, password: string): Promise<UserModel | null> {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${this.TABLE_NAME} WHERE cellphone = '${cellphone}' AND password = '${password}'`
            await this.db.query(sql).then(value => {
                if (value[0].length > 0) resolve(value[0][0]); else resolve(null)
            }).catch(e => reject(e))
        })
    }

    updateAllById(id: number, name: string, cellphone: string, updatedAt: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const cellphoneValue = cellphone != null ? `'${cellphone}'` : null
            const values = `name = '${name}', cellphone = ${cellphoneValue}, updated_at = '${updatedAt}'`
            this.db.execute(`UPDATE ${this.TABLE_NAME} SET ${values} WHERE id = ${id}`).then(_ => resolve()).catch(e => reject(e))
        })
    }

    updatePasswordById(id: number, password: string, updatedAt: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const values = `password = '${password}', updated_at = '${updatedAt}'`
            this.db.execute(`UPDATE ${this.TABLE_NAME} SET ${values} WHERE id = ${id}`).then(_ => resolve()).catch(e => reject(e))
        })
    }

    findAll(idsException: number[]): Promise<UserModel[]> {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${this.TABLE_NAME}`
            if (idsException.length > 0) sql += ` WHERE id NOT IN (${idsException.join()})`
            await this.db.query(sql).then(value => resolve(value[0])).catch(e => reject(e))
        })
    }

    updateIsEnabledById(id: number, isEnabled: boolean, updatedAt: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const values = `is_enabled = ${isEnabled}, updated_at = '${updatedAt}'`
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