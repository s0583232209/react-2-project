import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  const [reday,setReady] =useState(false)
  
  const id = JSON.parse(sessionStorage.getItem("current-user"))?.id || null;
  useEffect(() => {
    if (!id) navigate("/login");
    setReady(true)
    console.log(id);
    
  },[]);

  return (
    <>
     {reday? (<NavBar id={id} />):null}
      <h1>Home</h1>
    </>
  );
}
