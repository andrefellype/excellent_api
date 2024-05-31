import express from 'express'
import { body, validationResult } from "express-validator";
import { Request, Response } from 'express'
import { UserValidation } from '@validation'
import { ReturnJsonError, ReturnJsonException, ReturnJsonSuccess, ReturnJsonValidation } from '@/app/utils/http';
import { GetUserAuth, VALUES_APP, VARIABLES_VALIDATION, VerifyJWT } from '@utils';
import { UserDeleteByIdsUseCase, UserDeleteByIdUseCase, UserOpenAllUseCase, UserOpenByIdUseCase, UserRegisterUseCase, UserUpdateIsEnabledByIdUseCase } from '@domain/interfaces/use-cases';
import { UserRepository } from '@data/interfaces/repositories';

export function UserRouter(
    userRepository: UserRepository,
    userValidation: UserValidation,
    openById: UserOpenByIdUseCase,
    all: UserOpenAllUseCase,
    register: UserRegisterUseCase,
    updateEnabled: UserUpdateIsEnabledByIdUseCase,
    deleteId: UserDeleteByIdUseCase,
    deleteIds: UserDeleteByIdsUseCase
) {
    const TITLE_VALIDATION = "user"

    const router = express.Router()

    router.get('/open/:userId', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null) await openById.execute(parseInt(req.params.userId)).then(valueAuth => {
                    ReturnJsonSuccess(res, valueAuth)
                }).catch(e => ReturnJsonError(res, e)); else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.get('/not/:userNot', VerifyJWT, async (req: Request, res: Response) => {
        try {
            if (req.headers != null && typeof req.headers["x-access-token"] != "undefined" && req.headers["x-access-token"] != null) {
                GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                    if (userToken != null) {
                        if (!userToken.isAdmin) ReturnJsonError(res, "PERMISSION INVALID")
                        else await all.execute(parseInt(req.params.userNot)).then(valuesAll => {
                            ReturnJsonSuccess(res, valuesAll)
                        }).catch(e => ReturnJsonError(res, e))
                    } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                })
            } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.post('/register',
        body("name").custom(async (value) => new Promise((resolve, reject) => userValidation.name(value, resolve, reject))),
        body("cellphone").custom(async (value) => new Promise((resolve, reject) => userValidation.cellphone(value, resolve, reject, userRepository))),
        body("password").custom(async (value) => new Promise((resolve, reject) => userValidation.password(value, resolve, reject))),
        body("password_confirm").custom(async (value, { req }) => new Promise((resolve, reject) => userValidation.passwordConfirm(value, req, resolve, reject))),
        VerifyJWT, async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                        if (userToken != null) {
                            if (!userToken.isAdmin) ReturnJsonError(res, "PERMISSION INVALID")
                            else {
                                const isAdmin = (typeof req.body.is_admin == "undefined" || !req.body.is_admin) ? false : true
                                await register.execute({ name: req.body.name, cellphone: req.body.cellphone, password: req.body.password, isAdmin })
                                    .then(_ => ReturnJsonSuccess(res, true)).catch(e => ReturnJsonError(res, e))
                            }
                        } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                    })
                } else {
                    const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                    ReturnJsonValidation(res, msgsError)
                }
            } catch (err) { ReturnJsonException(res, "Error fetching data.") }
        })

    router.get('/update/enabled/:userId', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null) {
                    if (!userToken.isAdmin) ReturnJsonError(res, "PERMISSION INVALID")
                    else {
                        await updateEnabled.execute(parseInt(req.params.userId)).then(_ => ReturnJsonSuccess(res, true)).catch(e => ReturnJsonError(res, e))
                    }
                } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.delete('/:userId', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null) {
                    if (!userToken.isAdmin) ReturnJsonError(res, "PERMISSION INVALID")
                    else
                        await deleteId.execute(parseInt(req.params.userId)).then(_ => ReturnJsonSuccess(res, {})).catch(e => ReturnJsonError(res, e))
                } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.put('/delete', body('userIds').notEmpty(), VerifyJWT, async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)
            if (errors.isEmpty()) {
                GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                    if (userToken != null) {
                        if (!userToken.isAdmin) ReturnJsonError(res, "PERMISSION INVALID")
                        else
                            await deleteIds.execute(req.body.userIds).then(_ => ReturnJsonSuccess(res, {})).catch(e => ReturnJsonError(res, e))
                    } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                })
            } else {
                const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                ReturnJsonValidation(res, msgsError)
            }
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    return router
}