import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const serverUrl =
    process.env.SERVER_URL || "https://user-management-app-api.onrender.com";

function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${serverUrl}/login`, {
                name,
                password,
            });
            const token = response.data.accessToken;
            console.log(token);
            localStorage.setItem("token", token);
            if (token !== undefined) {
                navigate("/user-management");
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    const commonInputClass =
        "w-full px-3 py-2 border rounded font-semibold focus:outline-none focus:ring focus:ring-blue-500 ";
    const commonlabelClass = "block text-sm font-medium my-1";

    return (
        <div className=" w-screen m-auto p-16 my-24">
            <h1 className="text-2xl font-semibold mb-16 text-center">Login</h1>
            <form onSubmit={handleLogin} className="max-w-sm mx-auto">
                <div className="mb-4">
                    <label className={commonlabelClass}>Name</label>
                    <input
                        className={commonInputClass}
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className={commonlabelClass}>Password</label>
                    <input
                        className={commonInputClass}
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    // onClick={handleLogin}
                    className="w-full bg-blue-500 text-white py-2 rounded"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
