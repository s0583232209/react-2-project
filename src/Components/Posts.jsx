// import { Outlet, Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import Post from "./Post";
// export default function Posts(props) {
//     const id = JSON.parse(sessionStorage.getItem("current-user")).id || "null";
//     const name = JSON.parse(sessionStorage.getItem("current-user")).username || "null";
//     const [postsList, setPostsList] = useState([]);
//     const [newPost, setNewPost] = useState(false);
//     const { register, handleSubmit, reset } = useForm();
//     const [title, setTitle] = useState("");
//     const [postID, setPostID] = useState("");
//     const navigate = useNavigate();
//     const [check, setCheck] = useState(() => (post) => {
//         return true;
//     });
//     useEffect(() => {
//         async function getPosts() {
//             const response = await fetch(`http://localhost:3000/posts/`);
//             if (!response.ok)
//                 throw new Error(
//                     "Error: response is not ok, status:  " + response.status
//                 );
//             const data = await response.json();
//             setPostsList(data);
//         }
//         getPosts();
//     }, []);
//     async function deletePost(id) {
//         const response = await fetch(`http://localhost:3000/posts/${id}`, {
//             method: "DELETE",
//         });
//         if (response.ok) {
//             setPostsList((prev) => prev.filter((post) => post.id !== id));
//         }
//     }
//     async function addNewPost(data) {
//         if (data.title.trim() === "") {
//             setNewPost(false);
//             return;
//         }
//         const response = await fetch(`http://localhost:3000/posts`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 userId: id,
//                 title: data.title,
//                 body: data.body,
//             }),
//         });
//         if (response.ok) {
//             setNewPost(false);
//             const newPostResponse = await response.json();
//             setPostsList((prev) => [...prev, newPostResponse]);
//             reset();
//         }
//     }
//     async function updatePost(postId, updates) {
//         const postToEdit = postsList.find((p) => p.id === postId);
//         const editedPost = { ...postToEdit, ...updates };
//         const response = await fetch(`http://localhost:3000/posts/${postId}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(editedPost),
//         });
//         if (response.ok) {
//             const updatedPost = await response.json();
//             setPostsList((prev) =>
//                 prev.map((post) => (post.id === postId ? updatedPost : post))
//             );
//         }
//     }
//     return (
//         <>
//             <h1>Posts</h1>
//             <button
//                 id="byTitle"
//                 onClick={() =>
//                     setCheck(() => (post) => {
//                         return post.title == title;
//                     })
//                 }
//             >
//                 by title
//             </button>
//             <input type="text" onChange={(e) => setTitle(e.target.value)}></input>
//             <button
//                 id="byId"
//                 onClick={() =>
//                     setCheck(() => (post) => {
//                         return post.id == postID;
//                     })
//                 }
//             >
//                 by ID
//             </button>
//             <input type="text" onChange={(e) => setPostID(e.target.value)}></input>
//             <button className="addNewPost" onClick={() => setNewPost(!newPost)}>
//                 Add New Post
//             </button>
//             {newPost ? (
//                 <>
//                     <form onSubmit={handleSubmit(addNewPost)}>
//                         <label htmlFor="title">Title</label>
//                         <input
//                             type="text"
//                             id="title"
//                             name="title"
//                             {...register("title")}
//                         ></input>
//                         <label htmlFor="body">Body</label>
//                         <input
//                             type="text"
//                             id="body"
//                             name="body"
//                             {...register("body")}
//                         ></input>
//                         <button>Add</button>
//                     </form>
//                 </>
//             ) : null}
//             {postsList.length > 0 ? (
//                 postsList.map((post) =>
//                     check(post) ? (
//                         <Post
//                             onDelete={deletePost}
//                             edit={updatePost}
//                             id={post.id}
//                             key={post.id}
//                             title={post.title}
//                             body={post.body}
//                             userName={name}
//                             currentUser={post.userId==id}
//                         ></Post>
//                     ) : null
//                 )
//             ) : (
//                 <p>No Posts</p>
//             )}
//             <Outlet></Outlet>
//         </>
//     )
// }

import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Post from "./Post";

export default function Posts() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem("current-user")) || {};
  if (currentUser == {}) navigate("/login");
  const ID = currentUser.id || "null";
  const { id } = useParams();
  if (id !== ID) navigate("/access_denied");
  const name = currentUser.username || "null";
  const [postsList, setPostsList] = useState([]);
  const [newPost, setNewPost] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [title, setTitle] = useState("");
  const [postID, setPostID] = useState("");
  const [openPostId, setOpenPostId] = useState(null);
  const [check, setCheck] = useState(() => (post) => true);
  const isPostOpen = !!openPostId;

  // Fetch posts on mount
  useEffect(() => {
    async function getPosts() {
      const response = await fetch(`http://localhost:3000/posts/`);
      if (!response.ok)
        throw new Error("Error fetching posts, status: " + response.status);
      const data = await response.json();
      setPostsList(data);
    }
    getPosts();
  }, []);

  // Delete post
  async function deletePost(postId) {
    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setPostsList((prev) => prev.filter((p) => p.id !== postId));
      if (openPostId === postId) setOpenPostId(null);
    }
  }

  // Add new post
  async function addNewPost(data) {
    if (data.title.trim() === "") return;
    const response = await fetch(`http://localhost:3000/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: ID,
        title: data.title,
        body: data.body,
      }),
    });
    if (response.ok) {
      const newPostResponse = await response.json();
      setPostsList((prev) => [...prev, newPostResponse]);
      setNewPost(false);
      reset();
    }
  }

  // Update post
  async function updatePost(postId, updates) {
    const postToEdit = postsList.find((p) => p.id === postId);
    if (!postToEdit) return;
    const editedPost = { ...postToEdit, ...updates };
    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedPost),
    });
    if (response.ok) {
      const updatedPost = await response.json();
      setPostsList((prev) =>
        prev.map((post) => (post.id === postId ? updatedPost : post))
      );
    }
  }

  return (
    <>
      <div className={`main-content ${isPostOpen ? "blurred" : ""}`}>
        <h1>Posts</h1>

        {/* Filters */}
        <div className="filters">
          <button
            onClick={() => setCheck(() => (post) => post.title.toLowerCase().includes(title.toLowerCase()))}
          >
            by title
          </button>
          <input type="text" onChange={(e) => setTitle(e.target.value)} />
          <button onClick={() => setCheck(() => (post) => post.id == postID)}>
            by ID
          </button>
          <input type="text" onChange={(e) => setPostID(e.target.value)} />
        </div>

        {/* Add New Post */}
        <div className="add-new-post">
          <button onClick={() => setNewPost(!newPost)}>Add New Post</button>
          {newPost && (
            <form onSubmit={handleSubmit(addNewPost)}>
              <label htmlFor="title">Title</label>
              <input type="text" id="title" {...register("title")} required />
              <label htmlFor="body">Body</label>
              <input type="text" id="body" {...register("body")} required />
              <button type="submit">Add</button>
            </form>
          )}
        </div>

        {/* Posts list */}
        <div className="posts-list">
          {postsList
            .slice()
            .reverse()
            .filter((p) => p.id !== openPostId)
            .filter(check)
            .map((post) => (
              <Post
                key={post.id}
                {...post}
                currentUser={post.userId === ID}
                email={post.email}
                username={post.username}
                edit={updatePost}
                onDelete={deletePost}
                isExpanded={false}
                onExpand={() => setOpenPostId(post.id)}
              />
            ))}
        </div>
      </div>{" "}
      {/* Expanded post displayed on top */}
      {openPostId && (
        <Post
          key={`expanded-${openPostId}`}
          {...postsList.find((p) => p.id === openPostId)}
          currentUser={
            postsList.find((p) => p.id === openPostId)?.userId === ID
          }
          edit={updatePost}
          onDelete={deletePost}
          isExpanded={true}
          onCollapse={() => setOpenPostId(null)}
        />
      )}
      <Outlet />
    </>
  );
}
