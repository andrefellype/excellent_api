import { ClientRepository } from "@data/interfaces/repositories"
import { ClientOpenAllUseCase } from "@domain/interfaces/use-cases"
import { ClientEntity, ClientRequest } from "@domain/models/client"

export class ClientOpenAll implements ClientOpenAllUseCase {
    private clientRepository: ClientRepository
    constructor(clientRepository: ClientRepository) { this.clientRepository = clientRepository }

    execute(): Promise<ClientEntity[]> {
        return new Promise((resolve, reject) => {
            this.clientRepository.findAll().then(async valuesClient => {
                const clients: ClientEntity[] = valuesClient.map(u => ClientRequest(u))
                resolve(clients)
            }).catch(err => reject(err))
        })
    }
}