import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    const email = event.target.elements[0].value;
    const name = event.target.elements[1].value;
    const company = event.target.elements[2].value;
    const address = event.target.elements[3].value;
    const role = event.target.elements[4].value;
    const password = event.target.elements[5].value;
    const username = event.target.elements[6].value;

    fetch("api/userprofiles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username: username,
          email: email,
          password: password,
        },
        name: name,
        company: {
          name: company,
          address: address,
        },
        role: role,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        if (data.access) {
          navigate("/home");
        } else {
          setErrorMessage(data.user.username);
        }
      })
      .catch((error) => {
        setErrorMessage(
          "An error occurred while trying to create your account."
        );
      });
  };

  return (
    <div>
      <h1>Register Page</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Email" required />
        <input type="text" placeholder="Name" required />
        <input type="text" placeholder="Company" required />
        <input type="text" placeholder="Address" required />
        <input type="text" placeholder="Role" required />
        <input type="password" placeholder="Password" required />
        <input type="username" placeholder="Username" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
