import { VALUES_APP, VARIABLES_VALIDATION } from "@utils";
import { UserAuthRequest, UserAuthType } from "@domain/models/user";
import jwt from "jsonwebtoken";
import { UserRepository } from "@data/interfaces/repositories";
import { UserUpdateAuthPasswordByIdUseCase } from "@domain/interfaces/use-cases";
import sha1 from 'sha1'

export class UserUpdateAuthPasswordById implements UserUpdateAuthPasswordByIdUseCase {
    private userRepository: UserRepository
    constructor(userRepository: UserRepository) { this.userRepository = userRepository }

    async execute(id: number, password: string): Promise<{ user: UserAuthType, token: string } | null> {
        return new Promise(async (resolve, reject) => {
            await this.userRepository.updatePasswordById(id, { password: sha1(password) }).then(async _ => {
                await UserAuthRequest(id, this.userRepository).then(async userAuth => {
                    if (userAuth != null) {
                        const tokenValue = jwt.sign({ userAuth: userAuth }, VALUES_APP().AUTH.KEY_APP, { expiresIn: VALUES_APP().AUTH.EXPIRES_IN })
                        const userData = { user: userAuth, token: tokenValue, }
                        resolve(userData)
                    } else reject(VARIABLES_VALIDATION.TOKEN_INVALID)
                })
            }).catch(e => reject(e))
        })
    }
}