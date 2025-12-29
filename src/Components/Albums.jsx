import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Album from "./Album";
export default function Albums(props) {
  const [userId, setUserId] = useState();
  const [useresAlbums, setUsersAlbums] = useState([]);
  const naviaget = useNavigate();

  useEffect(() => {
    const id = JSON.parse(sessionStorage.getItem("current-user")).id || null;
    if (!id) naviaget("/login");
    else {
      setUserId(id);
      naviaget(`/albums/${id}`);
    }
  }, []);
  useEffect(() => {
    async function getAlbums() {
      console.log(userId);
      if (userId) {
        const response = await fetch(
          `http://localhost:3000/albums/?userId=${userId}`
        );
        const data = await response.json();
        setUsersAlbums(data);
      }
    }
    getAlbums();
  }, [userId]);

  return (
    <>
      <h1>Albums</h1>
      {useresAlbums.length > 0 ? (
        useresAlbums.map((album) => (
          <Album title={album.title} key={album.id} id={album.id}></Album>
        ))
      ) : (
        <p>no albums</p>
      )}
      <Outlet />
    </>
  );
}
