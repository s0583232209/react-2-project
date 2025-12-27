import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Task from './Task'
export default function Tasks(props) {
  const [tasksList, setTasksList] = useState([]);

  useEffect(() => {
    async function getTasks() {
      const id = Number(JSON.parse(sessionStorage.getItem("current-user")).id);
      const response = await fetch(`http://localhost:3000/tasks/?userId=${id}`);
      if (!response.ok)
        throw new Error(
          "Error: response is not ok, status:  " + response.statuse
        );
      const data = await response.json();
      setTasksList(data);
      console.log(tasksList);
    }
    getTasks();
    return () => {
      setTasksList(null);
    };
  }, []);

  return (
    <>
      <h1>Tasks</h1>
      {tasksList.length > 0 ? (
        tasksList.map((tasks) => (
          <Task
            key={tasks.id}
            title={tasks.title}
            completed={tasks.completed}
          ></Task>
        ))
      ) : (null)}
      <Outlet></Outlet>
    </>
  );
}
