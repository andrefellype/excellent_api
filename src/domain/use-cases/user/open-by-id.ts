import { UserRepository } from "@data/interfaces/repositories";
import { UserOpenByIdUseCase } from "@domain/interfaces/use-cases";
import { UserEntity, UserRequest } from "@domain/models/user";
import { VARIABLES_VALIDATION } from "@utils";

export class UserOpenById implements UserOpenByIdUseCase {
    private userRepository: UserRepository
    constructor(userRepository: UserRepository) { this.userRepository = userRepository }

    execute(id: number): Promise<UserEntity> {
        return new Promise((resolve, reject) => {
            this.userRepository.findOneById(id).then(async valueUser => {
                if (valueUser != null) resolve(UserRequest(valueUser)); else reject(VARIABLES_VALIDATION.FAIL_NULL)
            }).catch(err => reject(err))
        })
    }
}