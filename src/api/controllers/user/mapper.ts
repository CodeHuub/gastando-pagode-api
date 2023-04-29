import { IUser } from "./interfaces/user.interface";
import { IUserError } from "./interfaces/userError.interface";
import { IUserOutput } from "@db/models/User";

export const toUser = (user: IUserOutput): IUser => {
    return {
        tenantId: user.tenantId,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    }
}

export const toUserError = (errorMessage: string): IUserError => {
    return {
        errorMessage
    }
}