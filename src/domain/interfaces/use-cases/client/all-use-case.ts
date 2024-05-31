import { ClientEntity } from "@domain/models/client";

export interface ClientOpenAllUseCase { execute(): Promise<ClientEntity[]> }