import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { appContext } from "../App";
export default function Register() {
  sessionStorage.clear();
  localStorage.clear();
  const { setUserID } = useContext(appContext);
  const [error, setError] = useState();
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState(null);
  async function submitStep1(data) {
    if (data.password !== data.verifyPassword) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/users?username=${data.userName}`
      );
      if (!response.ok)
        throw new Error(
          "Register faild, please re-check the details or try agian later."
        );

      const users = await response.json();
      if (users.length > 0) {
        throw new Error("This user name isn't valid, please try another one");
      }

      setNewUser({
        username: data.userName,
        password: data.password,
      });

      setStep(2);
    } catch (error) {
      setError(String(error));
    }
  }

  async function submitStep2(data) {
    const fullNewUser = {
      name: data.name,
      username: newUser.username,
      email: data.email,

      address: {
        street: data.street,
        suite: "Apt. 1",
        city: data.city,
        zipcode: "00000",
        geo: {
          lat: "0",
          lng: "0",
        },
      },

      phone: data.phoneNumber,
      website: newUser.password,
      company: {
        name: "N/A",
        catchPhrase: "N/A",
        bs: "N/A",
      },
    };

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullNewUser),
      });
      if (!response.ok)
        throw new Error("register faild, please check the details ageain.");
      const user = await response.json();
      setUserID(user.id);
      sessionStorage.setItem("current-user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      setError(error);
    }
  }

  return (
    <>
      {step === 1 && (
        <form onSubmit={handleSubmit(submitStep1)}>
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
          <label htmlFor="verifyPassword">Verify Password</label>
          <input
            type="password"
            name="verifyPassword"
            id="verifyPassword"
            {...register("verifyPassword")}
          />
          <p style={"fontColor:red"}>{error}</p>

          <button>Next</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(submitStep2)}>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" {...register("name")} />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" {...register("email")} />
          <label htmlFor="street">Street</label>
          <input
            type="text"
            name="street"
            id="street"
            {...register("street")}
          />
          <label htmlFor="city">City</label>
          <input type="text" name="city" id="city" {...register("city")} />
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            {...register("phoneNumber")}
          />
          <button>Register</button>
        </form>
      )}
    </>
  );
}
