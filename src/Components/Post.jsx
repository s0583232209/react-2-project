import { useState } from 'react'
import Comments from './Comments';
export default function Post(props) {
    const [editing, setEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(props.title);
    const [newBody, setNewBody] = useState(props.body);
    const [fullPost, setFullPost] = useState(false);
    const [showComments, setShowComments] = useState(false);
    function startEdit() {
        setNewTitle(props.title);
        setNewBody(props.body);
        setEditing(true);
    }
    function cancelEdit() {
        setEditing(false);
    }
    function saveEdit() {
        if (newTitle.trim() === "") return;
        props.edit(props.id, { title: newTitle, body: newBody });
        setEditing(false);
    }

    return (
        <>
            {editing ? (<>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} autoFocus />
                <input type="text" value={newBody} onChange={e => setNewBody(e.target.value)} />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
            </>) : (<>
                <h3>ID:{props.id}</h3>
                <h2>{props.title}</h2>
                {fullPost ? (<>
                    <h3>{props.body}</h3>
                    <button className="closeFullPost" onClick={() => setFullPost(false)}>Close Full Post</button>
                    <button className="showComments" onClick={() => setShowComments(true)}>Show Comments</button>
                </>) : (<>
                    <button className="openFullPost" onClick={() => setFullPost(true)}>Open Full Post</button>
                </>)}
                {props.currentUser ? (<>
                    <button className="delete" onClick={() => props.onDelete(props.id)}>Delete</button>
                    <button className="edit" onClick={startEdit}>Edit</button>
                </>) : null}
            </>)}
            {
                showComments ? (<>
                    <Comments postId={props.id}></Comments>
                    <button className="closeComments" onClick={() => setShowComments(false)}>Close Comments</button>
                </>) : null
            }
        </>
    )
}



