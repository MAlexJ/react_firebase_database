import React, {useCallback, useEffect, useState} from "react";
import log from "loglevel";

export default function UserPage() {

  const [user, setUser] = useState([]);

  const backendUrl = process.env.REACT_APP_SERVER_URL;
  const testTgInitData = window.Telegram?.WebApp.initData ||
      process.env.REACT_APP_TEST_TG_INIT_DATA;

  const fetchUsers = useCallback(async () => {
    await fetch(backendUrl, {
      method: "GET", headers: {
        "Content-Type": "application/json", "X-Auth-Token": testTgInitData,
      },
    }).then(response => {
      return response.json();
    }).then(user => {
      setUser(user);
    }).catch(error => {
      log.error("Error fetching the list of users", error);
    });
  }, [backendUrl, testTgInitData]);

  // Fetch the list of users from the backend
  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
    };

    fetchData().catch((error) => {
      log.error("Error in fetching user by tgInitData:", error);
    });
  }, [fetchUsers]);

  return (<div
      className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
    <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Users Page</h1>
      {JSON.stringify(user, null, 2)}
    </div>
  </div>);
}
