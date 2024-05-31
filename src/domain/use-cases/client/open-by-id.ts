import { ClientRepository } from "@data/interfaces/repositories";
import { ClientOpenByIdUseCase } from "@domain/interfaces/use-cases";
import { ClientEntity, ClientRequest } from "@domain/models/client";
import { VARIABLES_VALIDATION } from "@utils";

export class ClientOpenById implements ClientOpenByIdUseCase {
    private clientRepository: ClientRepository
    constructor(clientRepository: ClientRepository) { this.clientRepository = clientRepository }

    execute(id: number): Promise<ClientEntity> {
        return new Promise((resolve, reject) => {
            this.clientRepository.findOneById(id).then(async valueClient => {
                if (valueClient != null) resolve(ClientRequest(valueClient)); else reject(VARIABLES_VALIDATION.FAIL_NULL)
            }).catch(err => reject(err))
        })
    }
}