import { createRoot } from "react-dom/client";
import "./index.css";
import ErrorPage from "../src/Components/ErrorPage.jsx";
import Album from "../src/Components/Album.jsx";
import Albums from "../src/Components/Albums.jsx";
import Home from "../src/Components/Home.jsx";
import Login from "../src/Components/Login.jsx";
import Post from "../src/Components/Post.jsx";
import Posts from "../src/Components/Posts.jsx";
import Register from "../src/Components/Register.jsx";
import Task from "./Components/Task.jsx";
import Tasks from "./Components/Tasks.jsx";
import { AccessDenied } from "./Components/AccessDenied.jsx";
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
  str += `{"albumId":${1+i%9},"id":"${i+900}", "path":"/pictures/landscape${i}.jpg","title":"photos number ${i}"},\n`;
}
console.log(str);

createRoot(document.getElementById("root")).render(
  <Router>
    
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}>
      </Route>
      <Route path="/" element={<Home />}></Route>
      <Route path="/albums/:id/" element={<Albums />}>
       
      </Route>
       <Route path="/albums/:id/:id" element={<Album />}></Route>
       <Route path="/posts/:id/" element={<Posts />}>
        <Route path=":id" element={<Post />}></Route>
      </Route>
      <Route path="/tasks/:id/" element={<Tasks />}>
      
      {/* <Route path="/tasks" element={<Outlet></Outlet>}> */}
        <Route path=":id" element={<Task />} />
      </Route>
      <Route path="/access_denied" element={<AccessDenied />}></Route>
      <Route path="*" element={<ErrorPage />}></Route>
    </Routes>
  </Router>
);
