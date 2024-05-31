import express from 'express'
import { Request, Response } from 'express'
import { ReturnJsonError, ReturnJsonException, ReturnJsonSuccess, ReturnJsonValidation } from '@/app/utils/http';
import { DestroyFile, GetUserAuth, VALUES_APP, VARIABLES_VALIDATION, VerifyExistsFile, VerifyJWT } from '@utils';
import { body, validationResult } from 'express-validator';
import multer from 'multer'
import { ProductRepository } from '@data/interfaces/repositories';
import { ProductValidation } from '@validation';
import { ProductDeleteByIdsUseCase, ProductDeleteByIdUseCase, ProductOpenAllUseCase, ProductOpenByIdUseCase, ProductRegisterUseCase, ProductUpdateAllByIdUseCase } from '@domain/interfaces/use-cases';
import { FILES_UPLOAD_PRODUCT } from '@domain/models/product';

export function ProductRouter(
    productRepository: ProductRepository,
    productValidation: ProductValidation,
    all: ProductOpenAllUseCase,
    register: ProductRegisterUseCase,
    openById: ProductOpenByIdUseCase,
    updateAllById: ProductUpdateAllByIdUseCase,
    deleteId: ProductDeleteByIdUseCase,
    deleteIds: ProductDeleteByIdsUseCase
) {
    const TITLE_VALIDATION = "product"

    const router = express.Router()

    router.get('/all', VerifyJWT, async (req: Request, res: Response) => {
        try {
            if (req.headers != null && typeof req.headers["x-access-token"] != "undefined" && req.headers["x-access-token"] != null) {
                GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                    if (userToken != null)
                        await all.execute().then(valuesAll => ReturnJsonSuccess(res, valuesAll)).catch(e => ReturnJsonError(res, e))
                    else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                })
            } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.post('/upload', multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, `./public/upload/${FILES_UPLOAD_PRODUCT.original}`)
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
                cb(null, uniqueSuffix + ".png")
            }
        }),
        fileFilter: function (req, file, cb) {
            const filetypes = /jpeg|jpg|png|gif/
            const extname = filetypes.test(file.originalname.toLowerCase())
            const mimetype = filetypes.test(file.mimetype)
            if (mimetype && extname) return cb(null, true)
        }
    }).single('file'), VerifyJWT, async (req: Request, res: Response) => {
        try {
            if (req.file && req.file.filename) ReturnJsonSuccess(res, { filename: req.file.filename });
            else ReturnJsonSuccess(res, { filename: null });
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.post('/register',
        body('description').custom(async value => new Promise((resolve, reject) => { productValidation.description(value, resolve, reject, productRepository) })),
        VerifyJWT, async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                        if (userToken != null) {
                            let photo = req.body.photo != null ? req.body.photo : null

                            const grossPrice = typeof req.body.gross_price != "undefined" ? req.body.gross_price : null
                            const salePrice = typeof req.body.sale_price != "undefined" ? req.body.sale_price : null
                            await register.execute({ description: req.body.description, grossPrice, salePrice, photo }).then(_ => ReturnJsonSuccess(res, {})).catch(e => ReturnJsonError(res, e))
                        } else {
                            if (req.body.icon != null) {
                                await VerifyExistsFile(`./public/upload${FILES_UPLOAD_PRODUCT.original}${req.body.icon}`).then(async valueExists => {
                                    if (valueExists) await DestroyFile(`./public/upload${FILES_UPLOAD_PRODUCT.original}${req.body.icon}`)
                                })
                            }
                            ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                        }
                    })
                } else {
                    if (req.body.icon != null) {
                        await VerifyExistsFile(`./public/upload${FILES_UPLOAD_PRODUCT.original}${req.body.icon}`).then(async valueExists => {
                            if (valueExists) await DestroyFile(`./public/upload${FILES_UPLOAD_PRODUCT.original}${req.body.icon}`)
                        })
                    }
                    const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                    ReturnJsonValidation(res, msgsError)
                }
            } catch (err) { ReturnJsonException(res, "Error fetching data.") }
        })

    router.get('/open/:productId', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null)
                    await openById.execute(parseInt(req.params.productId)).then(valueProduct => ReturnJsonSuccess(res, valueProduct)).catch(e => ReturnJsonError(res, e))
                else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.put('/update/:productId',
        body('description').custom(async (value, { req }) => new Promise((resolve, reject) => { productValidation.description(value, resolve, reject, productRepository, [req.params.productId]) })),
        VerifyJWT, async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                        if (userToken != null) {
                            let photo = req.body.photo != null ? req.body.photo : null
                            const grossPrice = typeof req.body.gross_price != "undefined" ? req.body.gross_price : null
                            const salePrice = typeof req.body.sale_price != "undefined" ? req.body.sale_price : null

                            await updateAllById.execute(parseInt(req.params.productId), {
                                description: req.body.description, grossPrice, salePrice, statusUpload: req.body.status_photo, photo
                            }).then(_ => ReturnJsonSuccess(res, {})).catch(e => ReturnJsonError(res, e))
                        } else {
                            if (req.body.icon != null) {
                                await VerifyExistsFile(`./public/upload${FILES_UPLOAD_PRODUCT.original}${req.body.icon}`).then(async valueExists => {
                                    if (valueExists) await DestroyFile(`./public/upload${FILES_UPLOAD_PRODUCT.original}${req.body.icon}`)
                                })
                            }
                            ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                        }
                    })
                } else {
                    if (req.body.icon != null) {
                        await VerifyExistsFile(`./public/upload${FILES_UPLOAD_PRODUCT.original}${req.body.icon}`).then(async valueExists => {
                            if (valueExists) await DestroyFile(`./public/upload${FILES_UPLOAD_PRODUCT.original}${req.body.icon}`)
                        })
                    }
                    const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                    ReturnJsonValidation(res, msgsError)
                }
            } catch (err) { ReturnJsonException(res, "Error fetching data.") }
        })

    router.delete('/:productId', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null)
                    await deleteId.execute(parseInt(req.params.productId)).then(value => ReturnJsonSuccess(res, value)).catch(e => ReturnJsonError(res, e))
                else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.put('/delete', body('productIds').notEmpty(), VerifyJWT, async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)
            if (errors.isEmpty()) {
                GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                    if (userToken != null)
                        await deleteIds.execute(req.body.productIds).then(value => ReturnJsonSuccess(res, value)).catch(e => ReturnJsonError(res, e))
                    else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                })
            } else {
                const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                ReturnJsonValidation(res, msgsError)
            }
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    return router
}