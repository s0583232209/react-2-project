import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Album from "./Album";
import AlbumLink from "./AlbumLink";
export default function Albums(props) {
  const navigate = useNavigate();
  if (!sessionStorage.getItem("current-user"))
    navigate("/login", { state: "this should be the url" });
  const [userId, setUserId] = useState(JSON.parse(sessionStorage.getItem('current-user')).id);
  const [useresAlbums, setUsersAlbums] = useState([]);
  const [albumView, setAlbumView] = useState(false);

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
      {!albumView && useresAlbums.length > 0 ? (
        useresAlbums.map((album) => (
          <AlbumLink
          title={album.title}
            changeStateAlbumView={setAlbumView}
            userId={userId}
            key={album.id}
            id={album.id}
          ></AlbumLink>
        ))
      ) : !albumView ? (
        <p>no albums</p>
      ) : null}
      <Outlet />
    </>
  );
}
