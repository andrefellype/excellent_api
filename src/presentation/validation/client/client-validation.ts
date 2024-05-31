import { ClientRepository } from "@data/interfaces/repositories";
import { VARIABLES_VALIDATION, ValidateCnpj, ValidateEmail } from "@utils";

export class ClientValidation {
    name(value, resolve, reject) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null && (typeof value != "string" || value.length > 0);
        if (statusValidateNotEmpty) resolve(true)
        else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }

    documentNumber(value, resolve, reject, clientRepository: ClientRepository, idsException: number[] = []) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null && (typeof value != "string" || value.length > 0);
        if (statusValidateNotEmpty) {
            if (typeof value != "undefined" && ValidateCnpj(value))
                clientRepository.findByDocumentNumber(value, idsException).then(async valueClient => {
                    if (valueClient.length == 0) resolve(true); else reject(VARIABLES_VALIDATION.IS_EXISTS)
                }).catch((err) => reject(err.message))
            else reject(VARIABLES_VALIDATION.FORMAT_INVALID)
        } else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }

    email(value, resolve, reject) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null && (typeof value != "string" || value.length > 0);
        if (statusValidateNotEmpty) {
            if (typeof value != "undefined" && ValidateEmail(value)) resolve(true); else reject(VARIABLES_VALIDATION.FORMAT_INVALID)
        } else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }
}