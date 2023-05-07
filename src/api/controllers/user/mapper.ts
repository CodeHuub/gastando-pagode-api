import { IUser } from "./interfaces/user.interface";
import { IUserError } from "./interfaces/userError.interface";
import { IUserOutput } from "@db/models/User";

const userMapper = {

    toUser: (user: IUserOutput): IUser => {
        return {
            tenantId: user.tenantId,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }
    },

    toUserError: (errorMessage: string, httpStatusCode: number): IUserError => {
        return {
            errorMessage,
            httpStatusCode
        }
    }
}

export default userMapper