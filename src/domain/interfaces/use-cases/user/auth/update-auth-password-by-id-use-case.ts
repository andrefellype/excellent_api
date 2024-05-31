import { UserAuthType } from "@domain/models/user";

export interface UserUpdateAuthPasswordByIdUseCase {
    execute(id: number, password: string): Promise<{ user: UserAuthType, token: string } | null>;
}