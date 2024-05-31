import { UserRepository } from "@data/interfaces/repositories";
import { UserDeleteById, UserDeleteByIds, UserOpenAll, UserOpenById, UserRegister, UserUpdateIsEnabledById } from "@domain/use-cases";
import { UserRouter } from "@routes";
import { UserValidation } from "@validation";

export const userMiddleWare = (userRepository: UserRepository) => UserRouter(
    userRepository, new UserValidation(),
    new UserOpenById(userRepository),
    new UserOpenAll(userRepository),
    new UserRegister(userRepository),
    new UserUpdateIsEnabledById(userRepository),
    new UserDeleteById(userRepository),
    new UserDeleteByIds(userRepository)
)