import express from 'express'
import { Request, Response } from 'express'
import { ReturnJsonError, ReturnJsonException, ReturnJsonSuccess, ReturnJsonValidation } from '@/app/utils/http';
import { GetUserAuth, VALUES_APP, VARIABLES_VALIDATION, VerifyJWT } from '@utils';
import { body, validationResult } from 'express-validator';
import { OrderValidation } from '@validation';
import { OrderDeleteByIdsUseCase, OrderDeleteByIdUseCase, OrderOpenAllUseCase, OrderRegisterUseCase } from '@domain/interfaces/use-cases';

export function OrderRouter(
    orderValidation: OrderValidation,
    all: OrderOpenAllUseCase,
    register: OrderRegisterUseCase,
    deleteId: OrderDeleteByIdUseCase,
    deleteIds: OrderDeleteByIdsUseCase
) {
    const TITLE_VALIDATION = "order"

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

    router.post('/register',
        body('quantity').custom(async value => new Promise((resolve, reject) => { orderValidation.quantity(value, resolve, reject) })),
        body('product_ids').custom(async value => new Promise((resolve, reject) => { orderValidation.productsId(value, resolve, reject) })),
        body('client_id').custom(async value => new Promise((resolve, reject) => { orderValidation.clientId(value, resolve, reject) })),
        VerifyJWT, async (req: Request, res: Response) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                        if (userToken != null) {
                            for (let p = 0; p < req.body.product_ids.length; p++)
                                await register.execute({ quantity: req.body.quantity, productId: req.body.product_ids[p], clientId: req.body.client_id }).catch(e => ReturnJsonError(res, e))
                            ReturnJsonSuccess(res, {})
                        } else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
                    })
                } else {
                    const msgsError = errors.array({ onlyFirstError: true }).map(er => ({ ...er, object: TITLE_VALIDATION }))
                    ReturnJsonValidation(res, msgsError)
                }
            } catch (err) { ReturnJsonException(res, "Error fetching data.") }
        })

    router.delete('/:orderId', VerifyJWT, async (req: Request, res: Response) => {
        try {
            GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                if (userToken != null)
                    await deleteId.execute(parseInt(req.params.orderId)).then(value => ReturnJsonSuccess(res, value)).catch(e => ReturnJsonError(res, e))
                else ReturnJsonError(res, VARIABLES_VALIDATION.TOKEN_INVALID)
            })
        } catch (err) { ReturnJsonException(res, "Error fetching data.") }
    })

    router.put('/delete', body('orderIds').notEmpty(), VerifyJWT, async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)
            if (errors.isEmpty()) {
                GetUserAuth(req, VALUES_APP().AUTH.KEY_APP).then(async userToken => {
                    if (userToken != null)
                        await deleteIds.execute(req.body.orderIds).then(value => ReturnJsonSuccess(res, value)).catch(e => ReturnJsonError(res, e))
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