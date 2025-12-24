import { Link } from "react-router-dom";
export default function NavBar(props) {
  return (
    <>
      <Link to="/posts">posts</Link>
      <br></br>
      <Link to="/albums">albums</Link>
      <br></br>
      <Link to="/tasks">tasks</Link>
      <br></br>
      <Link to="/">home</Link>
      <br></br>
      <Link to="/login">log out</Link>
    </>
  );
}
