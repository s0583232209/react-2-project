// import { Outlet, useNavigate, useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import NavBar from "./NavBar";
// import AlbumLink from "./AlbumLink";

// export default function Albums(props) {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   useEffect(() => {
//     if (!userID) navigate("/login", { state: "this should be the url" });
//     if (!(id == userID)) navigate("/access_denied");
//   }, []);
//   const userID = JSON.parse(sessionStorage.getItem("current-user"))?.id || null;
//   const [useresAlbums, setUsersAlbums] = useState([]);
//   const [albumView, setAlbumView] = useState(false);
//   const [searchID, setSearchID] = useState(() => {
//     if (localStorage.getItem("searchIDAlbums"))
//       return JSON.parse(localStorage.getItem("searchIDAlbums"));
//     else return "";
//   });
//   const [searchTitle, setSearchTitle] = useState(() => {
//     if (localStorage.getItem("searchTitleAlbums"))
//       return JSON.parse(localStorage.getItem("searchTitleAlbums"));
//     else return "";
//   });
//   const [newAlbumsTitle, setNewAlbumsTitle] = useState("");
//   const [check, setCheck] = useState(() => () => {
//     return true;
//   });
//   useEffect(() => {
//     localStorage.setItem("searchIDAlbums", JSON.stringify(searchID));
//     return () => {
//       localStorage.removeItem("searchIDAlbums");
//     };
//   }, [searchID]);
//   useEffect(() => {
//     localStorage.setItem("searchTitleAlbums", JSON.stringify(searchTitle));
//     return () => {
//       localStorage.removeItem("searchTitleAlbums");
//     };
//   }, [searchTitle]);
//   useEffect(() => {
//     if (searchID != "")
//       setCheck(() => (album) => {
//         return album.id == searchID;
//       });
//     if (searchTitle != "")
//       setCheck(() => (album) => {
//         return album.title == searchTitle;
//       });
//   }, []);
//   useEffect(() => {
//     async function getAlbums() {
//       try {
//         const response = await fetch(
//           `http://localhost:3000/albums/?userId=${userID}`
//         );
//         if (!response.ok)
//           throw new Error(
//             `status: ${response.status}\n The sever could not get the albums, please try again later.`
//           );
//         const data = await response.json();
//         setUsersAlbums(data);
//       } catch (error) {
//         alert(error);
//         navigate("/");
//       }
//     }
//     if (userID) getAlbums();
//   }, []);
//   async function addNewAlbum() {
//     try {
//       const response = await fetch(`http://localhost:3000/albums`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title: newAlbumsTitle,
//           userId: Number(userID),
//         }),
//       });
//       if (!response.ok)
//         throw new Error(
//           `status: ${response.status}\n The server could not add the albums to the database, please try again later`
//         );
//       const newAlbum = await response.json();
//       setUsersAlbums((prev) => [...prev, newAlbum]);
//       setNewAlbumsTitle("");
//     } catch (error) {
//       alert(error);
//     }
//   }
//   async function deleteAlbum(id) {
//     try {
//       const response = await fetch(`http://localhost:3000/albums/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error(
//           `status: ${response.status}\n The server could not delete the albums from the database, plaese try again later.`
//         );
//       }
//       setUsersAlbums((prev) => prev.filter((album) => album.id != id));
//     } catch (error) {
//       alert(error);
//     }
//   }

//   return (
//     <>
//       <NavBar></NavBar>
//       <h1>Albums</h1>
//       <div className="filters">
//         <button onClick={addNewAlbum}>Add Album</button>
//         <input
//           type="text"
//           placeholder="Enter album title"
//           value={newAlbumsTitle}
//           onChange={(e) => setNewAlbumsTitle(e.target.value)}
//         />
//         <button
//           onClick={() => {
//             navigate(`?title=${searchTitle}`);
//             setCheck(() => (album) => {
//               return album.title == searchTitle;
//             });
//           }}
//         >
//           By Title
//         </button>
//         <input
//           type="text"
//           placeholder="Enter title"
//           value={searchTitle}
//           onChange={(e) => setSearchTitle(e.target.value)}
//         />
//         <button
//           onClick={() => {
//             navigate(`?id=${searchID}`);
//             setCheck(() => (album) => {
//               return album.id == searchID;
//             });
//           }}
//         >
//           By ID
//         </button>
//         <input
//           type="text"
//           placeholder="Enter ID"
//           value={searchID}
//           onChange={(e) => setSearchID(e.target.value)}
//         />
//       </div>
//       {!albumView && useresAlbums.length > 0 ? (
//         useresAlbums.map((album) =>
//           check(album) ? (
//             <AlbumLink
//               title={album.title}
//               changeStateAlbumView={setAlbumView}
//               userId={userID}
//               key={album.id}
//               id={album.id}
//               deleteAlbum={deleteAlbum}
//             ></AlbumLink>
//           ) : null
//         )
//       ) : !albumView ? (
//         <p>You Have No Albums</p>
//       ) : null}
//       <Outlet />
//     </>
//   );
// }
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import AlbumLink from "./AlbumLink";
import Loading from "./Loading";
export default function Albums(props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("title"), "searchparams");
  const { id } = useParams();
  useEffect(() => {
    if (!userID) navigate("/login", { state: "this should be the url" });
    if (!(id == userID)) navigate("/access_denied");
  }, []);
  const [loading, setLoading] = useState(false);
  const userID = JSON.parse(sessionStorage.getItem("current-user"))?.id || null;
  const [useresAlbums, setUsersAlbums] = useState([]);
  const [albumView, setAlbumView] = useState(false);
  const [searchID, setSearchID] = useState(searchParams.get("id") || "");
  const [searchTitle, setSearchTitle] = useState(
    searchParams.get("title") || ""
  );
  const [newAlbumsTitle, setNewAlbumsTitle] = useState("");
  const [check, setCheck] = useState(() => () => {
    return true;
  });

  useEffect(() => {
    console.log(searchID == "", searchTitle == "");

    if (searchID != "")
      setCheck(() => (album) => {
        return album.id == searchID;
      });
    if (searchTitle != "")
      setCheck(() => (album) => {
        return album.title == searchTitle;
      });
    setCheck(() => () => {
      return true;
    });
  }, []);
  useEffect(() => {
    async function getAlbums() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/albums/?userId=${userID}`
        );
        if (!response.ok)
          throw new Error(
            `status: ${response.status}\n The sever could not get the albums, please try again later.`
          );
        const data = await response.json();
        setUsersAlbums(data);
      } catch (error) {
        alert(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    if (userID) getAlbums();
  }, []);
  async function addNewAlbum() {
    try {
      const response = await fetch(`http://localhost:3000/albums`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newAlbumsTitle,
          userId: Number(userID),
        }),
      });
      if (!response.ok)
        throw new Error(
          `status: ${response.status}\n The server could not add the albums to the database, please try again later`
        );
      const newAlbum = await response.json();
      setUsersAlbums((prev) => [...prev, newAlbum]);
      setNewAlbumsTitle("");
    } catch (error) {
      alert(error);
    }
  }
  async function deleteAlbum(id) {
    try {
      const response = await fetch(`http://localhost:3000/albums/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `status: ${response.status}\n The server could not delete the albums from the database, plaese try again later.`
        );
      }
      setUsersAlbums((prev) => prev.filter((album) => album.id != id));
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      {loading ? <Loading message="Loading Albums..."></Loading> : null}
      <NavBar></NavBar>
      <h1>Albums</h1>
      <div className="filters">
        <button
          onClick={() => {
            setCheck(() => () => {
              return true;
            });
            navigate(`/Albums/${userID}`);
          }}
        >
          Back to all albums
        </button>
        <button onClick={addNewAlbum}>Add Album</button>
        <input
          type="text"
          placeholder="Enter album title"
          value={newAlbumsTitle}
          onChange={(e) => setNewAlbumsTitle(e.target.value)}
        />
        <button
          onClick={() => {
            navigate(`?title=${searchTitle}`);
            setCheck(() => (album) => {
              return album.title == searchTitle;
            });
          }}
        >
          By Title
        </button>
        <input
          type="text"
          placeholder="Enter title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <button
          onClick={() => {
            navigate(`?id=${searchID}`);
            setCheck(() => (album) => {
              return album.id == searchID;
            });
          }}
        >
          By ID
        </button>
        <input
          type="text"
          placeholder="Enter ID"
          value={searchID}
          onChange={(e) => setSearchID(e.target.value)}
        />
      </div>
      {!albumView && useresAlbums.length > 0 ? (
        useresAlbums.map((album) =>
          check(album) ? (
            <AlbumLink
              title={album.title}
              changeStateAlbumView={setAlbumView}
              userId={userID}
              key={album.id}
              id={album.id}
              deleteAlbum={deleteAlbum}
            ></AlbumLink>
          ) : null
        )
      ) : !albumView ? (
        <p>You Have No Albums</p>
      ) : null}
      <Outlet />
    </>
  );
}
