import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Task(props) {
  const navigate = useNavigate();
  if (!sessionStorage.getItem("current-user")) navigate("/login",{state:"this should be the url"});
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(props.title);
  function startEdit() {
    setNewTitle(props.title);
    setEditing(true);
  }
  function cancelEdit() {
    setEditing(false);
  }
  function saveEdit() {
    if (newTitle.trim() === "") return;
    props.edit(props.id, { title: newTitle, completed: props.completed });
    setEditing(false);
  }
  return (
    <>
      {editing ? (
        <>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{props.id}</h3>
          <h2>{props.title}</h2>
          <input
            type="checkbox"
            onChange={() =>
              props.edit(props.id, {
                title: props.title,
                completed: !props.completed,
              })
            }
            checked={props.completed}
          ></input>
          <button className="delete" onClick={() => props.onDelete(props.id)}>
            Delete
          </button>
          <button className="edit" onClick={startEdit}>
            Edit
          </button>
        </>
      )}
    </>
  );
}
