import express from 'express'
import { Request, Response } from 'express'
import { ReturnJsonError, ReturnJsonException, ReturnJsonSuccess, ReturnJsonValidation } from '@/app/utils/http';
import { DestroyFile, GetUserAuth, VALUES_APP, VARIABLES_VALIDATION, VerifyExistsFile, VerifyJWT } from '@utils';
import { body, validationResult } from 'express-validator';
import { CategoryProductRepository } from '@data/interfaces/repositories';
import { CategoryProductValidation } from '@validation';
import { CategoryProductDeleteByIdsUseCase, CategoryProductDeleteByIdUseCase, CategoryProductOpenAllUseCase, CategoryProductOpenByIdUseCase, CategoryProductRegisterUseCase, CategoryProductUpdateAllByIdUseCase } from '@domain/interfaces/use-cases';
import { FILES_UPLOAD_CATEGORY_PRODUCT } from '@domain/models/category';
import multer from 'multer'

export function CategoryProductRouter(
    categoryProductRepository: CategoryProductRepository,
    categoryProductValidation: CategoryProductValidation,
    all: CategoryProductOpenAllUseCase,
    register: CategoryProductRegisterUseCase,
    openById: CategoryProductOpenByIdUseCase,
    updateAllById: CategoryProductUpdateAllByIdUseCase,
    deleteId: CategoryProductDeleteByIdUseCase,
    deleteIds: CategoryProductDeleteByIdsUseCase
) {
    const TITLE_VALIDATION = "category_product"

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
                cb(null, `./public/upload/${FILES_UPLOAD_CATEGORY_PRODUCT.original}`)
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
        body('name').custom(async value => new Promise((resolve, reject) => { categoryProductValidation.name(value, resolve, reject, categoryProductRepository) })),
        VerifyJWT, async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                        if (userToken != null) {
                            let icon = req.body.icon != null ? req.body.icon : null

                            await register.execute({ name: req.body.name, icon }).then(_ => ReturnJsonSuccess(res, {})).catch(e => ReturnJsonError(res, e))
                        } else {
                            if (req.body.icon != null) {
                                await VerifyExistsFile(`./public/upload${FILES_UPLOAD_CATEGORY_PRODUCT.original}${req.body.icon}`).then(async valueExists => {
                                    if (valueExists) await DestroyFile(`./public/upload${FILES_UPLOAD_CATEGORY_PRODUCT.original}${req.body.icon}`)
                                })
                            }
                            ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                        }
                    })
                } else {
                    if (req.body.icon != null) {
                        await VerifyExistsFile(`./public/upload${FILES_UPLOAD_CATEGORY_PRODUCT.original}${req.body.icon}`).then(async valueExists => {
                            if (valueExists) await DestroyFile(`./public/upload${FILES_UPLOAD_CATEGORY_PRODUCT.original}${req.body.icon}`)
                        })
                    }
                    const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                    ReturnJsonValidation(res, msgsError)
                }
            } catch (err) { ReturnJsonException(res, "Error fetching data.") }
        })

    router.get('/open/:categoryId', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null)
                    await openById.execute(parseInt(req.params.categoryId)).then(valueCategory => ReturnJsonSuccess(res, valueCategory)).catch(e => ReturnJsonError(res, e))
                else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.put('/update/:categoryId',
        body('name').custom(async (value, { req }) => new Promise((resolve, reject) => { categoryProductValidation.name(value, resolve, reject, categoryProductRepository, [req.params.categoryId]) })),
        VerifyJWT, async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                        if (userToken != null) {
                            let icon = req.body.icon != null ? req.body.icon : null

                            await updateAllById.execute(parseInt(req.params.categoryId), {
                                name: req.body.name, statusUpload: req.body.status_icon, icon
                            }).then(_ => ReturnJsonSuccess(res, {})).catch(e => ReturnJsonError(res, e))
                        } else {
                            if (req.body.icon != null) {
                                await VerifyExistsFile(`./public/upload${FILES_UPLOAD_CATEGORY_PRODUCT.original}${req.body.icon}`).then(async valueExists => {
                                    if (valueExists) await DestroyFile(`./public/upload${FILES_UPLOAD_CATEGORY_PRODUCT.original}${req.body.icon}`)
                                })
                            }
                            ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                        }
                    })
                } else {
                    if (req.body.icon != null) {
                        await VerifyExistsFile(`./public/upload${FILES_UPLOAD_CATEGORY_PRODUCT.original}${req.body.icon}`).then(async valueExists => {
                            if (valueExists) await DestroyFile(`./public/upload${FILES_UPLOAD_CATEGORY_PRODUCT.original}${req.body.icon}`)
                        })
                    }
                    const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                    ReturnJsonValidation(res, msgsError)
                }
            } catch (err) { ReturnJsonException(res, "Error fetching data.") }
        })

    router.delete('/:categoryId', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null)
                    await deleteId.execute(parseInt(req.params.categoryId)).then(value => ReturnJsonSuccess(res, value)).catch(e => ReturnJsonError(res, e))
                else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.put('/delete', body('categoryIds').notEmpty(), VerifyJWT, async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)
            if (errors.isEmpty()) {
                GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                    if (userToken != null)
                        await deleteIds.execute(req.body.categoryIds).then(value => ReturnJsonSuccess(res, value)).catch(e => ReturnJsonError(res, e))
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