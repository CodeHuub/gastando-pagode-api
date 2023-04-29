import * as service from '@services/userServices'
import { CreateUserDTO, FilterUserDTO, UpdateUserDTO } from "./dto/user.dto"
import { IUser } from './interfaces/user.interface'
import * as mapper from "./mapper"

import { EMAIL_EMPTY, EMAIL_INVALID, IUserError, NAME_EMPTY, PASSWORD_EMPTY, TENANT_ID_EMPTY, USER_NOT_FOUND } from "./interfaces/userError.interface"
import * as emailValidator from 'email-validator'
import bcrypt from 'bcrypt'

export const create = async (payload: CreateUserDTO): Promise<IUser | IUserError> => {

    // TODO - Verificar se o e-mail existe
    // TODO - Criptografar a senha

    const userValidation = validateUser(payload)
    if (userValidation) {
        return userValidation;
    }

    payload.tenantId = crypto.randomUUID();
    payload.password = await generatePassword(payload.password)

    return mapper.toUser(await service.create(payload))
}
export const update = async (tenantId: string, payload: UpdateUserDTO): Promise<IUser | IUserError> => {

    // TODO - Verificar se o e-mail existe
    // TODO - Criptografar a senha
    // TODO - Verificar se não é a mesma senha


    const userValidation = validateUser(payload)
    if (userValidation) {
        return userValidation;
    }
    return mapper.toUser(await service.update(tenantId, payload))
}
export const getById = async (tenantId: string): Promise<IUser | IUserError> => {

    if (!tenantId) {
        return mapper.toUserError(TENANT_ID_EMPTY)
    }

    const user = await service.getById(tenantId)
    if (!user) {
        return mapper.toUserError(USER_NOT_FOUND)
    }
    return mapper.toUser(user)
}
export const deleteById = async (tenantId: string): Promise<Boolean | IUserError> => {

    if (!tenantId) {
        return mapper.toUserError(TENANT_ID_EMPTY)
    }
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

function validateUser(payload: UpdateUserDTO): IUserError | null {
    if (!payload.name) {
        return mapper.toUserError(NAME_EMPTY)
    } else if (!payload.email) {
        return mapper.toUserError(EMAIL_EMPTY)
    } else if (!payload.password) {
        return mapper.toUserError(PASSWORD_EMPTY)
    } else if (!emailValidator.validate(payload.email)) {
        return mapper.toUserError(EMAIL_INVALID)
    }
    return null
}

export const isIUserError = (object: any): object is IUserError => {
    return 'errorMessage' in object;
}