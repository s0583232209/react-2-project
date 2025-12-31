import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Album from "./Album";
import AlbumLink from "./AlbumLink";
export default function Albums(props) {
  const navigate = useNavigate();
  if (!sessionStorage.getItem("current-user"))
    navigate("/login", { state: "this should be the url" });
  const [userId, setUserId] = useState(
    JSON.parse(sessionStorage.getItem("current-user")).id
  );
  const [useresAlbums, setUsersAlbums] = useState([]);
  const [albumView, setAlbumView] = useState(false);
  const [searchID, setSearchID] = useState(() => {
    if (localStorage.getItem("searchID"))
      return JSON.parse(localStorage.getItem("searchID"));
    else return "";
  });
  const [searchTitle, setSearchTitle] = useState(() => {
    if (localStorage.getItem("searchTitleAlbums"))
      return JSON.parse(localStorage.getItem("searchTitleAlbums"));
    else return "";
  });
  const [check, setCheck] = useState(() => () => {
    return true;
  });
  useEffect(() => {
    localStorage.setItem("searchIDAlbums", JSON.stringify(searchID));
  }, [searchID]);
  useEffect(() => {
    localStorage.setItem("searchTitleAlbums", JSON.stringify(searchTitle));
  }, [searchTitle]);
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
      <button
        onClick={() => {
          navigate(`?title=${searchTitle}`);
          setCheck(() => (album) => {
            return album.title == searchTitle;
          });
        }}
      >
        get by title
      </button>
      <input
        type="text"
        onChange={(e) => setSearchTitle(e.target.value)}
      ></input>
      <button
        onClick={() => {
          console.log(searchID);

          navigate(`?id=${searchID}`);
          setCheck(() => (album) => {
            return album.id == searchID;
          });
        }}
      >
        get by ID
      </button>
      <input type="text" onChange={(e) => setSearchID(e.target.value)}></input>
      {!albumView && useresAlbums.length > 0 ? (
        useresAlbums.map((album) =>
          check(album) ? (
            <AlbumLink
              title={album.title}
              changeStateAlbumView={setAlbumView}
              userId={userId}
              key={album.id}
              id={album.id}
            ></AlbumLink>
          ) : null
        )
      ) : !albumView ? (
        <p>no albums</p>
      ) : null}
      <Outlet />
    </>
  );
}
