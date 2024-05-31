import { UserEntity } from "@domain/models/user";

export interface UserOpenAllUseCase { execute(idsException: number): Promise<UserEntity[]> }