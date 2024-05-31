import { ClientUpdateAllByIdUseCase } from "@domain/interfaces/use-cases";
import { ClientRepository } from "@data/interfaces/repositories";

export class ClientUpdateAllById implements ClientUpdateAllByIdUseCase {
    private clientRepository: ClientRepository
    constructor(clientRepository: ClientRepository) { this.clientRepository = clientRepository }

    async execute(id: number, value: { name: string, email: string }): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.clientRepository.updateAllById(id, { name: value.name, email: value.email }).then(_ => resolve()).catch(e => reject(e))
        })
    }
}