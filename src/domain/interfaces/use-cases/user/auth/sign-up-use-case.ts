import { UserAuthType } from "@domain/models/user";

export interface UserSignUpUseCase {
    execute(value: { name: string, cellphone: string, password: string }): Promise<{ user: UserAuthType, token: string }>;
}