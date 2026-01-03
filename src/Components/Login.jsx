import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Login() {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState(null);
  const navigation = useNavigate();
  async function login(data) {
    const response = await fetch(
      `http://localhost:3000/users/?username=${data.userName}`
    );
    const user = await response.json();
    if (user.length <= 0 || user[0].website != data.password)
      return setError("Login failed. Check your details and try again.");
    sessionStorage.setItem("current-user", JSON.stringify(user[0]));
    navigation("/");
  }
  sessionStorage.clear();
  localStorage.clear();
  return (
    <form onSubmit={handleSubmit(login)}>
      <label htmlFor="userName">User Name</label>
      <input
        type="text"
        name="userName"
        id="userName"
        {...register("userName")}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        {...register("password")}
      />
      <p className="errorLog">{error}</p>
      <button>Log In</button>
    </form>
  );
}
