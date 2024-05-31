import { UserEntity } from "@domain/models/user";

export interface UserOpenByIdUseCase { execute(id: number): Promise<UserEntity> }