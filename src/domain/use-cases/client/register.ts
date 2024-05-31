import { ClientRepository } from '@data/interfaces/repositories';
import { ClientRegisterUseCase } from '@/domain/interfaces/use-cases';

export class ClientRegister implements ClientRegisterUseCase {
    private clientRepository: ClientRepository
    constructor(clientRepository: ClientRepository) { this.clientRepository = clientRepository }

    async execute(value: { name: string; documentNumber: string; email: string; }): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.clientRepository.insert({ name: value.name, documentNumber: value.documentNumber, email: value.email }).then(async _ => resolve())
        })
    }
}