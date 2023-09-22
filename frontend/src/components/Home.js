import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Home() {
    const [connected, setConnected] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 30;
    const retryInterval = 5000;

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        console.log("trying to connect :", retryCount);
        async function pingServer() {
            try {
                const response = await fetch(`${API_URL}/ping`);
                if (response.ok) {
                    setConnected(true);
                }
            } catch (error) {
                console.error("Error while pinging the server:", error);
                if (retryCount < maxRetries) {
                    setTimeout(() => {
                        setRetryCount(retryCount + 1);
                        // pingServer();
                    }, retryInterval);
                }
            }
        }
        pingServer();
    }, [retryCount]);

    return (
        <div className="flex justify-center items-center h-screen">
            {connected ? (
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-16">
                        Welcome to the User Management App!
                    </h1>
                    <div className="mb-4">
                        <Link
                            to="/register"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2"
                        >
                            Register
                        </Link>
                        <Link
                            to="/login"
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mr-2"
                        >
                            Login
                        </Link>
                        <Link
                            to="/user-management"
                            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
                        >
                            User Management
                        </Link>
                    </div>
                </div>
            ) : (
                <FontAwesomeIcon icon={faSpinner} spin size="2xl" style={{ color: "#052966" }} />
            )}
        </div>
    );
}

export default Home;
