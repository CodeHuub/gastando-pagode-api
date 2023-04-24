import { Optional } from "sequelize/types"

export type CreateUserDTO = {
    tenantId?: string;
    name: string;
    email: string;
    password: string;
}

export type UpdateUserDTO = Optional<CreateUserDTO, 'tenantId'>

export type FilterUserDTO = {
    isDeleted?: boolean
    includeDeleted?: boolean
}