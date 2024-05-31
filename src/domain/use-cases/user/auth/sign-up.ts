import sha1 from 'sha1'
import { VALUES_APP, VARIABLES_VALIDATION } from "@utils";
import jwt from "jsonwebtoken";
import { UserSignUpUseCase } from '@/domain/interfaces/use-cases';
import { UserRepository } from '@data/interfaces/repositories';
import { UserAuthRequest, UserAuthType } from '@domain/models/user';

export class UserSignUp implements UserSignUpUseCase {
    private userRepository: UserRepository
    constructor(userRepository: UserRepository) { this.userRepository = userRepository }

    async execute(value: { name: string, cellphone: string, password: string }): Promise<{ user: UserAuthType, token: string }> {
        return new Promise(async (resolve, reject) => {
            const passwordValue = sha1(value.password)

            await this.userRepository.insert({ name: value.name, cellphone: value.cellphone, password: passwordValue, isAdmin: false }).then(async valueIdUser => {
                await UserAuthRequest(valueIdUser, this.userRepository).then(userAuth => {
                    if (userAuth != null) {
                        const tokenValue = jwt.sign({ userAuth: userAuth }, VALUES_APP().AUTH.KEY_APP, { expiresIn: VALUES_APP().AUTH.EXPIRES_IN })
                        const userData = { user: userAuth, token: tokenValue, }
                        resolve(userData)
                    } else reject(VARIABLES_VALIDATION.TOKEN_INVALID)
                })
            })
        })
    }
}