import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
export default function Register(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();
  function login() {
    fetch(`http://localhost:3000/users/?userName=${userName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length <= 0) {
          return console.log("failed to log in");
        }
        navigation("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <>
      <form>
        <label htmlFor="userName">User Name</label>
        <input
          type="text"
          name="userName"
          id="userName"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        ></input>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <button
          id="submitLogin"
          onClick={(e) => {
            e.preventDefault();
            login();
          }}
        >
          Log In
        </button>
      </form>
      <Outlet></Outlet>
    </>
  );
}
