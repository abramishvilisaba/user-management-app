import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
        },
    },
    logging: false,
});

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.ENUM("active", "blocked"),
            allowNull: false,
        },
        last_login_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: "users",
    }
);

sequelize
    .sync({ force: false })
    .then(() => console.log("Tables have been created."))
    .catch((error) => console.error("Unable to create the tables:", error));

export { User };
