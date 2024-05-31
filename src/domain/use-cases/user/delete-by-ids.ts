import { UserRepository } from "@data/interfaces/repositories";
import { UserDeleteByIdsUseCase } from "@domain/interfaces/use-cases";

export class UserDeleteByIds implements UserDeleteByIdsUseCase {
    private userRepository: UserRepository
    constructor(userRepository: UserRepository) { this.userRepository = userRepository }

    async execute(ids: number[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.userRepository.deleteByIds(ids).then(_ => resolve()).catch(e => reject(e))
        })
    }
}