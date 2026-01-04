import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import Post from "./Post";
import NavBar from "./NavBar";
import { appContext } from "../App";
export default function Posts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userID } = useContext(appContext);
  const { id } = useParams();
  useEffect(() => {
    if (!userID) {
      navigate("/login");
      return;
    }
    if (String(id) !== String(userID)) {
      navigate("/access_denied");
    }
  }, [userID, id, navigate]);

  const LIMIT = 10;

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [postsList, setPostsList] = useState([]);
  const [newPost, setNewPost] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [searchID, setSearchID] = useState(searchParams.get("id") || "");
  const [searchTitle, setSearchTitle] = useState(
    searchParams.get("title") || ""
  );
  const [titleInput, setTitleInput] = useState("");
  const [idInput, setIdInput] = useState("");
  const [openPostId, setOpenPostId] = useState();
  const isPostOpen = !!openPostId;
  const isFiltering = !!searchID || !!searchTitle;

  useEffect(() => {
    setSearchID(searchParams.get("id") || "");
    setSearchTitle(searchParams.get("title") || "");
  }, [searchParams]);

  useEffect(() => {
    async function fetchPosts() {
      if (loading || !hasMore || isFiltering) return;
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/posts?_limit=${LIMIT}&_start=${page * LIMIT}`
      );
      const data = await res.json();
      setPostsList((prev) => {
        const newPosts = data.filter((p) => !prev.some((p2) => p2.id === p.id));
        return [...prev, ...newPosts];
      });

      setHasMore(data.length === LIMIT);
      setLoading(false);
    }
    if (postsList.length === 0 || page > 0) fetchPosts();
  }, [page, isFiltering]);

  useEffect(() => {
    async function fetchFromURL() {
      if (searchTitle) {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/posts?title=${searchTitle}`
        );
        const data = await res.json();
        setPostsList(data);
        setHasMore(false);
        setLoading(false);
      }

      if (searchID) {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/posts?id=${searchID}`);
        const data = await res.json();
        setPostsList(data);
        setHasMore(false);
        setLoading(false);
      }
    }

    fetchFromURL();
  }, [searchTitle, searchID]);

  async function searchByTitle() {
    if (!titleInput.trim()) return;
    const localMatch = postsList.find((p) => p.title === titleInput);
    if (!localMatch) {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/posts?title=${titleInput}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setPostsList((prev) => [...prev, ...data]);
      }
      setLoading(false);
    }
    setHasMore(false);
    navigate(`?title=${titleInput}`);
  }
  async function searchById() {
    if (!idInput) return;
    const localMatch = postsList.find((p) => String(p.id) === String(idInput));
    if (!localMatch) {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/posts?id=${idInput}`);
      const data = await res.json();
      if (data.length > 0) {
        setPostsList((prev) => [...prev, ...data]);
      }
      setLoading(false);
    }
    setHasMore(false);
    navigate(`?id=${idInput}`);
  }
  function resetFilters() {
    setTitleInput("");
    setIdInput("");
    setSearchID("");
    setSearchTitle("");
    setPostsList([]);
    setPage(0);
    setHasMore(true);
    navigate(`/Posts/${id}`);
  }

  async function deletePost(postId) {
    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setPostsList((prev) => prev.filter((p) => p.id !== postId));
      if (openPostId === postId) setOpenPostId(null);
    }
  }

  async function addNewPost(data) {
    if (!data.title.trim()) return;
    const response = await fetch(`http://localhost:3000/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userID,
        title: data.title,
        body: data.body,
      }),
    });
    if (response.ok) {
      const newPost = await response.json();
      setPostsList((prev) => [newPost, ...prev]);
      setNewPost(false);
      reset();
    }
  }

  async function updatePost(postId, updates) {
    const postToEdit = postsList.find((p) => p.id === postId);
    if (!postToEdit) return;
    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...postToEdit, ...updates }),
    });
    if (response.ok) {
      const updatedPost = await response.json();
      setPostsList((prev) =>
        prev.map((p) => (p.id === postId ? updatedPost : p))
      );
    }
  }

  return (
    <>
      <NavBar />
      <div className={`main-content ${isPostOpen ? "blurred" : ""}`}>
        <h1>Posts</h1>
        <div className="filters">
          <button onClick={searchByTitle}>Search By Title</button>
          <input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="enter title"
          />
          <button onClick={searchById}> Search By ID </button>
          <input value={idInput} onChange={(e) => setIdInput(e.target.value)} placeholder="enter ID" />
          <button onClick={resetFilters}>Back To All Posts</button>
        </div>

        <div className="add-new-post">
          <button onClick={() => setNewPost((p) => !p)}>Add New Post</button>
          {newPost && (
            <form onSubmit={handleSubmit(addNewPost)}>
              <input {...register("title")} placeholder="Title" required />
              <input {...register("body")} placeholder="Body" required />
              <button>Add</button>
            </form>
          )}
        </div>

        <div className="posts-list">
          {(() => {
            const filtered = postsList
              .filter((p) => p.id !== openPostId)
              .filter((post) => {
                if (searchID) return String(post.id) === String(searchID);
                if (searchTitle) return post.title === searchTitle;
                return true;
              });

            if (isFiltering && filtered.length === 0 && !loading) {
              return <p>No matches found</p>;
            }

            return filtered.map((post) => (
              <Post
                key={post.id}
                {...post}
                currentUser={post.userId === userID}
                edit={updatePost}
                onDelete={deletePost}
                isExpanded={false}
                onExpand={() => setOpenPostId(post.id)}
              />
            ));
          })()}
        </div>
        {hasMore && !isFiltering && (
          <button disabled={loading} onClick={() => setPage((p) => p + 1)}>
            {loading ? "Loading..." : "See more"}
          </button>
        )}
      </div>

      {openPostId && (
        <Post
          key={`expanded-${openPostId}`}
          {...postsList.find((p) => p.id === openPostId)}
          currentUser={
            postsList.find((p) => p.id === openPostId)?.userId === userID
          }
          edit={updatePost}
          onDelete={deletePost}
          isExpanded
          onCollapse={() => setOpenPostId(null)}
        />
      )}
      <Outlet />
    </>
  );
}
