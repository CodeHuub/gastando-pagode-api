export interface IUser {
    tenantId: string;
    name: string;
    email: string;
    createdAt?: Date;
    errorMessage?: string;
}