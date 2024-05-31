export interface UserRegisterUseCase {
    execute(value: { name: string, cellphone: string, password: string, isAdmin: boolean }): Promise<void>;
}