import { VALUES_APP, VARIABLES_VALIDATION } from "@utils";
import { UserAuthRequest, UserAuthType } from "@domain/models/user";
import jwt from "jsonwebtoken";
import { UserRepository } from "@data/interfaces/repositories";
import { UserUpdateAuthAllByIdUseCase } from "@domain/interfaces/use-cases";

export class UserUpdateAuthAllById implements UserUpdateAuthAllByIdUseCase {
    private userRepository: UserRepository
    constructor(userRepository: UserRepository) { this.userRepository = userRepository }

    async execute(id: number, value: { name: string, cellphone: string }): Promise<{ user: UserAuthType, token: string } | null> {
        return new Promise(async (resolve, reject) => {
            await this.userRepository.updateAllById(id, { name: value.name, cellphone: value.cellphone })
            await UserAuthRequest(id, this.userRepository).then(async userAuth => {
                if (userAuth != null) {
                    const tokenValue = jwt.sign({ userAuth: userAuth }, VALUES_APP().AUTH.KEY_APP, { expiresIn: VALUES_APP().AUTH.EXPIRES_IN })
                    const userData = { user: userAuth, token: tokenValue, }
                    resolve(userData)
                } else reject(VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        })
    }
}