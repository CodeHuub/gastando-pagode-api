import { Request, Response, Router } from 'express'
import * as userController from "@controllers/user"

import { CreateUserDTO, FilterUserDTO, UpdateUserDTO } from '@controllers/user/dto/user.dto'
import { OK, NO_CONTENT } from 'http-status'
import { errorResponseHandler } from '@utils/responseHandlers'


const userRoutes = Router()

userRoutes.get('/:tenantId', async (req: Request, res: Response) => {
    const tenantId = req.params.tenantId
    const result = await userController.getById(tenantId)
    if (userController.isIUserError(result)) {
        return errorResponseHandler(res, result)
    }
    return res.status(OK).send(result)
})
userRoutes.put('/:tenantId', async (req: Request, res: Response) => {
    const tenantId = req.params.tenantId
    const payload: UpdateUserDTO = req.body

    const result = await userController.update(tenantId, payload)
    if (userController.isIUserError(result)) {
        return errorResponseHandler(res, result)
    }
    return res.status(OK).send(result)
})
userRoutes.delete('/:tenantId', async (req: Request, res: Response) => {
    const tenantId = req.params.tenantId

    const result = await userController.deleteById(tenantId)
    return res.status(NO_CONTENT)
})
userRoutes.post('/', async (req: Request, res: Response) => {
    const payload: CreateUserDTO = req.body
    const result = await userController.create(payload)

    if (userController.isIUserError(result)) {
        return errorResponseHandler(res, result)
    }
    return res.status(OK).send(result)
})
userRoutes.get('/', async (req: Request, res: Response) => {
    const filters: FilterUserDTO = req.query
    const results = await userController.getAll(filters)
    return res.status(OK).send(results)
})

export default userRoutes