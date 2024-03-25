import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
function HomePage() {
  const [paints, setPaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedRole, setUpdatedRole] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/paints/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setPaints(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
    fetch("http://localhost:8000/api/userprofiles/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  const handleUpdate = async (event, user) => {
    event.preventDefault();
    const response = await fetch(
      `http://localhost:8000/api/userprofiles/${user.id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": `application/json`,
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          role: updatedRole,
        }),
      }
    );
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      setUsers(users.map((u) => (u.id === user.id ? data : u)));
    }
  };
  return (
    <div>
      <Navbar />
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      <h2>Available Paints</h2>
      {paints.length > 0 ? (
        <ul>
          {paints.map((paint) => (
            <li key={paint.id}>{paint.name}</li>
          ))}
        </ul>
      ) : (
        <p>No paints available.</p>
      )}
      <div>
        {users.map((user) => (
          <div key={user.id}>
            <h2>User {user.id}</h2>
            <p>Role: {user.role}</p>
            {(!selectedUser || selectedUser.id !== user.id) && (
              <button onClick={() => setSelectedUser(user)}>Edit User</button>
            )}
            {selectedUser && selectedUser.id === user.id && (
              <form onSubmit={(e) => handleUpdate(e, user)}>
                <input
                  type="text"
                  placeholder="Role"
                  value={updatedRole}
                  onChange={(e) => setUpdatedRole(e.target.value)}
                  required
                />
                <button type="submit">Update User</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
