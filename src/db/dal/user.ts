import { Op } from 'sequelize'
import User from '@models/User'
import { GetAllUserFilters } from '@dal/types'
import { IUserInput, IUserOutput } from '@models/User'

export const create = async (payload: IUserInput): Promise<IUserOutput> => {
    const user = await User.create(payload)
    return user
}

export const update = async (tenantID: string, payload: Partial<IUserInput>): Promise<IUserOutput> => {
    const user = await User.findByPk(tenantID)
    if (!user) {
        throw new Error('not found!')
    }

    const updatedUser = await (user as User).update(payload)
    return updatedUser
}

export const getById = async (tenantId: string): Promise<IUserOutput> => {
    const user = await User.findByPk(tenantId)
    if (!user) {
        throw new Error('not found')
    }
    return user
}

export const deleteById = async (tenantId: string): Promise<boolean> => {
    const deletedUserCount = await User.destroy({
        where: { tenantId }
    })
    return !!deletedUserCount
}

export const getAll = async (filters?: GetAllUserFilters): Promise<IUserOutput[]> => {
    return User.findAll({
        where: {
            ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } })
        },
        ...((filters?.isDeleted || filters?.includeDeleted) && { paranoid: true })
    })
}