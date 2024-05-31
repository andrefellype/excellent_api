import { UserRepository } from "@data/interfaces/repositories";

export interface UserAuthType { id: number; isAdmin: boolean; }

export const UserAuthRequest = async (
    userId: number, userRepository: UserRepository
): Promise<UserAuthType | null> => {
    return new Promise(async (resolve, _) => {
        let dataReturn: UserAuthType | null = null

        await userRepository.findOneById(userId).then(async valueUser => {
            if (valueUser != null) {
                if (valueUser.is_enabled && !valueUser.is_deleted) { dataReturn = { id: valueUser.id, isAdmin: valueUser.is_admin } }
            }
        })
        resolve(dataReturn)
    })
}