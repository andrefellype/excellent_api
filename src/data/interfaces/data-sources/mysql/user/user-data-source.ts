import { UserModel } from "@domain/models/user";

export interface UserDataSource {
    insert(
        name: string, cellphone: string, password: string, isAdmin: boolean, isEnabled: boolean, createdAt: string, updatedAt: string | null
    ): Promise<number>;
    findOneById(id: number): Promise<UserModel | null>
    findByCellphone(cellphone: string, idsException: number[]): Promise<UserModel[]>
    findOneByCellphoneAndPassword(cellphone: string, password: string): Promise<UserModel | null>
    updateAllById(id: number, name: string, cellphone: string, updatedAt: string): Promise<void>;
    updatePasswordById(id: number, password: string, updatedAt: string): Promise<void>;
    findAll(idsException: number[]): Promise<UserModel[]>;
    updateIsEnabledById(id: number, isEnabled: boolean, updatedAt: string): Promise<void>;
    deleteByIds(ids: number[]): Promise<void>;
}