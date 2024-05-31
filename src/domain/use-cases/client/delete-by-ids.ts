import { ClientRepository } from "@data/interfaces/repositories";
import { ClientDeleteByIdsUseCase } from "@domain/interfaces/use-cases";

export class ClientDeleteByIds implements ClientDeleteByIdsUseCase {
    private clientRepository: ClientRepository
    constructor(clientRepository: ClientRepository) { this.clientRepository = clientRepository }

    async execute(ids: number[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.clientRepository.deleteByIds(ids).then(_ => resolve()).catch(e => reject(e))
        })
    }
}