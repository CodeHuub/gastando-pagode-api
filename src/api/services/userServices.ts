import { IUserInput, IUserOutput } from "@db/models/User"
import * as userDal from '@dal/user'
import { GetAllUserFilters } from "@db/dal/types"

export const create = (payload: IUserInput): Promise<IUserOutput> => {
    return userDal.create(payload)
}
export const update = (tenantId: string, payload: Partial<IUserInput>): Promise<IUserOutput> => {
    return userDal.update(tenantId, payload)
}
export const getById = (tenantId: string): Promise<IUserOutput> => {
    return userDal.getById(tenantId)
}
export const deleteById = (tenantId: string): Promise<boolean> => {
    return userDal.deleteById(tenantId)
}
export const getAll = (filters: GetAllUserFilters): Promise<IUserOutput[]> => {
    return userDal.getAll(filters)
}