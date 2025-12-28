import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Task from "./Task";
export default function Tasks(props) {
  const id = JSON.parse(sessionStorage.getItem("current-user")).id || "null";
  const [tasksList, setTasksList] = useState([]);
  const [newTask, setNewTask] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [title, setTitle] = useState("");
  const [taskID, setTaskID] = useState("");
  const navigate = useNavigate();
  const [check, setCheck] = useState(() => () => {
    return true;
  });
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
      setTasksList((prev) => prev.filter((task) => task.id !== id));
    }
  }
  async function addNewTask(data) {
    if (data.title.trim() === "") {
      setNewTask(false);
      return;
    }
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
  async function updateTask(taskId, edits) {
    const taskToEdit = tasksList.find((t) => t.id === taskId);
    const editedTask = { ...taskToEdit, ...edits };
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedTask),
    });
    if (response.ok) {
      const updatedTask = await response.json();
      setTasksList((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
    }
  }
  function sortList(sortBy) {
    if (sortBy == "true" || sortBy == "false") {
      sortByCompleted(sortBy);
      return;
    }
    tasksList.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

    setTasksList([...tasksList]);
    console.log(tasksList);
  }
  function sortByCompleted(startWith) {
    if (startWith == "false")
      tasksList.sort((a, b) => a.completed - b.completed);
    else tasksList.sort((a, b) => b.completed - a.completed);
    setTasksList([...tasksList]);
  }
  function back() {
    setCheck(() => () => {
      return true;
    });
    navigate("/tasks");
  }
  return (
    <>
      <h1>Tasks</h1>
      <select onChange={(e) => sortList(e.target.value)}>
        <option value="title">Title</option>
        <option value="id">ID</option>
        <option value="true">Completed First</option>
        <option value="false">Uncompleted First</option>
      </select>
      <button
        id="byTitle"
        onClick={() =>
          setCheck(() => (task) => {
            return task.title == title;
          })
        }
      >
        by title
      </button>
      <input type="text" onChange={(e) => setTitle(e.target.value)}></input>
      <button
        onClick={() => {
          setCheck(() => (task) => {
            return task.completed;
          });
          navigate("/tasks/?completed=true");
        }}
      >
        only completed
      </button>
      <button
        onClick={() => {
          setCheck(() => (task) => {
            return !task.completed;
          });
          navigate("/tasks/?completed=false");
        }}
      >
        Uncompleted only
      </button>
      <button
        id="byTitle"
        onClick={() =>
          setCheck(() => (task) => {
            return task.id == taskID;
          })
        }
      >
        by ID
      </button>

      <input type="text" onChange={(e) => setTaskID(e.target.value)}></input>
      <button onClick={back}>Back To All Tasks</button>
      <button className="addNewTask" onClick={() => setNewTask(!newTask)}>
        Add New Task
      </button>
      {newTask ? (
        <>
          <form onSubmit={handleSubmit(addNewTask)}>
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
        tasksList.map((task) =>
          check(task) ? (
            <Task
              onDelete={deleteTask}
              edit={updateTask}
              id={task.id}
              key={task.id}
              title={task.title}
              completed={task.completed}
            ></Task>
          ) : null
        )
      ) : (
        <p>No Tasks</p>
      )}

      <Outlet></Outlet>
    </>
  );
}
