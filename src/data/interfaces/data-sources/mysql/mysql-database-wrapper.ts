export interface MYSQLDatabaseWrapper {
    execute(queryString: String): Promise<{
        fieldCount: number, affectedRows: number, insertId: number, info: number, serverStatus: number, warningStatus: number, changedRows: number
    }[]>
    query(queryString: string): Promise<[any, any]>
}