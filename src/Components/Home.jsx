import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem("current-user")) || null;
  const [showInfo, setShowInfo] = useState(false);
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);
  if (!currentUser) return null;
  function logOut() {
    sessionStorage.removeItem("current-user");
    navigate('/login')
  }
  return (
    <>
      <h1>Home</h1>
      <h2>Welcome, {currentUser.name}!</h2>
      <button className="showInfo" onClick={() => setShowInfo(!showInfo)}>Info</button>
      <button className="logOut" onClick={logOut}>Log Out</button>
      <button className="albums" onClick={()=>navigate(`/Albums/${currentUser.id}`)}>Albums</button>
      <button className="posts" onClick={()=>navigate(`/Posts/${currentUser.id}`)}>Posts</button>
      <button className="tasks" onClick={()=>navigate(`/Tasks/${currentUser.id}`)}>Tasks</button>
      {showInfo ? (<>
        <h3>Name: {currentUser.name}</h3>
        <h3>Username: {currentUser.username}</h3>
        <h3>Email: {currentUser.email}</h3>
        <h3>Street: {currentUser.address.street}</h3>
        <h3>City: {currentUser.address.city}</h3>
        <h3>Phone Number: {currentUser.phone}</h3>
      </>) : null}
    </>
  );
}
