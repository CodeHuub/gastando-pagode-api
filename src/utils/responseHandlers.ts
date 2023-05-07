import { IUserError } from "@controllers/user/interfaces"
import { Response } from "express"


export const errorResponseHandler = (response: Response, result: IUserError) => {
    return response
        .status(result.httpStatusCode)
        .send({ errorMessage: result.errorMessage })
}
