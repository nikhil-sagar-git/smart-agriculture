import { useEffect, useState } from "react";


export default function ManageUsers() {

  const [users, setUsers] = useState([]);

  // Fetch all users
  const getData = async () => {

    try {

      const res = await fetch("https://smart-agriculture-node.onrender.com/getdata");

      const data = await res.json();

      setUsers(data.users);

    } catch (err) {
      console.log(err);
    }
  };

  // Delete user
  const deleteUser = async (id) => {

    try {

      await fetch(`https://smart-agriculture-node.onrender.com/delete/${id}`, {
        method: "DELETE"
      });

      // Refresh users
      getData();

    } catch (err) {
      console.log(err);
    }
  };

  // Load automatically
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>

      <div className="navbar">
        <h2>All Users</h2>
      </div>

      <div className="users-container">

        {users.map((user) => (

          <div className="user-card" key={user.id}>

            <h3>{user.username}</h3>

            <p>{user.email}</p>

            <p>
              Joined:
              {" "}
              {new Date(user.created_at).toLocaleString()}
            </p>

            <button
              className="delete-btn"
              onClick={() => deleteUser(user.id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}