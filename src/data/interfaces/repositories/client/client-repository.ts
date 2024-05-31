import { ClientModel } from "@domain/models/client";

export interface ClientRepository {
    insert(value: { name: string, documentNumber: string, email: string }): Promise<number>;
    findByDocumentNumber(documentNumber: string, idsException?: number[]): Promise<ClientModel[]>;
    findAll(): Promise<ClientModel[]>;
    findOneById(id: number): Promise<ClientModel | null>
    updateAllById(id: number, value: { name: string, email: string }): Promise<void>;
    deleteByIds(ids: number[]): Promise<void>;
}