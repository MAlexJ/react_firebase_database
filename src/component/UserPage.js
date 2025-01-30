import React, {useCallback, useEffect, useState} from "react";

export default function UserPage() {
  // List of users
  const [users, setUsers] = useState([]);

  // State for API errors
  const [errorMessage, setErrorMessage] = useState(null);

  // User ID from the form
  const [userId, setUserId] = useState("");

  // Username from the form
  const [userFirstName, setUserFirstName] = useState("");

  const backendUrl = process.env.REACT_APP_SERVER_URL;

  // Memoize the fetchUsers function using useCallback
  const fetchUsers = useCallback(async () => {
    const tg = window.Telegram?.WebApp;
    try {
      const response = await fetch(backendUrl, {
        method: "GET", headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": tg.initData || "empty",
        },
      });
      if (!response.ok) {
        console.error("Error fetching the list of users");
        return;
      }
      const data = await response.json();
      const {users} = data;
      // Ensure 'users' exists in the response
      if (users) {
        // Set the users data from the response
        setUsers(users);
      } else {
        console.error("No users data found");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [backendUrl]); // Dependency array to re-run if backendUrl changes

  // Fetch the list of users from the backend
  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers(); // Await fetchUsers call
    };

    // Call the async function inside useEffect
    fetchData().catch((error) => {
      console.error("Error in fetching data:", error);
    });
  }, [fetchUsers]); // Now fetchUsers is stable and added as a dependency

  // Handle adding a new user
  const handleAddUser = async () => {
    if (!userId || !userFirstName) {
      alert("Please fill out all fields");
      return;
    }

    const newUser = {userId: userId, first_name: userFirstName};

    const tg = window.Telegram?.WebApp;

    try {
      const response = await fetch(backendUrl, {
        method: "POST", headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": tg.initData || "empty",
        }, body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        console.error("Error adding the user");
        // Reset form fields
        setUserId("");
        setUserFirstName("");
        setErrorMessage("Error adding the user");
        return;
      }

      // Update the user list
      await fetchUsers();
      // setUsers((prevUsers) => [...prevUsers, newUser]);

      // Reset form fields
      setUserId("");
      setUserFirstName("");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Error adding the user"); // Catch and set the error message
      console.error("Error adding user:", error);
    }
  };

  return (<div
      className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
    <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Users Page</h1>

      {/* User creation form */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="flex-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-blue-500"
        />
        <br/>
        <br/>
        <input
            type="text"
            value={userFirstName}
            onChange={(e) => setUserFirstName(e.target.value)}
            placeholder="User first name"
            className="flex-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-blue-500"
        />
        <br/>
        <br/>
        <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
          Create
        </button>
      </div>
      <br/>
      {errorMessage && (<div
          style={{color: "red"}}
          className="mt-4 p-2 bg-red-100 text-red-600 border border-red-400 rounded">
        {errorMessage}
      </div>)}
      <br/>
      {/* List of users */}
      <ul className="divide-y divide-gray-200">
        {users.map(
            (user) => (<li key={user.id} className="py-4 flex justify-between">
              <div>
                    <span
                        className="text-gray-700">User id: {user.id}, userId : {user.userId}</span><br/>
                <span className="text-gray-500">Info: {JSON.stringify(
                    user.userInfo, null, 1)}</span><br/>
                <span className="text-gray-500">Refs: {JSON.stringify(
                    user.references, null, 1)}</span>
                <br/>
                <br/>
              </div>
            </li>))}
      </ul>

      {users.length === 0 &&
          (<p className="text-gray-500 text-center mt-4">No users found</p>)}
    </div>
  </div>);
}
