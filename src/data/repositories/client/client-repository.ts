import { CONVERT_DATE_TIME_BY_DATE_STR } from "@utils";
import { ClientRepository } from "@data/interfaces/repositories";
import { ClientDataSource } from "@data/interfaces/data-sources/mysql";
import { ClientModel } from "@domain/models/client";

export class ClientRepositoryImpl implements ClientRepository {
    private clientDataSource: ClientDataSource
    constructor(clientDataSource: ClientDataSource) { this.clientDataSource = clientDataSource }

    insert(value: { name: string; documentNumber: string; email: string; }): Promise<number> {
        return this.clientDataSource.insert(value.name, value.documentNumber, value.email, CONVERT_DATE_TIME_BY_DATE_STR(), null)
    }

    findByDocumentNumber(documentNumber: string, idsException?: number[]): Promise<ClientModel[]> {
        const idsExceptionValue = typeof idsException != "undefined" ? idsException : []
        return this.clientDataSource.findByDocumentNumber(documentNumber, idsExceptionValue)
    }

    findAll(): Promise<ClientModel[]> { return this.clientDataSource.findAll() }

    findOneById(id: number): Promise<ClientModel> { return this.clientDataSource.findOneById(id) }

    updateAllById(id: number, value: { name: string, email: string }): Promise<void> {
        return this.clientDataSource.updateAllById(id, value.name, value.email, CONVERT_DATE_TIME_BY_DATE_STR())
    }

    deleteByIds(ids: number[]): Promise<void> { return this.clientDataSource.deleteByIds(ids) }
}