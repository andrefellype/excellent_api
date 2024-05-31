import { UserRepository } from "@data/interfaces/repositories";
import { UserDeleteByIdUseCase } from "@domain/interfaces/use-cases";

export class UserDeleteById implements UserDeleteByIdUseCase {
    private userRepository: UserRepository
    constructor(userRepository: UserRepository) { this.userRepository = userRepository }

    async execute(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.userRepository.deleteByIds([id]).then(_ => resolve()).catch(e => reject(e))
        })
    }
}