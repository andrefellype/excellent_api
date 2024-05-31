import { ClientModel } from "@domain/models/client";

export interface ClientDataSource {
    insert(name: string, documentNumber: string, email: string, createdAt: string, updatedAt: string | null): Promise<number>;
    findByDocumentNumber(documentNumber: string, idsException: number[]): Promise<ClientModel[]>
    findAll(): Promise<ClientModel[]>;
    findOneById(id: number): Promise<ClientModel | null>
    updateAllById(id: number, name: string, email: string, updatedAt: string): Promise<void>;
    deleteByIds(ids: number[]): Promise<void>;
}