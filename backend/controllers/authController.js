import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import mysql from "mysql2";
import _ from "underscore";

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 20,
});

// setInterval(() => {
//     connection.query("SELECT 1").catch((err) => {
//         console.error("Error pinging the database:", err);
//     });
// }, 1 * 60 * 1000);

const app = express();
const port = process.env.PORT || 3001;
const secretKey = process.env.JWT_SECRET || "super-secret-key";

app.use(express.json());

app.use(
    cors({
        origin: "https://user-management-app-joix.onrender.com",
    })
);

async function getUsers() {
    const [rows] = await connection.promise().query("SELECT * FROM users");
    return rows;
}

async function getUserById(id) {
    const [rows] = await connection
        .promise()
        .query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
}

async function registerUser(name, email, password, callback) {
    const query =
        "INSERT INTO users (name, email, password,registration_time) VALUES (?, ?, ?,NOW())";
    connection.query(query, [name, email, password], callback);
}

async function updateUserStatus(userIds, status) {
    const query = "UPDATE users SET status = ? WHERE id IN (?)";
    await connection.promise().query(query, [status, userIds]);
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

async function updateLogin(userId) {
    console.log("update");
    const query = "UPDATE users SET last_login_time = now() WHERE id = ?";
    await connection.promise().query(query, [userId]);
}

app.post("/login", async (req, res) => {
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
            await updateLogin(user.id);
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
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await registerUser(
            req.body.name,
            req.body.email,
            hashedPassword,
            (error, results) => {
                if (error) {
                    console.error("Registration failed:", error);
                    res.status(500).json({
                        error: "Registration failed. User with this email already exists.",
                    });
                } else {
                    console.log("Registration successful:", results);
                    res.status(201).send();
                }
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).send();
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

app.delete("/user-management/delete", (req, res) => {
    console.log("delete");
    const { userIds } = req.body;
    console.log(userIds);
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: "Invalid input" });
    }
    const query = "DELETE FROM users WHERE id IN (?)";
    connection.query(query, [userIds], (error, results) => {
        if (error) {
            console.error("Error deleting users:", error);
            res.status(500).json({ error: "Error deleting users" });
        } else {
            console.log("Users deleted successfully");
            res.status(200).json({ message: "Users deleted successfully" });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
