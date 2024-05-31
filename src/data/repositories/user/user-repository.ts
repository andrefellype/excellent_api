import { CONVERT_DATE_TIME_BY_DATE_STR } from "@utils";
import { UserRepository } from "@data/interfaces/repositories";
import { UserDataSource } from "@data/interfaces/data-sources/mysql";
import { UserModel } from "@domain/models/user";

export class UserRepositoryImpl implements UserRepository {
    private userDataSource: UserDataSource
    constructor(userDataSource: UserDataSource) { this.userDataSource = userDataSource }

    insert(value: { name: string; cellphone: string; password: string; isAdmin: boolean; }): Promise<number> {
        return this.userDataSource.insert(value.name, value.cellphone, value.password, value.isAdmin, true, CONVERT_DATE_TIME_BY_DATE_STR(), null)
    }

    findOneById(id: number): Promise<UserModel | null> { return this.userDataSource.findOneById(id) }

    findByCellphone(cellphone: string, idsException?: number[]): Promise<UserModel[]> {
        const idsExceptionValue = typeof idsException != "undefined" ? idsException : []
        return this.userDataSource.findByCellphone(cellphone, idsExceptionValue)
    }

    findOneByCellphoneAndPassword(cellphone: string, password: string): Promise<UserModel | null> {
        return this.userDataSource.findOneByCellphoneAndPassword(cellphone, password)
    }

    updateAllById(id: number, value: { name: string, cellphone: string }): Promise<void> {
        return this.userDataSource.updateAllById(id, value.name, value.cellphone, CONVERT_DATE_TIME_BY_DATE_STR())
    }

    updatePasswordById(id: number, value: { password: string; }): Promise<void> {
        return this.userDataSource.updatePasswordById(id, value.password, CONVERT_DATE_TIME_BY_DATE_STR())
    }

    findAll(idsException?: number[]): Promise<UserModel[]> {
        const idsExceptionValue = typeof idsException != "undefined" ? idsException : []
        return this.userDataSource.findAll(idsExceptionValue)
    }

    updateIsEnabledById(id: number, isEnabled: boolean): Promise<void> {
        return this.userDataSource.updateIsEnabledById(id, isEnabled, CONVERT_DATE_TIME_BY_DATE_STR())
    }

    deleteByIds(ids: number[]): Promise<void> { return this.userDataSource.deleteByIds(ids) }
}