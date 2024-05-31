import { ClientRepository } from "@data/interfaces/repositories";
import { ClientDeleteByIdUseCase } from "@domain/interfaces/use-cases";

export class ClientDeleteById implements ClientDeleteByIdUseCase {
    private clientRepository: ClientRepository
    constructor(clientRepository: ClientRepository) { this.clientRepository = clientRepository }

    async execute(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.clientRepository.deleteByIds([id]).then(_ => resolve()).catch(e => reject(e))
        })
    }
}