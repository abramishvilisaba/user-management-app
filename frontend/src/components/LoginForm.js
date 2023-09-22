import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/login`, {
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
        <div className="w-screen m-auto p-16 my-24 flex justify-center">
            <div className="mt-16 sm:w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%] px-12 pb-16 pt-8 bg-gray-50 shadow-xl rounded-xl">
                <div className="w-full  mt-4 flex justify-start h-fit">
                    <FontAwesomeIcon
                        icon={faCircleChevronLeft}
                        size="2xl"
                        style={{ color: "#3b82f6", cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    />
                </div>
                <h1 className="text-2xl font-semibold mb-12 text-center">Login</h1>
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
        </div>
    );
}

export default Login;
