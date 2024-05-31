import { UserAuthType } from "@domain/models/user";

export interface UserSignInUseCase { execute(value: { cellphone: string, password: string }): Promise<{ user: UserAuthType, token: string }> }