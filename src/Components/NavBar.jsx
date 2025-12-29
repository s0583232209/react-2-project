import { Link } from "react-router-dom";
export default function NavBar(props) {

  return (
    <>
      <Link to={`/posts/${props.id}`}>posts</Link>
      <br></br>
      <Link to={`/albums/${props.id}`}>albums</Link>
      <br></br>
      <Link to={`/tasks/${props.id}`}>tasks</Link>
      <br></br>
      <Link to="/">home</Link>
      <br></br>
      <Link to="/login">log out</Link>
    </>
  );
}
