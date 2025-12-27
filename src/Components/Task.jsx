export default function Task(props) {
  return (
    <>
      <h3>{props.title}</h3>
      <input type="checkbox" onChange={(e)=>{e.target.checked}}checked={props.completed}></input>
    </>
  );
}
