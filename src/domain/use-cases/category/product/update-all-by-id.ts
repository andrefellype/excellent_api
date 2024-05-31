import { CategoryProductRepository } from "@data/interfaces/repositories";
import { CategoryProductUpdateAllByIdUseCase } from "@domain/interfaces/use-cases";
import { FILES_UPLOAD_CATEGORY_PRODUCT, LIST_FILES_CATEGORY_PRODUCT, URL_MAIN_FILE_CATEGORY_PRODUCT } from "@domain/models/category";
import { CopyFileOrigin, DestroyFile, DestroyFileByArrayLocalStorage, RemoveSpecialCaracter, ResizeImage, VerifyExistsFile } from "@utils";

export class CategoryProductUpdateAllById implements CategoryProductUpdateAllByIdUseCase {
    private categoryProductRepository: CategoryProductRepository
    constructor(categoryProductRepository: CategoryProductRepository) { this.categoryProductRepository = categoryProductRepository }

    execute(categoryId: number, value: { name: string; description: string | null; statusUpload: number; icon: string | null; }): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.categoryProductRepository.findOneById(categoryId).then(async valueCategoryJson => {
                if (valueCategoryJson != null) {
                    let iconValue = value.statusUpload != -1 ? ((value.icon != null && value.icon.length > 0) ? value.icon : null) : valueCategoryJson.icon
                    if (value.statusUpload == 1 && iconValue != null) {
                        const nameIcon = RemoveSpecialCaracter(value.name).replace(" ", "_").toLowerCase()
                        iconValue = `${value.icon.split(".")[0]}_${nameIcon}.${value.icon.split(".")[1]}`
                        await CopyFileOrigin(`public/upload/${FILES_UPLOAD_CATEGORY_PRODUCT.original}`, value.icon,
                            `public/upload/${FILES_UPLOAD_CATEGORY_PRODUCT.original}`, iconValue)
                        await VerifyExistsFile(`./public/upload/${FILES_UPLOAD_CATEGORY_PRODUCT.original}${value.icon}`).then(async valueExists => {
                            if (valueExists) await DestroyFile(`./public/upload/${FILES_UPLOAD_CATEGORY_PRODUCT.original}${value.icon}`)
                        })
                    }

                    await this.categoryProductRepository.updateAllById(categoryId, { name: value.name, icon: iconValue }).then(async _ => {
                        if (value.statusUpload == 1) ResizeImage(FILES_UPLOAD_CATEGORY_PRODUCT, iconValue).catch(e => reject(e));
                        if (value.statusUpload != -1) {
                            const urlMain = URL_MAIN_FILE_CATEGORY_PRODUCT
                            const briefcases = LIST_FILES_CATEGORY_PRODUCT
                            const fileBaseImg = `./public/upload/${urlMain}`
                            await DestroyFileByArrayLocalStorage(briefcases.map(b => `${fileBaseImg}/${b}`), valueCategoryJson.icon)
                        }
                        resolve()
                    }).catch(err => reject(err))
                }
            })
        })
    }
}