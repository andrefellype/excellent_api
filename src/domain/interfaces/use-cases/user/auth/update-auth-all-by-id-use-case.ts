import { UserAuthType } from "@domain/models/user";

export interface UserUpdateAuthAllByIdUseCase {
    execute(id: number, value: { name: string, cellphone: string }): Promise<{ user: UserAuthType, token: string } | null>;
}