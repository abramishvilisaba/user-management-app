import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function RegistrationForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    console.log(API_URL);

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/register`, {
                name,
                email,
                password,
            });
            console.log("Registration successful:", response.data);
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.response.data.error);
        }
    };

    const commonInputClass =
        "w-full px-3 py-2 border rounded font-semibold focus:outline-none focus:ring focus:ring-blue-500 ";
    const commonlabelClass = "block text-sm font-medium my-1";

    return (
        <div className="w-screen m-auto  my-24 flex justify-center">
            <div className="mt-16 sm:w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%] px-12 pb-16 pt-8 bg-gray-50 shadow-xl rounded-xl">
                <div className="w-full  mt-4 flex justify-start h-fit">
                    <FontAwesomeIcon
                        icon={faCircleChevronLeft}
                        size="2xl"
                        style={{ color: "#3b82f6", cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    />
                </div>
                <h1 className="text-2xl font-semibold mb-12 text-center ">User Registration</h1>
                <form onSubmit={handleRegistration} className="w-full mx-0">
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
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegistrationForm;
