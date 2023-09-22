import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import mysql from "mysql2";
import _ from "underscore";
import dotenv from "dotenv";
import { User } from "./models/index.js";
dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     connectionLimit: 20,
// });

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;
const secretKey = process.env.JWT_SECRET || "super-secret-key";

const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS.split(","),
};
app.use(cors(corsOptions));

async function getUsers() {
    const users = await User.findAll();
    return users;
}

async function getUserById(id) {
    const user = await User.findByPk(id);
    return user;
}

async function registerUser(name, email, password) {
    const user = await User.create({ name, email, password });
    return user;
}

async function updateUserStatus(userIds, status) {
    const updatedUsers = await User.update({ status }, { where: { id: userIds } });
    return updatedUsers;
}

async function authenticateToken(req, res, next) {
    if (req) {
        try {
            const token = req.header("Authorization")?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ error: "No token provided" });
            }
            const decodedToken = jwtDecode(token);
            const currentUser = await getUserById(decodedToken.id);
            if (!currentUser || currentUser.status !== "active") {
                console.log("User not found or status is not active");
                res.json({});
            }
            jwt.verify(token, secretKey, (error, user) => {
                if (error) {
                    return res.status(403).json({ error: "Token invalid" });
                }
                req.user = user;
            });
            next();
        } catch (error) {
            console.error("Error during authentication:", error);
            res.json({});
        }
    } else {
        res.status(500).json({ error: "Internal server error" });
    }
}

async function updateLastLoginTime(userId) {
    try {
        const user = await User.findByPk(userId);
        if (user) {
            user.last_login_time = new Date();
            await user.save();
            console.log(`Updated 'last_login_time' for user with ID ${userId}`);
        } else {
            console.error(`User with ID ${userId} not found`);
        }
    } catch (error) {
        console.error("Error updating last_login_time:", error);
    }
}

app.post("/login", async (req, res) => {
    console.log("login");
    const users = await getUsers();
    const user = users.find((user) => user.name === req.body.name);
    if (user == null) {
        return res.status(400).send("Cannot find user");
    }
    if (user.status !== "active") {
        return res.status(403).send("User Not Active");
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ id: user.id }, secretKey);
            console.log("updateUserStatusToActive");
            await updateLastLoginTime(user.id);
            // localStorage.setItem("token", accessToken);
            res.json({ accessToken });
        } else {
            res.status(401).send("Authentication failed");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

app.post("/register", async (req, res) => {
    console.log("/register");
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            console.error("Registration failed: User with this email already exists.");
            return res.status(400).json({
                error: "Registration failed. User with this email already exists.",
            });
        }
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            status: "active",
        });
        console.log("Registration successful:", newUser);
        res.status(201).send();
    } catch (error) {
        console.error("Registration failed:", error);
        res.status(500).json({ error: "Registration failed." });
    }
});

app.use("/user-management", authenticateToken);

app.get("/user-management", async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        console.log(error);
    }
});

app.patch("/user-management/update", async (req, res) => {
    const { userIds, status } = req.body;
    if (!userIds || !Array.isArray(userIds) || !status) {
        return res.status(400).json({ error: "Invalid input" });
    }
    try {
        await updateUserStatus(userIds, status);
        res.status(200).json({ message: "User statuses updated successfully" });
    } catch (error) {
        console.error("Error updating user statuses:", error);
        res.status(500).json({ error: "Error updating user statuses" });
    }
});

app.delete("/user-management/delete", async (req, res) => {
    try {
        console.log("delete");
        const { userIds } = req.body;
        console.log(userIds);
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ error: "Invalid input" });
        }
        const deletedUsers = await User.destroy({ where: { id: userIds } });

        if (deletedUsers > 0) {
            console.log("Users deleted successfully");
            res.status(200).json({ message: "Users deleted successfully" });
        } else {
            console.error("No users were deleted");
            res.status(404).json({ error: "No users were deleted" });
        }
    } catch (error) {
        console.error("Error deleting users:", error);
        res.status(500).json({ error: "Error deleting users" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
