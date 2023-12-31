// UserManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import _ from "underscore";
import { faBan, faUnlock, faTrash, faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_URL = process.env.REACT_APP_API_URL;

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userId, setUserId] = useState(0);
    const navigate = useNavigate();
    console.log(users);
    console.log(selectedUsers);

    useEffect(() => {
        fetchUserManagementData();
    }, []);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        const updatedSelectedUsers = _.mapObject(selectedUsers, () => !selectAll);
        setSelectedUsers(updatedSelectedUsers);
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers((prevSelectedUsers) =>
            _.extend({}, prevSelectedUsers, {
                [userId]: !prevSelectedUsers[userId],
            })
        );
    };

    useEffect(() => {
        const initialSelectedUsers = users.reduce((acc, user) => {
            acc[user.id] = false;
            return acc;
        }, {});
        console.log("initialSelectedUsers" + initialSelectedUsers);

        setSelectedUsers(initialSelectedUsers);
    }, [users]);

    const getFormattedTimestamp = (registration_time) => {
        const date = new Date(registration_time);
        const formattedTime = format(date, "yyyy-MM-dd HH:mm:ss");
        return formattedTime;
    };

    const fetchUserManagementData = async () => {
        const token = localStorage.getItem("token");
        try {
            axios
                .get(`${API_URL}/user-management`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (!response.data.length || response.data.length < 1) {
                        navigate("/login");
                    }
                    setUsers(response.data);
                });
        } catch (error) {
            navigate("/login");
        }
    };

    const handleDelete = async (token, selectedUserIds) => {
        try {
            const response = await axios.delete(`${API_URL}/user-management/delete`, {
                data: { userIds: selectedUserIds },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data.message);
            fetchUserManagementData();
        } catch (error) {
            console.error("Error deleting users:", error);
        }
    };

    const handleBlock = async (token, selectedUserIds) => {
        try {
            await axios.patch(
                `${API_URL}/user-management/update`,

                { userIds: selectedUserIds, status: "blocked" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchUserManagementData();
        } catch (error) {
            navigate("/login");
            console.error("Error blocking user:", error);
        }
    };

    const handleUnblock = async (token, selectedUserIds) => {
        try {
            await axios.patch(
                `${API_URL}/user-management/update`,
                {
                    userIds: selectedUserIds,
                    status: "active",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchUserManagementData();
        } catch (error) {
            navigate("/login");
            console.error("Error unblocking user:", error);
        }
    };

    const handleAction = async (action) => {
        const token = localStorage.getItem("token");
        console.log(token);
        const selectedUserIds = Object.keys(selectedUsers)
            .filter((userId) => selectedUsers[userId] === true)
            .map(Number);

        if (!selectedUserIds || selectedUserIds.length === 0) {
            return;
        }
        if (action === "delete") {
            handleDelete(token, selectedUserIds);
        } else if (action === "block") {
            handleBlock(token, selectedUserIds);
        } else if (action === "unblock") {
            handleUnblock(token, selectedUserIds);
        } else {
            console.error("Invalid action:", action);
        }
    };

    const selectedUserId = 0;

    console.log(users);

    return users.length ? (
        <div className="p-10 w-2/3 text-center m-auto">
            <div className=" mx-auto mt-4 flex justify-start w-full h-fit">
                <FontAwesomeIcon
                    icon={faCircleChevronLeft}
                    size="2xl"
                    style={{ color: "#3b82f6", cursor: "pointer" }}
                    onClick={() => navigate("/")}
                />
            </div>
            <h1 className="text-2xl font-semibold mb-8 ">User Management</h1>
            <div className="flex justify-between items-center mb-4">
                <div className="flex">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => handleAction("block")}
                    >
                        <FontAwesomeIcon icon={faBan} className="mr-1" /> Block
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => handleAction("unblock")}
                    >
                        <FontAwesomeIcon icon={faUnlock} className="mr-2" />
                        Unblock
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => handleAction("delete")}
                    >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Delete
                    </button>
                </div>
            </div>
            <table className="table-auto w-full border-collapse border rounded">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2">
                            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                        </th>
                        <th className="p-2">ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Registration Time</th>
                        <th className="p-2">Last Login Time</th>
                        <th className="p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length
                        ? users.map((user) => (
                              <tr key={user.id} className="border-t text-center">
                                  <td className="p-2">
                                      <input
                                          type="checkbox"
                                          checked={selectedUsers[user.id]}
                                          onChange={() => handleSelectUser(user.id)}
                                      />
                                  </td>
                                  <td className="p-2">{user.id}</td>
                                  <td className="p-2">{user.name}</td>
                                  <td className="p-2">{user.email}</td>
                                  <td className="p-2">
                                      {user.createdAt && getFormattedTimestamp(user.createdAt)}
                                  </td>
                                  <td className="p-2">
                                      {user.last_login_time &&
                                          getFormattedTimestamp(user.last_login_time)}
                                  </td>
                                  <td className="p-2">{user.status}</td>
                              </tr>
                          ))
                        : null}
                </tbody>
            </table>
        </div>
    ) : null;
}

export default UserManagement;
