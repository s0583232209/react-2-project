import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function NavBar() {
  const navigate = useNavigate();
  const currentUser =
    JSON.parse(sessionStorage.getItem("current-user")) || null;
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);
  if (!currentUser) return null;
  function logOut() {
    sessionStorage.removeItem("current-user");
    navigate("/login");
  }
  return (
    <>
      <button className="logOut" onClick={logOut}>
        Log Out
      </button>
      <button
        className="albums"
        onClick={() => navigate(`/Albums/${currentUser.id}`)}
      >
        Albums
      </button>
      <button
        className="posts"
        onClick={() => navigate(`/Posts/${currentUser.id}`)}
      >
        Posts
      </button>
      <button
        className="tasks"
        onClick={() => navigate(`/Tasks/${currentUser.id}`)}
      >
        Tasks
      </button>
    </>
  );
}
