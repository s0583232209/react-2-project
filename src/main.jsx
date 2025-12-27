import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorPage from "../src/Components/ErrorPage.jsx";
import Album from "../src/Components/Album.jsx";
import Albums from "../src/Components/Albums.jsx";
import Home from "../src/Components/Home.jsx";
import Login from "../src/Components/Login.jsx";
import Post from "../src/Components/Post.jsx";
import Posts from "../src/Components/Posts.jsx";
import Register from "../src/Components/Register.jsx";
import RegisterDetails from "../src/Components/RegisterDetails.jsx";
import Task from "./Components/Task.jsx";
import Tasks from "./Components/Tasks.jsx";
import NavBar from "./Components/NavBar.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  NavLink,
} from "react-router-dom";
let str = "";
for (let i = 1; i < 112; i++) {
  str += `{"id":"${i}", "path":"../src/assets/pictures/landscape${i}.jpg"},\n`;
}
console.log(str);

createRoot(document.getElementById("root")).render(
  <Router>
    <NavBar />
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}>
        <Route path="details" element={<RegisterDetails />}></Route>
      </Route>
      <Route path="/" element={<Home />}></Route>
      <Route path="/albums" element={<Albums />}>
        <Route path=":id" element={<Album />}></Route>
      </Route>
      <Route path="/posts" element={<Posts />}>
        <Route path=":id" element={<Post />}></Route>
      </Route>
      <Route path="/tasks" element={<Tasks />}></Route>
      <Route path="/tasks" element={<Outlet></Outlet>}>
        <Route path=":id" element={<Task />} />
      </Route>
      <Route path="*" element={<ErrorPage />}></Route>
    </Routes>
  </Router>
);
