import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegistrationForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const navigate = useNavigate();

    const serverUrl =
        process.env.SERVER_URL ||
        "https://user-management-app-api.onrender.com";

    // const serverUrl = "http://localhost:3001";

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${serverUrl}/register`, {
                name,
                email,
                password,
            });
            navigate("/login");
            console.log("Registration successful:", response.data);
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    const commonInputClass =
        "w-full px-3 py-2 border rounded font-semibold focus:outline-none focus:ring focus:ring-blue-500 ";
    const commonlabelClass = "block text-sm font-medium my-1";

    return (
        <div className=" w-screen m-auto p-16 my-24">
            <h1 className="text-2xl font-semibold mb-16 text-center">
                User Registration
            </h1>
            <form onSubmit={handleRegistration} className="max-w-sm mx-auto">
                <div className="mb-4">
                    <label className={commonlabelClass}>Name</label>
                    <input
                        type="text"
                        className={commonInputClass}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className={commonlabelClass}>Email</label>
                    <input
                        type="email"
                        className={commonInputClass}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className={commonlabelClass}>Password</label>
                    <input
                        type="password"
                        className={commonInputClass}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default RegistrationForm;
