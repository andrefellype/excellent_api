import { VALUES_APP, VARIABLES_VALIDATION } from "@utils";
import { UserSignInUseCase } from "@domain/interfaces/use-cases";
import sha1 from 'sha1'
import jwt from "jsonwebtoken";
import { UserRepository } from "@data/interfaces/repositories";
import { UserAuthRequest, UserAuthType } from "@domain/models/user";

export class UserSignIn implements UserSignInUseCase {
    private userRepository: UserRepository
    constructor(userRepository: UserRepository) { this.userRepository = userRepository }

    execute(value: { cellphone: string, password: string }): Promise<{ user: UserAuthType, token: string }> {
        return new Promise((resolve, reject) => {
            this.userRepository.findOneByCellphoneAndPassword(value.cellphone, sha1(value.password)).then(async valueUser => {
                if (valueUser != null) {
                    if (valueUser!!.is_enabled && !valueUser!!.is_deleted) {
                        await UserAuthRequest(valueUser.id, this.userRepository).then(async valueUserJson => {
                            if (valueUserJson != null) {
                                const tokenValue = jwt.sign({ userAuth: valueUserJson }, VALUES_APP().AUTH.KEY_APP, { expiresIn: VALUES_APP().AUTH.EXPIRES_IN })
                                const userData = { user: valueUserJson, token: tokenValue, }
                                resolve(userData)
                            } else reject(VARIABLES_VALIDATION.TOKEN_INVALID)
                        })
                    } else reject(VARIABLES_VALIDATION.DATA_BLOCK)
                } else reject(VARIABLES_VALIDATION.NOT_VALIDATE)
            }).catch(err => reject(err))
        })
    }
}