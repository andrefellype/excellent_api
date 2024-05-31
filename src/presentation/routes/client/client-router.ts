import express from 'express'
import { body, validationResult } from "express-validator";
import { Request, Response } from 'express'
import { ClientValidation } from '@validation'
import { ReturnJsonError, ReturnJsonException, ReturnJsonSuccess, ReturnJsonValidation } from '@/app/utils/http';
import { GetUserAuth, VALUES_APP, VARIABLES_VALIDATION, VerifyJWT } from '@utils';
import { ClientDeleteByIdsUseCase, ClientDeleteByIdUseCase, ClientOpenAllUseCase, ClientOpenByIdUseCase, ClientOpenInformationByCnpjUseCase, ClientRegisterUseCase, ClientUpdateAllByIdUseCase } from '@domain/interfaces/use-cases';
import { ClientRepository } from '@data/interfaces/repositories';

export function ClientRouter(
    clientRepository: ClientRepository,
    clientValidation: ClientValidation,
    register: ClientRegisterUseCase,
    all: ClientOpenAllUseCase,
    openById: ClientOpenByIdUseCase,
    updateAllById: ClientUpdateAllByIdUseCase,
    deleteId: ClientDeleteByIdUseCase,
    deleteIds: ClientDeleteByIdsUseCase,
    openInformationByCnpj: ClientOpenInformationByCnpjUseCase
) {
    const TITLE_VALIDATION = "client"

    const router = express.Router()

    router.post('/register',
        body("name").custom(async (value) => new Promise((resolve, reject) => clientValidation.name(value, resolve, reject))),
        body("document_number").custom(async (value) => new Promise((resolve, reject) => clientValidation.documentNumber(value, resolve, reject, clientRepository))),
        body("email").custom(async (value) => new Promise((resolve, reject) => clientValidation.email(value, resolve, reject))),
        VerifyJWT, async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                        if (userToken != null)
                            await register.execute({ name: req.body.name, documentNumber: req.body.document_number, email: req.body.email })
                                .then(_ => ReturnJsonSuccess(res, true)).catch(e => ReturnJsonError(res, e))
                        else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                    })
                } else {
                    const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                    ReturnJsonValidation(res, msgsError)
                }
            } catch (err) { ReturnJsonException(res, "Error fetching data.") }
        })

    router.get('/all', VerifyJWT, async (req: Request, res: Response) => {
        try {
            if (req.headers != null && typeof req.headers["x-access-token"] != "undefined" && req.headers["x-access-token"] != null) {
                GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                    if (userToken != null) await all.execute().then(valuesAll => ReturnJsonSuccess(res, valuesAll)).catch(e => ReturnJsonError(res, e))
                    else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                })
            } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.get('/open/:clientId', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null) await openById.execute(parseInt(req.params.clientId)).then(valueClient => ReturnJsonSuccess(res, valueClient)).catch(e => ReturnJsonError(res, e)); else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.get('/open/information/:cnpj', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null) {
                    if (typeof req.params.cnpj != "undefined" && req.params.cnpj != null && req.params.cnpj.length > 0) {
                        await openInformationByCnpj.execute(req.params.cnpj).then(valueClient => ReturnJsonSuccess(res, valueClient)).catch(e => ReturnJsonError(res, e));
                    } else ReturnJsonSuccess(res, {
                        name: "", email: "", foundation: "",
                        addressCodePostal: "", addressStreet: "", addressNumber: "",
                        addressDistrict: ""
                    })
                } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.put('/update/:clientId',
        body("name").custom(async value => new Promise((resolve, reject) => clientValidation.name(value, resolve, reject))),
        body("email").custom(async (value) => new Promise((resolve, reject) => clientValidation.email(value, resolve, reject))),
        VerifyJWT, async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                        if (userToken != null) {
                            await updateAllById.execute(parseInt(req.params.clientId), { name: req.body.name, email: req.body.email })
                                .then(_ => ReturnJsonSuccess(res, {})).catch(e => ReturnJsonError(res, e))
                        } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                    })
                } else {
                    const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                    ReturnJsonValidation(res, msgsError)
                }
            } catch (err) { ReturnJsonException(res, "Error fetching data.") }
        })

    router.delete('/:clientId', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null)
                    await deleteId.execute(parseInt(req.params.clientId)).then(_ => ReturnJsonSuccess(res, {})).catch(e => ReturnJsonError(res, e))
                else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.put('/delete', body('clientIds').notEmpty(), VerifyJWT, async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)
            if (errors.isEmpty()) {
                GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                    if (userToken != null)
                        await deleteIds.execute(req.body.clientIds).then(_ => ReturnJsonSuccess(res, {})).catch(e => ReturnJsonError(res, e))
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