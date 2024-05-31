import { VARIABLES_VALIDATION } from "@utils";

export class OrderValidation {
    quantity(value, resolve, reject) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null && parseInt(value) > 0;
        if (statusValidateNotEmpty) resolve(true); else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }

    productsId(value, resolve, reject) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null;
        if (statusValidateNotEmpty && value.length > 0) resolve(true); else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }

    clientId(value, resolve, reject) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null;
        if (statusValidateNotEmpty) resolve(true); else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }
}