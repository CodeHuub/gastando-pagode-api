import { BAD_REQUEST, NOT_FOUND } from "http-status";
import userMapper from "../mapper";


export interface IUserError {
    errorMessage: string;
    httpStatusCode: number;
}

export const NAME_EMPTY = userMapper.toUserError('Name property is empty', BAD_REQUEST)
export const EMAIL_EMPTY = userMapper.toUserError('E-mail property is empty', BAD_REQUEST)
export const EMAIL_INVALID = userMapper.toUserError('E-mail is invalid, E.g test@test.com', BAD_REQUEST)
export const PASSWORD_EMPTY = userMapper.toUserError('Password property is empty', BAD_REQUEST)
export const USER_NOT_FOUND = userMapper.toUserError('User not found.', NOT_FOUND)
export const TENANT_ID_EMPTY = userMapper.toUserError('TenantId must be fill', BAD_REQUEST)