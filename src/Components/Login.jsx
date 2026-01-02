import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigation = useNavigate();
  async function login(data) {
    const response = await fetch(
      `http://localhost:3000/users/?username=${data.userName}`
    );
    const user = await response.json();
    if (user.length <= 0) return console.log("User does not exist", user);
    if (user[0].website != data.password)
      return console.log("Wrong password", user);
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
      <button>Log In</button>
    </form>
  );
}
