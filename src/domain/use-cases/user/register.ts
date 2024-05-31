import sha1 from 'sha1'
import { UserRepository } from '@data/interfaces/repositories';
import { UserRegisterUseCase } from '@/domain/interfaces/use-cases';

export class UserRegister implements UserRegisterUseCase {
    private userRepository: UserRepository
    constructor(userRepository: UserRepository) { this.userRepository = userRepository }

    async execute(value: { name: string, cellphone: string, password: string, isAdmin: boolean }): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.userRepository.insert({ name: value.name, cellphone: value.cellphone, password: sha1(value.password), isAdmin: value.isAdmin })
                .then(async _ => resolve())
        })
    }
}