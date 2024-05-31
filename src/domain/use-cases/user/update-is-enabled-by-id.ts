import { UserRepository } from "@data/interfaces/repositories";
import { UserUpdateIsEnabledByIdUseCase } from "@domain/interfaces/use-cases";

export class UserUpdateIsEnabledById implements UserUpdateIsEnabledByIdUseCase {
    private userRepository: UserRepository
    constructor(userRepository: UserRepository) { this.userRepository = userRepository }

    async execute(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.userRepository.findOneById(id).then(async valueUser => {
                await this.userRepository.updateIsEnabledById(id, !valueUser?.is_enabled).then(_ => resolve()).catch(e => reject(e))
            })
        })
    }
}