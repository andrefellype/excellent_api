import { UserRepository } from "@data/interfaces/repositories";
import { UserRefreshToken, UserSignIn, UserSignUp, UserUpdateAuthAllById, UserUpdateAuthPasswordById } from "@domain/use-cases";
import { UserAuthRouter } from "@routes";
import { UserValidation } from "@validation";

export const userAuthMiddleWare = (userRepository: UserRepository) => UserAuthRouter(
    userRepository, new UserValidation(),
    new UserSignUp(userRepository),
    new UserSignIn(userRepository),
    new UserRefreshToken(userRepository),
    new UserUpdateAuthAllById(userRepository),
    new UserUpdateAuthPasswordById(userRepository)
)