import { UserAuthType } from "@domain/models/user";

export interface UserRefreshTokenUseCase { execute(userAuth: UserAuthType): Promise<{ user: UserAuthType, token: string } | null> }