import { createUser, getUsers } from "./database.js";
import express from "express";
import path from "path";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import mysql from "mysql2";
import _, { map } from "underscore";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nono1234",
    database: "users_app",
});

const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());
const secretKey = process.env.JWT_SECRET || "super-secret-key";

app.post("/login", async (req, res) => {
    let users = await getUsers();
    console.log(req.body);
    const user = users.find((user) => user.name === req.body.name);
    console.log(user);
    if (user == null) {
        return res.status(400).send("Cannot find user");
    }
    if (user.status !== "active") {
        return res.status(403).send("User Not Active");
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ id: user.id }, secretKey);
            console.log(accessToken);
            console.log("login");
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

function registerUser(name, email, password, callback) {
    const query =
        "INSERT INTO users (name, email, password,registration_time) VALUES (?, ?, ?,NOW())";
    connection.query(query, [name, email, password], callback);
}

async function authenticateToken(req, res, next) {
    console.log("A------------------------------");
    const token = req.header("Authorization")?.split(" ")[1];
    let users = await getUsers();
    const decodedToken = jwtDecode(token);
    const currentUser = _.find(users, (user) => user.id === decodedToken.id);

    console.log(currentUser);

    if (!currentUser || currentUser.status !== "active") {
        console.log("User not found or status is not active");
        // return next(new Error("User not authorized"));

        return res.status(401).json({ error: "User not authorized" });
    }

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, secretKey, (error, user) => {
        if (error) {
            return res.status(403).json({ error: "Token invalid" });
        }
        req.user = user;
    });
    next();
}

app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        registerUser(req.body.name, req.body.email, hashedPassword);
        res.status(201).send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

app.get("/user-management", async (req, res) => {
    try {
        let users = await getUsers();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" }); // Sending an error response
    }
});

app.use("/user-management", authenticateToken);
app.use((err, req, res, next) => {
    if (err.message === "User not authorized") {
        return res.redirect("/login");
    }
    res.status(500).json({ error: "Internal server error" });
});

app.patch("/user-management/update", (req, res) => {
    const { userIds, status } = req.body;

    if (!userIds || !Array.isArray(userIds) || !status) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const query = "UPDATE users SET status = ? WHERE id IN (?)";

    connection.query(query, [status, userIds], (error, results) => {
        if (error) {
            console.error("Error updating user statuses:", error);
            res.status(500).json({ error: "Another response!" });
        } else {
            console.log("User statuses updated successfully");
            res.status(200).json({ message: "Response sent!" });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
