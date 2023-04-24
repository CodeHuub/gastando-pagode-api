import * as mapper from "./userMapper"
import * as service from "@services/userServices"
import { CreateUserDTO, FilterUserDTO, UpdateUserDTO } from "./dto/user.dto"
import { IUser } from './interfaces/user.interface'
import { EMAIL_EMPTY, IUserError, NAME_EMPTY, PASSWORD_EMPTY } from "./interfaces/userError.interface"
import { v4 as uuid } from "uuid"
import bcrypt from 'bcrypt'

export const create = async (payload: CreateUserDTO): Promise<IUser | IUserError> => {
    if (!payload.name) {
        return mapper.toUserError(NAME_EMPTY)
    } else if (!payload.email) {
        return mapper.toUserError(EMAIL_EMPTY)
    } else if (!payload.password) {
        return mapper.toUserError(PASSWORD_EMPTY)
    }

    payload.tenantId = uuid();
    payload.password = await generatePassword(payload.password)

    return mapper.toUser(await service.create(payload))
}
export const update = async (tenantId: string, payload: UpdateUserDTO): Promise<IUser> => {
    return mapper.toUser(await service.update(tenantId, payload))
}
export const getById = async (tenantId: string): Promise<IUser> => {
    return mapper.toUser(await service.getById(tenantId))
}
export const deleteById = async (tenantId: string): Promise<Boolean> => {
    const isDeleted = await service.deleteById(tenantId)
    return isDeleted
}
export const getAll = async (filters: FilterUserDTO): Promise<IUser[]> => {
    return (await service.getAll(filters)).map(mapper.toUser)
}

function generatePassword(password: string): Promise<string> {
    return bcrypt
        .hash(password, process.env.PASSWORD_SALT || '10')
        .then(hash => {
            return hash
        })
        .catch(err => { return password })
}

function validatePassword(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt
        .compare(password, hashPassword)
        .then(res => {
            return res
        })
        .catch(err => { return false })
}

export const isIUserError = (object: any): object is IUserError => {
    return 'errorMessage' in object;
}