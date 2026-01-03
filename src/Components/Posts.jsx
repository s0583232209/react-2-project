import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Post from "./Post";
import  NavBar  from "./NavBar";
export default function Posts() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(sessionStorage.getItem("current-user")) || {};
    const { id } = useParams();
    const ID = currentUser.id;

    if (!ID) navigate("/login");
    if (id !== ID) navigate("/access_denied");

    const LIMIT = 10;

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [postsList, setPostsList] = useState(JSON.parse(localStorage.getItem("postsList")) || []);
    const [newPost, setNewPost] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const [title, setTitle] = useState(JSON.parse(localStorage.getItem("titlePosts")) || "");
    const [postID, setPostID] = useState(JSON.parse(localStorage.getItem("idPosts")) || "");
    const [openPostId, setOpenPostId] = useState(JSON.parse(localStorage.getItem("openPostID")) || null);
    const [condition, setCondition] = useState(JSON.parse(localStorage.getItem("conditionPosts")) || null);

    const [check, setCheck] = useState(() => {
        const savedCondition = JSON.parse(localStorage.getItem("conditionPosts"));
        const savedTitle = JSON.parse(localStorage.getItem("titlePosts"));
        const savedID = JSON.parse(localStorage.getItem("idPosts"));

        if (savedCondition === "byTitle") return (p) => p.title === savedTitle;
        if (savedCondition === "byId") return (p) => String(p.id) === String(savedID);
        return () => true;
    });

    const isPostOpen = !!openPostId;

    useEffect(() => {
        localStorage.setItem("postsList", JSON.stringify(postsList));
        return () => {
            localStorage.removeItem("postsList");
        };
    }, [postsList]);
    useEffect(() => {
        localStorage.setItem("titlePosts", JSON.stringify(title)); return () => {
            localStorage.removeItem("titlePosts");
        };
    }, [title]);
    useEffect(() => {
        localStorage.setItem("idPosts", JSON.stringify(postID)); return () => {
            localStorage.removeItem("idPosts");
        };
    }, [postID]);
    useEffect(() => {
        localStorage.setItem("openPostID", JSON.stringify(openPostId)); return () => {
            localStorage.removeItem("openPostID");
        };
    }, [openPostId]);
    useEffect(() => {
        localStorage.setItem("conditionPosts", JSON.stringify(condition)); return () => {
            localStorage.removeItem("conditionPosts");
        };
    }, [condition]);

    useEffect(() => {
        async function fetchPosts() {
            if (loading || !hasMore || condition) return;
            setLoading(true);
            const res = await fetch(`http://localhost:3000/posts?_limit=${LIMIT}&_start=${page * LIMIT}`);
            const data = await res.json();
            setPostsList(prev => {
                const ids = new Set(prev.map(p => p.id));
                const newPosts = data.filter(p => !ids.has(p.id));
                return [...prev, ...newPosts];
            });
            setHasMore(data.length === LIMIT);
            setLoading(false);
        }
        if (postsList.length === 0 || page > 0) fetchPosts();
    }, [page, condition]);

    async function searchByTitle() {
        if (!title.trim()) return;
        const localMatch = postsList.find(p => p.title === title);
        if (!localMatch) {
            setLoading(true);
            const res = await fetch(`http://localhost:3000/posts?title=${title}`);
            const data = await res.json();
            if (data.length > 0) {
                setPostsList(prev => [...prev, ...data]);
            }
            setLoading(false);
        }
        setCheck(() => post => post.title === title);
        setCondition("byTitle");
        setHasMore(false);
        navigate(`?title=${title}`);
    }
    async function searchById() {
        if (!postID) return;
        const localMatch = postsList.find(p => String(p.id) === String(postID));
        if (!localMatch) {
            setLoading(true);
            const res = await fetch(`http://localhost:3000/posts?id=${postID}`);
            const data = await res.json();
            if (data.length > 0) {
                setPostsList(prev => [...prev, ...data]);
            }
            setLoading(false);
        }
        setCheck(() => post => String(post.id) === String(postID));
        setCondition("byId");
        setHasMore(false);
        navigate(`?id=${postID}`);
    }
    function resetFilters() {
        setCondition(null);
        setCheck(() => () => true);
        setTitle("");
        setPostID("");
        setPage(0);
        setHasMore(true);
        navigate(`/Posts/${id}`);
    }

    async function deletePost(postId) {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, { method: "DELETE" });
        if (response.ok) {
            setPostsList(prev => prev.filter(p => p.id !== postId));
            if (openPostId === postId) setOpenPostId(null);
        }
    }

    async function addNewPost(data) {
        if (!data.title.trim()) return;
        const response = await fetch(`http://localhost:3000/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: ID, title: data.title, body: data.body }),
        });
        if (response.ok) {
            const newPost = await response.json();
            setPostsList(prev => [newPost, ...prev]);
            setNewPost(false);
            reset();
        }
    }

    async function updatePost(postId, updates) {
        const postToEdit = postsList.find(p => p.id === postId);
        if (!postToEdit) return;
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...postToEdit, ...updates }),
        });
        if (response.ok) {
            const updatedPost = await response.json();
            setPostsList(prev => prev.map(p => (p.id === postId ? updatedPost : p)));
        }
    }

    return (
        <>
            <NavBar />
            <div className={`main-content ${isPostOpen ? "blurred" : ""}`}>
                <h1>Posts</h1>
                <div className="filters">
                    <button onClick={searchByTitle}>by title</button>
                    <input value={title} onChange={e => setTitle(e.target.value)} />
                    <button onClick={searchById}> by ID </button>
                    <input value={postID} onChange={e => setPostID(e.target.value)} />
                    <button onClick={resetFilters}>Back To All Posts</button>
                </div>

                <div className="add-new-post">
                    <button onClick={() => setNewPost(p => !p)}>Add New Post</button>
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
                        const filtered = postsList.filter(p => p.id !== openPostId).filter(check);

                        if (condition && filtered.length === 0 && !loading) {
                            return <p>No matches found</p>;
                        }

                        return filtered.map(post => (
                            <Post
                                key={post.id}
                                {...post}
                                currentUser={post.userId === ID}
                                edit={updatePost}
                                onDelete={deletePost}
                                isExpanded={false}
                                onExpand={() => setOpenPostId(post.id)}
                            />
                        ));
                    })()}
                </div>
                {hasMore && !condition && (
                    <button disabled={loading} onClick={() => setPage(p => p + 1)}>
                        {loading ? "Loading..." : "See more"}
                    </button>
                )}
            </div>

            {openPostId && (
                <Post
                    key={`expanded-${openPostId}`}
                    {...postsList.find(p => p.id === openPostId)}
                    currentUser={postsList.find(p => p.id === openPostId)?.userId === ID}
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