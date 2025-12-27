import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Task from "./Task";
export default function Tasks(props) {
  const [tasksList, setTasksList] = useState([]);
  const [newTask, setNewTask] = useState(false);
  const { register, handleSubmit } = useForm();
  // let id = null;
  const [id] = useState(
    JSON.parse(sessionStorage.getItem("current-user")).id || null
  );
  // useEffect(() => {
  //   id = JSON.parse(sessionStorage.getItem("current-user")).id;
  // }, [id]);
  useEffect(() => {
    async function getTasks() {
      console.log(id);

      const response = await fetch(`http://localhost:3000/tasks/?userId=${id}`);
      if (!response.ok)
        throw new Error(
          "Error: response is not ok, status:  " + response.status
        );
      const data = await response.json();
      setTasksList(data);
    }
    getTasks();
  }, []);
  async function deleteTask(id) {
    // const response1 = await fetch(`http://localhost:3000/tasks/?id=${id}`)
    // console.log(await response1.json());

    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    });
    console.log(response);
  }
  async function addTask(data) {
    console.log(id);

    const response = await fetch(`http://localhost:3000/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: id,
        title: data.title,
        completed: data.completed,
      }),
    });
    if (response.ok) {
      setNewTask(!newTask);
      const newTaskResponse = await response.json();
      setTasksList((prev) => [...prev, newTaskResponse]);
    }
  }
  return (
    <>
      <h1>Tasks</h1>
      <button className="addTask" onClick={() => setNewTask(!newTask)}>
        Add New Task
      </button>
      {newTask ? (
        <>
          <form onSubmit={handleSubmit(addTask)}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              {...register("title")}
            ></input>
            <input
              type="checkbox"
              id="completed"
              name="completed"
              {...register("completed")}
            ></input>
            <label htmlFor="completed">Completed?</label>
            <button>Add</button>
          </form>
        </>
      ) : null}
      {tasksList.length > 0 ? (
        tasksList.map((task) => (
          <Task
            delete={deleteTask}
            id={task.id}
            key={task.id}
            title={task.title}
            completed={task.completed}
          ></Task>
        ))
      ) : (
        <p>No Tasks</p>
      )}

      <Outlet></Outlet>
    </>
  );
}
