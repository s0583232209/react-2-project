import {useState}from 'react'
export default function Task(props) {
  const[checked,setChecked]=useState(props.completed)
  return (
    <>
    <h3>{props.id}</h3>
      <h3>{props.title}</h3>
      <input type="checkbox" onChange={(e)=>{setChecked(e.target.checked)}} checked={checked}></input>
    <button className="delete" onClick={()=>props.delete(props.id)}>Delete</button>
    </>
  );
}
