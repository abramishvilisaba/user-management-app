import mysql from "mysql2";
const pool = mysql
    .createPool({
        host: process.env.HOST,
        user: "root",
        password: "nono1234",
        database: "users_app",
    })
    .promise();

export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
}

export async function createUser(name, email, password) {
    const result = await pool.query(
        `
    INSERT INTO users (name, email,password)
    VALUES (?,?,?)
    `,
        [name, email, password]
    );
}
// const result = await createUser("title1", "content1");
// const users = await getUsers();
