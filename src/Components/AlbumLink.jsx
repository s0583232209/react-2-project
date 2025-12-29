import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useHref } from "react-router-dom";
import Album from "./Album";
export default function AlbumLink(props) {
  const navigate = useNavigate();
  if (!sessionStorage.getItem("current-user"))
    navigate("/login", { state: "this should be the url" });
  const [show, setShow] = useState(false);
  const href = useHref();
  useEffect(() => {
    console.log(href);

    if (show) {
      props.changeStateAlbumView(true);
      navigate(`${href}/${props.id}`);
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
        Press to open album {props.id}
      </button>
    </>
  );
}
