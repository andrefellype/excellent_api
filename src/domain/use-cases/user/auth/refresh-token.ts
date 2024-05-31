import { VALUES_APP, VARIABLES_VALIDATION } from "@utils";
import jwt from "jsonwebtoken";
import { UserRefreshTokenUseCase } from "@domain/interfaces/use-cases";
import { UserRepository } from "@data/interfaces/repositories";
import { UserAuthRequest, UserAuthType } from "@domain/models/user";

export class UserRefreshToken implements UserRefreshTokenUseCase {
    private userRepository: UserRepository
    constructor(userRepository: UserRepository) { this.userRepository = userRepository }

    execute(userAuth: UserAuthType): Promise<{ user: UserAuthType, token: string } | null> {
        return new Promise((resolve, reject) => {
            UserAuthRequest(userAuth.id, this.userRepository).then(async valueUserJson => {
                if (valueUserJson != null) {
                    const tokenValue = jwt.sign({ userAuth: valueUserJson }, VALUES_APP().AUTH.KEY_APP, { expiresIn: VALUES_APP().AUTH.EXPIRES_IN })
                    const userData = { user: valueUserJson, token: tokenValue, }
                    resolve(userData)
                } else reject(VARIABLES_VALIDATION.TOKEN_INVALID)
            }).catch(err => reject(err))
        })
    }
}