import { Request, Response, Router } from 'express'
import * as userController from "@controllers/user/userController"
import { CreateUserDTO, FilterUserDTO, UpdateUserDTO } from '@controllers/user/dto/user.dto'
import { OK, FORBIDDEN } from 'http-status'

const userRouter = Router()
userRouter.get(':/tenantId', async (req: Request, res: Response) => {
    const tenantId = req.params.tenantId
    const result = await userController.getById(tenantId)
    return res.status(200).send(result)
})
userRouter.put('/:tenantId', async (req: Request, res: Response) => {
    const tenantId = req.params.tenantId
    const payload: UpdateUserDTO = req.body

    const result = await userController.update(tenantId, payload)
    return res.status(201).send(result)
})
userRouter.delete('/:tenantId', async (req: Request, res: Response) => {
    const tenantId = req.params.tenantId

    const result = await userController.deleteById(tenantId)
    return res.status(204).send({
        success: result
    })
})
userRouter.post('/', async (req: Request, res: Response) => {
    const payload: CreateUserDTO = req.body
    const result = await userController.create(payload)

    if (userController.isIUserError(result)) {
        return res.status(FORBIDDEN).send(result.errorMessage)
    }
    return res.status(OK).send(result)
})
userRouter.get('/', async (req: Request, res: Response) => {
    const filters: FilterUserDTO = req.query
    const results = await userController.getAll(filters)
    return res.status(OK).send(results)
})

export default userRouter