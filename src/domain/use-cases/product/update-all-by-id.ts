import { ProductRepository } from "@data/interfaces/repositories";
import { ProductUpdateAllByIdUseCase } from "@domain/interfaces/use-cases";
import { FILES_UPLOAD_PRODUCT, LIST_FILES_PRODUCT, URL_MAIN_FILE_PRODUCT } from "@domain/models/product";
import { CopyFileOrigin, DestroyFile, DestroyFileByArrayLocalStorage, RemoveSpecialCaracter, ResizeImage, VerifyExistsFile } from "@utils";

export class ProductUpdateAllById implements ProductUpdateAllByIdUseCase {
    private productRepository: ProductRepository
    constructor(productRepository: ProductRepository) { this.productRepository = productRepository }

    execute(productId: number, value: { description: string; grossPrice: string | null; salePrice: string | null; statusUpload: number; photo: string | null; }): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.productRepository.findOneById(productId).then(async valueProductJson => {
                if (valueProductJson != null) {
                    let photoValue = value.statusUpload != -1 ? ((value.photo != null && value.photo.length > 0) ? value.photo : null) : valueProductJson.photo
                    if (value.statusUpload == 1 && photoValue != null) {
                        const nameIcon = RemoveSpecialCaracter(value.photo).replace(" ", "_").toLowerCase()
                        photoValue = `${value.photo.split(".")[0]}_${nameIcon}.${value.photo.split(".")[1]}`
                        await CopyFileOrigin(`public/upload/${FILES_UPLOAD_PRODUCT.original}`, value.photo,
                            `public/upload/${FILES_UPLOAD_PRODUCT.original}`, photoValue)
                        await VerifyExistsFile(`./public/upload/${FILES_UPLOAD_PRODUCT.original}${value.photo}`).then(async valueExists => {
                            if (valueExists) await DestroyFile(`./public/upload/${FILES_UPLOAD_PRODUCT.original}${value.photo}`)
                        })
                    }

                    await this.productRepository.updateAllById(productId, { description: value.description, grossPrice: value.grossPrice, salePrice: value.salePrice, photo: photoValue }).then(async _ => {
                        if (value.statusUpload == 1) ResizeImage(FILES_UPLOAD_PRODUCT, photoValue).catch(e => reject(e));
                        if (value.statusUpload != -1) {
                            const urlMain = URL_MAIN_FILE_PRODUCT
                            const briefcases = LIST_FILES_PRODUCT
                            const fileBaseImg = `./public/upload/${urlMain}`
                            await DestroyFileByArrayLocalStorage(briefcases.map(b => `${fileBaseImg}/${b}`), valueProductJson.photo)
                        }
                        resolve()
                    }).catch(err => reject(err))
                }
            })
        })
    }
}