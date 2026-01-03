// import {
//   Outlet,
//   Link,
//   useNavigate,
//   useParams,
//   useLocation,
//   useSearchParams,
// } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import Task from "./Task";
// import NavBar from "./NavBar";
// import Login from "./Login";

// export default function Tasks(props) {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const userID = JSON.parse(sessionStorage.getItem("current-user"))?.id || null;
//   const [sortConditionTasks, setSortConditonTasks] = useState(() => {
//     let sortCondition = localStorage.getItem("sortConditionTasks");
//     if (sortCondition) {
//       return (sortCondition = JSON.parse(sortCondition));
//     }
//     return null;

//   });
//   const [tasksList, setTasksList] = useState(() => {
//     return JSON.parse(localStorage.getItem("tasksList")) || [];
//   });
//   const [newTask, setNewTask] = useState(false);
//   const { register, handleSubmit, reset } = useForm();
//   const [title, setTitle] = useState(searchParams.get("title") || "");
//   const [taskID, setTaskID] = useState(
//     JSON.parse(localStorage.getItem("taskIDTasks")) || ""
//   );
//   const [check, setCheck] = useState(() => () => {
//     return true;
//   });
//   const [condition, setCondition] = useState(() => {

//     let condition = localStorage.getItem("conditionTasks");
//     if (condition) return (condition = JSON.parse(condition));
//     return false;
//   });
//   console.log(condition);

//   useEffect(() => {
//     if (!userID) navigate("/login", { state: "this should be the url" });
//     if (!(id == userID)) navigate("/access_denied");
//   }, []);
//   useEffect(() => {
//     if (tasksList.length == 0) {
//       async function getTasks() {
//         if (!userID) return;
//         const response = await fetch(
//           `http://localhost:3000/tasks/?userId=${userID}`
//         );
//         if (!response.ok)
//           throw new Error(
//             "Error: response is not ok, status:  " + response.status
//           );
//         const data = await response.json();
//         setTasksList(data);
//       }
//       if (tasksList.length == 0) getTasks();
//     }
//   }, [userID]);
//   useEffect(() => {
//     if (condition == false) localStorage.removeItem("conditionTasks");
//     else localStorage.setItem("conditionTasks", JSON.stringify(condition));
//     return () => {
//       localStorage.removeItem("conditionTasks");
//     };
//   }, [condition]);
//   useEffect(() => {
//     localStorage.setItem("tasksList", JSON.stringify(tasksList));
//     return () => {
//       localStorage.removeItem("tasksList");
//     };
//   }, [tasksList]);
//   useEffect(() => {
//     localStorage.setItem("titleTasks", JSON.stringify(title));
//     return () => {
//       localStorage.removeItem("titleTasks");
//     };
//   }, [title]);
//   useEffect(() => {
//     localStorage.setItem("taskIDTasks", JSON.stringify(taskID));
//     return () => {
//       localStorage.removeItem("taskIDTasks");
//     };
//   }, [taskID]);
//   useEffect(() => {
//     if (condition)
//       localStorage.setItem("conditionTasks", JSON.stringify(condition));
//     else localStorage.removeItem("conditionTasks");
//   }, [condition]);

//   useEffect(() => {
//     if (tasksList.length == 0) return;
//     switch (condition) {
//       case "Id":
//         setCheck(() => (task) => {
//           return task.id == taskID;
//         });
//         break;
//       case "completedOnly":
//         setCheck(() => (task) => {
//           return task.completed;
//         });
//         break;
//       case "uncompletedOnly":
//         setCheck(() => (task) => {
//           return !task.completed;
//         });
//         break;
//       case "title":
//         setCheck(() => (task) => {
//           return task.title == title;
//         });
//         break;

//       default:
//         setCheck(() => () => {
//           return true;
//         });
//         break;
//     }
//     return;
//   }, [condition, title, taskID, tasksList]);
//   useEffect(() => {
//     switch (sortConditionTasks) {
//       case "title":
//         sortList("title");
//         break;
//       case "id":
//         sortList("id");
//       case "true":
//         sortList("true");
//         break;
//       case "false":
//         sortList("false");
//         break;
//     }
//     return () => {
//       localStorage.removeItem("sortConditionTask");
//     };
//   }, [sortConditionTasks]);
//   async function deleteTask(id) {
//     const response = await fetch(`http://localhost:3000/tasks/${id}`, {
//       method: "DELETE",
//     });
//     if (response.ok) {
//       setTasksList((prev) => prev.filter((task) => task.id !== id));
//     }
//   }
//   async function addNewTask(data) {
//     if (data.title.trim() === "") {
//       setNewTask(false);
//       return;
//     }
//     const response = await fetch(`http://localhost:3000/tasks`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: userID,
//         title: data.title,
//         completed: data.completed,
//       }),
//     });
//     if (response.ok) {
//       setNewTask(false);
//       const newTaskResponse = await response.json();
//       setTasksList((prev) => [...prev, newTaskResponse]);
//       reset();
//     }
//   }
//   async function updateTask(taskId, edits) {
//     const taskToEdit = tasksList.find((t) => t.id === taskId);
//     const editedTask = { ...taskToEdit, ...edits };
//     const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(editedTask),
//     });
//     if (response.ok) {
//       const updatedTask = await response.json();
//       setTasksList((prev) =>
//         prev.map((task) => (task.id === taskId ? updatedTask : task))
//       );
//     }
//   }
//   function sortList(sortBy) {
//     if (sortBy == "sort") return;
//     if (sortBy == "true" || sortBy == "false") {
//       sortByCompleted(sortBy);
//       return;
//     }
//     if (sortBy == "id")
//       tasksList.sort(
//         (a, b) => convertIdToInt(a[sortBy]) - convertIdToInt(b[sortBy])
//       );
//     else tasksList.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
//     setTasksList([...tasksList]);
//     navigate(`?sortBy=${sortBy}`);
//   }
//   function convertIdToInt(id) {
//     if (typeof id === "number") return id;
//     return parseInt(id, 16);
//   }
//   function sortByCompleted(startWith) {
//     if (startWith == "false")
//       tasksList.sort((a, b) => a.completed - b.completed);
//     else tasksList.sort((a, b) => b.completed - a.completed);
//     setTasksList([...tasksList]);
//     navigate(`?sortBy=${startWith}`);
//   }
//   function back() {
//     setCheck(() => () => {
//       return true;
//     });
//     removeAllConditions();
//     navigate(`/tasks/${userID}`);
//   }
//   function removeAllConditions() {
//     setCondition(false);
//   }

//   return (
//     <>
//       <NavBar></NavBar>
//       <h1>Tasks</h1>
//       <div className="filters">
//         <select onChange={(e) => setSortConditonTasks(e.target.value)}>
//           <option value="sort">Sort By</option>
//           <option value="title">Title</option>
//           <option value="id">ID</option>
//           <option value="true">Completed First</option>
//           <option value="false">Uncompleted First</option>
//         </select>

//         <button
//           onClick={() => {
//             setCondition("completedOnly");
//             setCheck(() => (task) => {
//               return task.completed;
//             });
//             navigate(`?completed=true`);
//           }}
//         >
//           Only Completed
//         </button>

//         <button
//           onClick={() => {
//             setCondition("uncompletedOnly");
//             setCheck(() => (task) => {
//               return !task.completed;
//             });
//             navigate(`?completed=false`);
//           }}
//         >
//           Uncompleted Only
//         </button>

//         <button onClick={back}>Back To All Tasks</button>

//         <button onClick={() => setNewTask(!newTask)}>Add New Task</button>

//         <button
//           onClick={() => {
//             setCondition("byTitle");
//             setCheck(() => (task) => {
//               return task.title == title;
//             });
//             navigate(`?title=${title}`);
//           }}
//         >
//           By Title
//         </button>
//         <input
//           type="text"
//           placeholder="Enter title"
//           onChange={(e) => setTitle(e.target.value)}
//           value={title}
//         />

//         <button
//           onClick={() => {
//             setCondition("byId");
//             setCheck(() => (task) => {
//               return task.id == taskID;
//             });
//             navigate(`?id=${taskID}`);
//           }}
//         >
//           By ID
//         </button>
//         <input
//           type="text"
//           placeholder="Enter ID"
//           onChange={(e) => setTaskID(e.target.value)}
//         />
//       </div>
//       {newTask ? (
//         <form onSubmit={handleSubmit(addNewTask)}>
//           <label htmlFor="title">Title</label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             placeholder="Enter task title"
//             {...register("title")}
//           />
//           <label htmlFor="completed">Completed?</label>
//           <input
//             type="checkbox"
//             id="completed"
//             name="completed"
//             {...register("completed")}
//           />
//           <button>Add</button>
//         </form>
//       ) : null}
//       {tasksList.length > 0 ? (
//         tasksList.map((task) =>
//           check(task) ? (
//             <Task
//               onDelete={deleteTask}
//               edit={updateTask}
//               id={task.id}
//               key={task.id}
//               title={task.title}
//               completed={task.completed}
//             ></Task>
//           ) : null
//         )
//       ) : (
//         <p>No Tasks</p>
//       )}
//       <Outlet></Outlet>
//     </>
//   );
// }
import {
  Outlet,
  Link,
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Task from "./Task";
import NavBar from "./NavBar";
import Login from "./Login";

export default function Tasks(props) {
  
  
  const navigate = useNavigate();
  const { id } = useParams();
  const userID = JSON.parse(sessionStorage.getItem("current-user"))?.id || null;
  const [sortConditionTasks, setSortConditonTasks] = useState(() => {
    return searchParams.get("sortBy") || null;
  });
  const [tasksList, setTasksList] = useState(() => {
    return JSON.parse(localStorage.getItem("tasksList")) || [];
  });
  const [newTask, setNewTask] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [taskID, setTaskID] = useState(searchParams.get("id") || "");
  const [check, setCheck] = useState(() => () => {
    return true;
  });
  const [condition, setCondition] = useState(() => {
    let condition;
    const conditions = [
      { url: "title", condition: "title" },
      { url: "completed", condition: null },
      { url: "id", condition: "id" },
    ];
    for (let i = 0; i < conditions.length; i++) {
      condition = searchParams.get(conditions[i].url);
      console.log(condition);

      if (condition) {
        if (condition == "false") return "uncompletedOnly";
        if (condition == "true") return "completedOnly";
        else return condition;
      }
    }
  });
  console.log(condition);

  useEffect(() => {
    if (!userID) navigate("/login", { state: "this should be the url" });
    if (!(id == userID)) navigate("/access_denied");
  }, []);
  useEffect(() => {
    if (tasksList.length == 0) {
      async function getTasks() {
        if (!userID) return;
        const response = await fetch(
          `http://localhost:3000/tasks/?userId=${userID}`
        );
        if (!response.ok)
          throw new Error(
            "Error: response is not ok, status:  " + response.status
          );
        const data = await response.json();
        setTasksList(data);
      }
      if (tasksList.length == 0) getTasks();
    }
  }, [userID]);

  useEffect(() => {
    localStorage.setItem("tasksList", JSON.stringify(tasksList));
    return () => {
      localStorage.removeItem("tasksList");
    };
  }, [tasksList]);
  useEffect(() => {
    if (condition)
      localStorage.setItem("conditionTasks", JSON.stringify(condition));
    else localStorage.removeItem("conditionTasks");
  }, [condition]);

  useEffect(() => {
    console.log("in effect for condition", condition);
    console.log(tasksList);
    if (tasksList.length == 0) return;
    switch (condition) {
      case "Id":
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
      case "title":
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
  }, [condition, title, taskID, tasksList]);
  useEffect(() => {
    switch (sortConditionTasks) {
      case "title":
        sortList("title");
        break;
      case "id":
        sortList("id");
      case "true":
        sortList("true");
        break;
      case "false":
        sortList("false");
        break;
    }
    return () => {
      localStorage.removeItem("sortConditionTask");
    };
  }, [sortConditionTasks]);
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
    if (sortBy == "id")
      tasksList.sort(
        (a, b) => convertIdToInt(a[sortBy]) - convertIdToInt(b[sortBy])
      );
    else tasksList.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    setTasksList([...tasksList]);
    navigate(`?sortBy=${sortBy}`);
  }
  function convertIdToInt(id) {
    if (typeof id === "number") return id;
    return parseInt(id, 16);
  }
  function sortByCompleted(startWith) {
    if (startWith == "false")
      tasksList.sort((a, b) => a.completed - b.completed);
    else tasksList.sort((a, b) => b.completed - a.completed);
    setTasksList([...tasksList]);
    navigate(`?sortBy=${startWith}`);
  }
  function back() {
    setCheck(() => () => {
      return true;
    });
    removeAllConditions();
    navigate(`/tasks/${userID}`);
  }
  function removeAllConditions() {
    setCondition(false);
  }

  return (
    <>
      <NavBar></NavBar>
      <h1>Tasks</h1>
      <div className="filters">
        <select onChange={(e) => setSortConditonTasks(e.target.value)}>
          <option value="sort">Sort By</option>
          <option value="title">Title</option>
          <option value="id">ID</option>
          <option value="true">Completed First</option>
          <option value="false">Uncompleted First</option>
        </select>

        <button
          onClick={() => {
            setCondition("completedOnly");
            setCheck(() => (task) => {
              return task.completed;
            });
            navigate(`?completed=true`);
          }}
        >
          Only Completed
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
          Uncompleted Only
        </button>

        <button onClick={back}>Back To All Tasks</button>

        <button onClick={() => setNewTask(!newTask)}>Add New Task</button>

        <button
          onClick={() => {
            setCondition("byTitle");
            setCheck(() => (task) => {
              return task.title == title;
            });
            navigate(`?title=${title}`);
          }}
        >
          By Title
        </button>
        <input
          type="text"
          placeholder="Enter title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <button
          onClick={() => {
            setCondition("byId");
            setCheck(() => (task) => {
              return task.id == taskID;
            });
            navigate(`?id=${taskID}`);
          }}
        >
          By ID
        </button>
        <input
          type="text"
          placeholder="Enter ID"
          onChange={(e) => setTaskID(e.target.value)}
        />
      </div>
      {newTask ? (
        <form onSubmit={handleSubmit(addNewTask)}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter task title"
            {...register("title")}
          />
          <label htmlFor="completed">Completed?</label>
          <input
            type="checkbox"
            id="completed"
            name="completed"
            {...register("completed")}
          />
          <button>Add</button>
        </form>
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
