import * as service from '@services/userServices'
import { CreateUserDTO, FilterUserDTO, UpdateUserDTO } from "./dto/user.dto"
import { IUser } from './interfaces/user.interface'
import * as userController from "@controllers/user"

import { EMAIL_EMPTY, EMAIL_INVALID, IUserError, NAME_EMPTY, PASSWORD_EMPTY, TENANT_ID_EMPTY, USER_NOT_FOUND } from "./interfaces/userError.interface"
import * as emailValidator from 'email-validator'
import bcrypt from 'bcrypt'
import userMapper from './mapper'
import httpStatus from 'http-status'

export const create = async (payload: CreateUserDTO): Promise<IUser | IUserError> => {

    // TODO - Verificar se o e-mail existe
    // TODO - Criptografar a senha

    const userValidation = validateUser(payload)
    if (userValidation) {
        return userValidation;
    }

    payload.tenantId = crypto.randomUUID();
    payload.password = await generatePassword(payload.password)

    return userMapper.toUser(await service.create(payload))
}
export const update = async (tenantId: string, payload: UpdateUserDTO): Promise<IUser | IUserError> => {

    // TODO - Verificar se o e-mail existe
    // TODO - Criptografar a senha
    // TODO - Verificar se não é a mesma senha

    const user = await getById(tenantId)
    if (userController.isIUserError(user)) {
        return user
    }
    const userValidation = validateUser(payload)
    if (userValidation) {
        return userValidation;
    }
    return userMapper.toUser(await service.update(tenantId, payload))
}
export const getById = async (tenantId: string): Promise<IUser | IUserError> => {

    if (!tenantId) {
        return TENANT_ID_EMPTY
    }

    const user = await service.getById(tenantId)
    if (!user) {
        return USER_NOT_FOUND
    }
    return userMapper.toUser(user)
}
export const deleteById = async (tenantId: string): Promise<Boolean | IUserError> => {

    if (!tenantId) {
        return TENANT_ID_EMPTY
    }
    const isDeleted = await service.deleteById(tenantId)
    return isDeleted
}
export const getAll = async (filters: FilterUserDTO): Promise<IUser[]> => {
    return (await service.getAll(filters)).map(userMapper.toUser)
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
    if (typeof payload.name === "string" && payload.name === '') {
        return NAME_EMPTY
    } else if (typeof payload.email === "string" && payload.email === '') {
        return EMAIL_EMPTY
    } else if (typeof payload.password === "string" && payload.password === '') {
        return PASSWORD_EMPTY
    } else if (!emailValidator.validate(payload.email)) {
        return EMAIL_INVALID
    }
    return null
}

export const isIUserError = (object: any): object is IUserError => {
    return 'errorMessage' in object && 'httpStatusCode' in object;
}