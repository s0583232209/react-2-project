import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Album from "./Album";
import AlbumLink from "./AlbumLink";
export default function Albums(props) {
  const navigate = useNavigate();
  const {id}=useParams()
  useEffect(() => {
    if (!userID) navigate("/login", { state: "this should be the url" });
    console.log(id==userID);
    if(!(id==userID))
      navigate("/access_denied")
  }, []);
  const userID = JSON.parse(sessionStorage.getItem("current-user"))?.id || null;
  const [useresAlbums, setUsersAlbums] = useState([]);
  const [albumView, setAlbumView] = useState(false);
  const [searchID, setSearchID] = useState(() => {
    if (localStorage.getItem("searchIDAlbums"))
      return JSON.parse(localStorage.getItem("searchIDAlbums"));
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
    console.log("in effect of check");

    if (searchID != "")
      setCheck(() => (album) => {
        return album.id == searchID;
      });
    if (searchTitle != "")
      setCheck(() => (album) => {
        return album.title == searchTitle;
      });
  }, []);
  useEffect(() => {
    async function getAlbums() {
      console.log(userID);
      if (userID) {
        const response = await fetch(
          `http://localhost:3000/albums/?userId=${userID}`
        );
        const data = await response.json();
        setUsersAlbums(data);
      }
    }
    getAlbums();
  }, []);

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
              userId={userID}
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
