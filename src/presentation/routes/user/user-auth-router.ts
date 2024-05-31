import express from 'express'
import { body, validationResult } from "express-validator";
import { Request, Response } from 'express'
import { UserRepository } from '@data/interfaces/repositories';
import { UserValidation } from '@validation';
import { UserRefreshTokenUseCase, UserSignInUseCase, UserSignUpUseCase, UserUpdateAuthAllByIdUseCase, UserUpdateAuthPasswordByIdUseCase } from '@domain/interfaces/use-cases';
import { ReturnJsonError, ReturnJsonException, ReturnJsonSuccess, ReturnJsonValidation } from '@/app/utils/http';
import { GetUserAuth, VALUES_APP, VARIABLES_VALIDATION, VerifyJWT } from '@utils';

export function UserAuthRouter(
    userRepository: UserRepository, userValidation: UserValidation,
    signUpUseCase: UserSignUpUseCase,
    signInUseCase: UserSignInUseCase,
    refreshToken: UserRefreshTokenUseCase,
    updateAllById: UserUpdateAuthAllByIdUseCase,
    updatePasswordById: UserUpdateAuthPasswordByIdUseCase
) {
    const TITLE_VALIDATION = "user"

    const router = express.Router()

    router.post('/signup',
        body("name").custom(async (value) => new Promise((resolve, reject) => userValidation.name(value, resolve, reject))),
        body("cellphone").custom(async (value) => new Promise((resolve, reject) => userValidation.cellphone(value, resolve, reject, userRepository))),
        body("password").custom(async (value) => new Promise((resolve, reject) => userValidation.password(value, resolve, reject))),
        body("password_confirm").custom(async (value, { req }) => new Promise((resolve, reject) => userValidation.passwordConfirm(value, req, resolve, reject))),
        async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    const email = (req.body.email != null && req.body.email.length > 0) ? req.body.email : null
                    await signUpUseCase.execute({ name: req.body.name, cellphone: req.body.cellphone, password: req.body.password }).then(valueAuth => {
                        if (valueAuth != null) (req.session as any).userAuth = valueAuth
                        ReturnJsonSuccess(res, valueAuth)
                    }).catch(e => ReturnJsonError(res, e))
                } else {
                    const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                    ReturnJsonValidation(res, msgsError)
                }
            } catch (err) { ReturnJsonException(res, "Error fetching data.") }
        })

    router.post('/signin',
        body("cellphone").custom(async (value) => new Promise((resolve, reject) => userValidation.cellphoneAccess(value, resolve, reject))),
        body("password").custom(async (value) => new Promise((resolve, reject) => userValidation.passwordAccess(value, resolve, reject))),
        async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    await signInUseCase.execute({ cellphone: req.body.cellphone, password: req.body.password }).then(async valueAuth => {
                        if (valueAuth != null) (req.session as any).userAuth = valueAuth
                        await req.session.save()
                        ReturnJsonSuccess(res, valueAuth)
                    }).catch(e => ReturnJsonError(res, e))
                } else {
                    const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                    ReturnJsonValidation(res, msgsError)
                }
            } catch (err) { ReturnJsonException(res, "Error fetching data.") }
        })

    router.get('/refresh/token', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null) {
                    await refreshToken.execute(userToken).then(valueAuth => {
                        if (valueAuth != null) (req.session as any).userAuth = valueAuth
                        ReturnJsonSuccess(res, valueAuth)
                    }).catch(e => ReturnJsonError(res, e))
                } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.get('/signout', VerifyJWT, async (_, res: Response) => ReturnJsonSuccess(res, {}))

    router.put('/update/auth/:userId',
        body("name").custom(async value => new Promise((resolve, reject) => userValidation.name(value, resolve, reject))),
        body("cellphone").custom(async (value, { req }) => new Promise((resolve, reject) => {
            if (req.params!!.userId) userValidation.cellphone(value, resolve, reject, userRepository, [req.params!!.userId])
        })), VerifyJWT, async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                        if (userToken != null) {
                            await updateAllById.execute(parseInt(req.params.userId), { name: req.body.name, cellphone: req.body.cellphone }).then(valueAuth => {
                                if (valueAuth != null) (req.session as any).userAuth = valueAuth
                                ReturnJsonSuccess(res, valueAuth)
                            }).catch(e => ReturnJsonError(res, e))
                        } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                    })
                } else {
                    const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                    ReturnJsonValidation(res, msgsError)
                }
            } catch (err) { ReturnJsonException(res, "Error fetching data.") }
        })

    router.put('/update/auth/password/:userId',
        body("password").custom(async (value) => new Promise((resolve, reject) => userValidation.password(value, resolve, reject))),
        body("password_confirm").custom(async (value, { req }) => new Promise((resolve, reject) => userValidation.passwordConfirm(value, req, resolve, reject))),
        VerifyJWT, async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                        if (userToken != null) {
                            await updatePasswordById.execute(parseInt(req.params.userId), req.body.password).then(valueAuth => {
                                if (valueAuth != null) (req.session as any).userAuth = valueAuth
                                ReturnJsonSuccess(res, valueAuth)
                            }).catch(e => ReturnJsonError(res, e))
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