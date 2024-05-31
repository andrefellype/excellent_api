export interface ClientModel {
    id: number;
    name: string;
    document_number: string;
    email: string;
    created_at: string;
}

export interface ClientEntity {
    id: number;
    name: string;
    documentNumber: string;
    email: string;
    created: string;
}

export const ClientRequest = (clientModel: ClientModel): ClientEntity => {
    return {
        id: clientModel.id,
        name: clientModel.name,
        documentNumber: clientModel.document_number,
        email: clientModel.email,
        created: clientModel.created_at
    }
}