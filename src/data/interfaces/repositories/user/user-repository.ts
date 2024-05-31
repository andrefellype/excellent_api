import { UserModel } from "@domain/models/user";

export interface UserRepository {
    insert(value: { name: string, cellphone: string, password: string, isAdmin: boolean }): Promise<number>;
    findOneById(id: number): Promise<UserModel | null>;
    findByCellphone(cellphone: string, idsException?: number[]): Promise<UserModel[]>;
    findOneByCellphoneAndPassword(cellphone: string, password: string): Promise<UserModel | null>;
    updateAllById(id: number, value: { name: string, cellphone: string }): Promise<void>;
    updatePasswordById(id: number, value: { password: string }): Promise<void>;
    findAll(idsException?: number[]): Promise<UserModel[]>;
    updateIsEnabledById(id: number, isEnabled: boolean): Promise<void>;
    deleteByIds(ids: number[]): Promise<void>;
}