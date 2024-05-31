import { CategoryProductRepository } from "@data/interfaces/repositories";
import { VARIABLES_VALIDATION } from "@utils";

export class CategoryProductValidation {
    name(value, resolve, reject, categoryProductRepository: CategoryProductRepository, idsException: number[] = []) {
        const statusValidateNotEmpty = typeof value != "undefined" && value != null && (typeof value != "string" || value.length > 0);
        if (statusValidateNotEmpty) categoryProductRepository.findByName(value, idsException).then(valueCategory => {
            if (valueCategory.length == 0) resolve(true); else reject(VARIABLES_VALIDATION.IS_EXISTS)
        }).catch(err => reject(err.message))
        else reject(VARIABLES_VALIDATION.NOT_EMPTY)
    }
}