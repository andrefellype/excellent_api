import { ProductRepository } from "@data/interfaces/repositories";
import { ProductRegisterUseCase } from "@domain/interfaces/use-cases";
import { FILES_UPLOAD_PRODUCT } from "@domain/models/product";
import { CopyFileOrigin, DestroyFile, RemoveSpecialCaracter, ResizeImage, VerifyExistsFile } from "@utils";

export class ProductRegister implements ProductRegisterUseCase {
    private productRepository: ProductRepository
    constructor(productRepository: ProductRepository) { this.productRepository = productRepository }

    execute(value: { description: string; grossPrice: string | null; salePrice: string | null; photo: string | null; }): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let photoValue = (value.photo != null && value.photo.length > 0) ? value.photo : null
            if (photoValue != null) {
                const nameIcon = RemoveSpecialCaracter(value.photo).replace(" ", "_").toLowerCase()
                photoValue = `${value.photo.split(".")[0]}_${nameIcon}.${value.photo.split(".")[1]}`
                await CopyFileOrigin(`public/upload/${FILES_UPLOAD_PRODUCT.original}`, value.photo,
                    `public/upload/${FILES_UPLOAD_PRODUCT.original}`, photoValue)
                await VerifyExistsFile(`./public/upload/${FILES_UPLOAD_PRODUCT.original}${value.photo}`).then(async valueExists => {
                    if (valueExists) await DestroyFile(`./public/upload/${FILES_UPLOAD_PRODUCT.original}${value.photo}`)
                })
            }
            await this.productRepository.insert({ description: value.description, grossPrice: value.grossPrice, salePrice: value.salePrice, photo: photoValue }).then(_ => {
                if (photoValue != null) ResizeImage(FILES_UPLOAD_PRODUCT, photoValue).catch(e => reject(e));
                resolve()
            }).catch(e => reject(e))
        })
    }
}