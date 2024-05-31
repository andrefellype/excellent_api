import { UserRepository } from "@data/interfaces/repositories";
import { UserOpenAllUseCase } from "@domain/interfaces/use-cases";
import { UserEntity, UserRequest } from "@domain/models/user";

export class UserOpenAll implements UserOpenAllUseCase {
    private userRepository: UserRepository
    constructor(userRepository: UserRepository) { this.userRepository = userRepository }

    execute(idsException: number): Promise<UserEntity[]> {
        return new Promise((resolve, reject) => {
            this.userRepository.findAll([idsException]).then(async valuesUser => {
                const users: UserEntity[] = valuesUser.map(u => UserRequest(u))
                resolve(users)
            }).catch(err => reject(err))
        })
    }
}