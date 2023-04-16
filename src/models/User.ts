import { DataType, DataTypes, Model, Optional } from "sequelize"
import sequelizeConnection from "@db/config"

interface IUserAttributes {
    tenantId: string;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updateAt?: Date;
    deleteAt?: Date;
}

export interface IUserInput extends Optional<IUserAttributes, 'tenantId'> { }
export interface IUserOutput extends Required<IUserAttributes> { }

class User extends Model<IUserAttributes, IUserInput> implements IUserAttributes {
    public tenantId!: string
    public name!: string
    public email!: string;
    public password!: string;
    public readonly createdAt!: Date;
    public readonly updateAt!: Date;
    public readonly deleteAt!: Date;
}

User.init({
    tenantId: {
        type: DataTypes.STRING,
        autoIncrement: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true
})

export default User