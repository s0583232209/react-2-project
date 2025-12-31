import {
  Outlet,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Task from "./Task";
import Login from "./Login";
export default function Tasks(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    if (!userID) navigate("/login", { state: "this should be the url" });
    console.log(id == userID);
    if (!(id == userID)) navigate("/access_denied");
  }, []);
  const userID = JSON.parse(sessionStorage.getItem("current-user"))?.id || null;
  const [tasksList, setTasksList] = useState(
    JSON.parse(localStorage.getItem("tasksList")) || []
  );
  const [newTask, setNewTask] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [title, setTitle] = useState(
    JSON.parse(localStorage.getItem("titleTasks")) || ""
  );
  const [taskID, setTaskID] = useState(
    JSON.parse(localStorage.getItem("taskIDTasks")) || ""
  );
  const [check, setCheck] = useState(() => () => {
    return true;
  });
  const [condition, setCondition] = useState(() => {
    let condition = localStorage.getItem("conditionTasks");
    if (condition != "undefined") return (condition = JSON.parse(condition));
    return null;
  });
  useEffect(() => {
    console.log(condition == null);

    if (condition == null) localStorage.removeItem("conditionTasks");
  }, [condition]);
  useEffect(() => {
    if (tasksList.length == 0) return;
    switch (condition) {
      case "byId":
        setCheck(() => (task) => {
          return task.id == taskID;
        });
        break;
      case "completedOnly":
        setCheck(() => (task) => {
          return task.completed;
        });
        break;
      case "uncompletedOnly":
        setCheck(() => (task) => {
          return !task.completed;
        });
        break;
      case "byTitle":
        setCheck(() => (task) => {
          return task.title == title;
        });
        break;
      default:
        setCheck(() => () => {
          return true;
        });
        break;
    }
    return;
  }, [condition, title, taskID]);
  useEffect(() => {
    localStorage.setItem("tasksListTasks", JSON.stringify(tasksList));
  }, [tasksList]);

  useEffect(() => {
    localStorage.setItem("titleTasks", JSON.stringify(title));
  }, [title]);
  useEffect(() => {
    localStorage.setItem("taskIDTasks", JSON.stringify(taskID));
  }, [taskID]);
  useEffect(() => {
    if (condition)
      localStorage.setItem("conditionTasks", JSON.stringify(condition));
    else localStorage.removeItem("conditionTasks");
  }, [condition]);
  useEffect(() => {
    console.log(tasksList.length);

    if (tasksList.length == 0) {
      async function getTasks() {
        console.log("in function");
        console.log(userID);

        if (!userID) return;
        const response = await fetch(
          `http://localhost:3000/tasks/?userId=${userID}`
        );
        console.log(response);

        if (!response.ok)
          throw new Error(
            "Error: response is not ok, status:  " + response.status
          );
        const data = await response.json();
        setTasksList(data);
        console.log("after set");
        console.log(await data);
      }
      if (tasksList.length == 0) getTasks();
    }
  }, [userID]);
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
        userId: userID,
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
    if (sortBy == "sort") return;
    if (sortBy == "true" || sortBy == "false") {
      sortByCompleted(sortBy);
      return;
    }
    tasksList.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    setTasksList([...tasksList]);
    navigate(`?sortBy=${sortBy}`);
  }
  function sortByCompleted(startWith) {
    if (startWith == "false")
      tasksList.sort((a, b) => a.completed - b.completed);
    else tasksList.sort((a, b) => b.completed - a.completed);
    setTasksList([...tasksList]);
    navigate(`?startWith=${startWith}`);
  }
  function back() {
    setCheck(() => () => {
      return true;
    });
    removeAllConditions();
    navigate(`/tasks/${userID}`);
  }
  function removeAllConditions() {
    setCondition(null);
  }
  return (
    <>
      <h1>Tasks</h1>
      <select onChange={(e) => sortList(e.target.value)}>
        <option value="sort">Sort By</option>
        <option value="title">Title</option>
        <option value="id">ID</option>
        <option value="true">Completed First</option>
        <option value="false">Uncompleted First</option>
      </select>
      <button
        id="byTitle"
        onClick={() => {
          setCondition("byTitle");
          setCheck(() => (task) => {
            return task.title == title;
          });
          navigate(`?title=${title}`);
        }}
      >
        by title
      </button>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      ></input>
      <button
        onClick={() => {
          setCondition("completedOnly");
          setCheck(() => (task) => {
            return task.completed;
          });
          navigate(`?completed=true`);
        }}
      >
        only completed
      </button>
      <button
        onClick={() => {
          setCondition("uncompletedOnly");
          setCheck(() => (task) => {
            return !task.completed;
          });
          navigate(`?completed=false`);
        }}
      >
        Uncompleted only
      </button>
      <button
        id="byID"
        onClick={() => {
          setCondition("byId");
          setCheck(() => (task) => {
            return task.id == taskID;
          });
          navigate(`?id=${taskID}`);
        }}
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
