import { useState } from "react";

export default function Photo(props) {
  const [newTitle, setNewTitle] = useState();
  return (
    <div>
      <button onClick={() => props.delete(props.id)}>Delete</button>
      <button onClick={() => props.changeTitle(props.id, newTitle)}>
        Change Title
      </button>
      <input
        type="text"
        placeholder="title"
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <img src={props.path} width={"150px"} alt={props.title}></img>
      <p>{props.title}</p>
    </div>
  );
}
