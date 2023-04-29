import * as userDal from '@dal/user'
import { GetAllUserFilters } from '@dal/types'
import { IUserInput, IUserOutput } from "@models/User"

export const create = (payload: IUserInput): Promise<IUserOutput> => {
    return userDal.create(payload)
}
export const update = (tenantId: string, payload: Partial<IUserInput>): Promise<IUserOutput> => {
    return userDal.update(tenantId, payload)
}
export const getById = (tenantId: string): Promise<IUserOutput | null> => {
    return userDal.getById(tenantId)
}
export const deleteById = (tenantId: string): Promise<boolean> => {
    return userDal.deleteById(tenantId)
}
export const getAll = (filters: GetAllUserFilters): Promise<IUserOutput[]> => {
    return userDal.getAll(filters)
}