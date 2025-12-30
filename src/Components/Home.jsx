import { useEffect } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  const id = JSON.parse(sessionStorage.getItem("current-user")) || null;
  useEffect(() => {
    if (!id) navigate("/login");
  });

  return (
    <>
      <NavBar id={id} />
      <h1>Home</h1>
    </>
  );
}
