import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Task from "./Task";
export default function Tasks(props) {
  const [tasksList, setTasksList] = useState([]);
  const [newTask, setNewTask] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const id = JSON.parse(sessionStorage.getItem("current-user")).id || "null";
  useEffect(() => {
    async function getTasks() {
      if (!id) return;
      const response = await fetch(`http://localhost:3000/tasks/?userId=${id}`);
      if (!response.ok)
        throw new Error(
          "Error: response is not ok, status:  " + response.status
        );
      const data = await response.json();
      setTasksList(data);
    }
    getTasks();
  }, [id]);
  async function deleteTask(id) {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setTasksList(prev =>
        prev.filter(task => task.id !== id)
      );
    }
  }
  async function addTask(data) {
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
      setNewTask(false);
      const newTaskResponse = await response.json();
      setTasksList((prev) => [...prev, newTaskResponse]);
      reset();
    }
  }
  async function editTask(taskId, edits) {
    const taskToEdit = tasksList.find(t => t.id === taskId);
    const editedTask={...taskToEdit, ...edits};
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedTask),
    })
    if (response.ok) {
      const updatedTask = await response.json();
      setTasksList(prev => prev.map(task => task.id === taskId ? updatedTask : task));
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
            <input type="text" id="title" name="title"  {...register("title")}></input>
            <input type="checkbox" id="completed" name="completed"  {...register("completed")}></input>
            <label htmlFor="completed">Completed?</label>
            <button>Add</button>
          </form>
        </>
      ) : null}
      {tasksList.length > 0 ? (
        tasksList.map((task) => (
          <Task
            onDelete={deleteTask}
            edit={editTask}
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
