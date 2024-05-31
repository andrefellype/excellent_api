import { UserRepository } from "@data/interfaces/repositories";
import { VARIABLES_VALIDATION, ValidateCellphone } from "@utils";

export class UserValidation {
    name(value, resolve, reject) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null && (typeof value != "string" || value.length > 0);
        if (statusValidateNotEmpty) resolve(true)
        else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }

    cellphone(value, resolve, reject, userRepository: UserRepository, idsException: number[] = []) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null && (typeof value != "string" || value.length > 0);
        if (statusValidateNotEmpty) {
            if (typeof value != "undefined" && ValidateCellphone(value))
                userRepository.findByCellphone(value, idsException).then(async valueUser => {
                    if (valueUser.length == 0) resolve(true); else reject(VARIABLES_VALIDATION.IS_EXISTS)
                }).catch((err) => reject(err.message))
            else reject(VARIABLES_VALIDATION.FORMAT_INVALID)
        } else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }

    password(value, resolve, reject) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null && (typeof value != "string" || value.length > 0);
        if (statusValidateNotEmpty) {
            if (value.length >= 6 && value.length <= 15) resolve(true)
            else reject(VARIABLES_VALIDATION.NOT_LENGTH_MIN_AND_MAX)
        } else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }

    passwordConfirm(value, req, resolve, reject) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null && (typeof value != "string" || value.length > 0);
        if (statusValidateNotEmpty) {
            if (value == req.body.password) resolve(true)
            else reject(VARIABLES_VALIDATION.NOT_CONFIRM_FIELD)
        } else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }

    cellphoneAccess(value, resolve, reject) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null && (typeof value != "string" || value.length > 0);
        if (statusValidateNotEmpty) {
            if (typeof value != "undefined" && ValidateCellphone(value)) resolve(true); else reject(VARIABLES_VALIDATION.FORMAT_INVALID)
        } else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }

    passwordAccess(value, resolve, reject) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null && (typeof value != "string" || value.length > 0);
        if (statusValidateNotEmpty) resolve(true)
        else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }
}