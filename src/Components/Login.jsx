import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login(props) {
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
        if (data[0].website != password)
          return console.log("password wrong!!!!", data);
        sessionStorage.setItem(
          "current-user",
          JSON.stringify({
            id: data[0].id,
            name: data[0].name,
            username: data[0].userName,
            email: data[0].email,
            address: data[0].address,
          })
        );
        navigation("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
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
  );
}
