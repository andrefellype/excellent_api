import { CategoryProductRepository } from "@data/interfaces/repositories";
import { CategoryProductRegisterUseCase } from "@domain/interfaces/use-cases";
import { FILES_UPLOAD_CATEGORY_PRODUCT } from "@domain/models/category";
import { CopyFileOrigin, DestroyFile, RemoveSpecialCaracter, ResizeImage, VerifyExistsFile } from "@utils";

export class CategoryProductRegister implements CategoryProductRegisterUseCase {
    private categoryProductRepository: CategoryProductRepository
    constructor(categoryProductRepository: CategoryProductRepository) { this.categoryProductRepository = categoryProductRepository }

    execute(value: { name: string; icon: string | null; }): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let iconValue = (value.icon != null && value.icon.length > 0) ? value.icon : null
            if (iconValue != null) {
                const nameIcon = RemoveSpecialCaracter(value.name).replace(" ", "_").toLowerCase()
                iconValue = `${value.icon.split(".")[0]}_${nameIcon}.${value.icon.split(".")[1]}`
                await CopyFileOrigin(`public/upload/${FILES_UPLOAD_CATEGORY_PRODUCT.original}`, value.icon,
                    `public/upload/${FILES_UPLOAD_CATEGORY_PRODUCT.original}`, iconValue)
                await VerifyExistsFile(`./public/upload/${FILES_UPLOAD_CATEGORY_PRODUCT.original}${value.icon}`).then(async valueExists => {
                    if (valueExists) await DestroyFile(`./public/upload/${FILES_UPLOAD_CATEGORY_PRODUCT.original}${value.icon}`)
                })
            }
            await this.categoryProductRepository.insert({ name: value.name, icon: iconValue }).then(_ => {
                if (iconValue != null) ResizeImage(FILES_UPLOAD_CATEGORY_PRODUCT, iconValue).catch(e => reject(e));
                resolve()
            }).catch(e => reject(e))
        })
    }
}