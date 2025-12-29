import { useState , useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Album from "./Album";
export default function AlbumLink(props) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Press to open album {props.id}
      </button>
      {show ? <Album id={props.id} title={props.title}></Album> : null}
      <br></br>
    </>
  );
}
