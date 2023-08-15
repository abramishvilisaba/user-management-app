import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="flex justify-center items-center h-screen">
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
        </div>
    );
}

export default Home;
