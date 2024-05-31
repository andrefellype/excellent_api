import jwt from "jsonwebtoken";
import { VALUES_APP } from "@utils"
import { ReturnJsonError } from "../http";
import { UserAuthType } from "@domain/models/user";

export const VARIABLES_AUTH: {
    KEY_APP: { prod: string, dev: string }, EXPIRES_IN: { prod: number, dev: number }
} = {
    KEY_APP: { prod: "", dev: "vibeapp_5F814A2907F8072EE89DAB478D7CEA81" }, EXPIRES_IN: { prod: 0, dev: 86400 }
}

export const GetUserAuth = (req, keyApp): Promise<UserAuthType | null> => {
    return new Promise(async (resolve, _) => {
        const token = req.headers["x-access-token"];
        await jwt.verify(token, keyApp, (err, decoded) => {
            if (!err) resolve(decoded.userAuth);
            resolve(null)
        });
    })
}

export const VerifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]
    jwt.verify(token, VALUES_APP().AUTH.KEY_APP, (err, decoded) => {
        if (err) return ReturnJsonError(res, "token_invalid")
        req.userAuth = decoded.userAuth
        next()
    });
}