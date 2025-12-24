import { Outlet, Link } from "react-router-dom";

export default function Todos(props) {
  return (
    <>
      <h1>Tasks</h1>
      <Outlet></Outlet>
    </>
  );
}
    