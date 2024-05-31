import { ClientEntity } from "@domain/models/client";

export interface ClientOpenByIdUseCase { execute(id: number): Promise<ClientEntity> }