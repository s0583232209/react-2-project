import { useState, useEffect } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useHref,
  useParams,
} from "react-router-dom";
import Album from "./Album";
export default function AlbumLink(props) {
  const navigate = useNavigate();
  const {id} = useParams()
  useEffect(() => {
    if (!userID) navigate("/login", { state: "this should be the url" });
    if (!(id == userID)) navigate("/access_denied");
  }, []);
  const userID = JSON.parse(sessionStorage.getItem("current-user"))?.id || null;
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (show) {
      props.changeStateAlbumView(true);
      navigate(`${props.id}`);
    }
  }, [show]);
  return (
    <>
      <button
        onClick={() => {
          console.log("in on Click");

          setShow(true);
        }}
      >
        Press to open album {props.id} title: {props.title}
      </button>
    </>
  );
}
