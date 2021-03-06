import {
  deleteTask,
  getTasks,
  postTask,
  setTaskIsCompleted,
} from "./api.js";

let ourTasks = [];
let ourListId = "";

const showPanel = (panelId) => {
  // Hide all panels
  const panels = document.getElementsByClassName("panel");
  for (let i = 0; i < panels.length; i++) {
    panels[i].setAttribute("hidden", "true");
  }
  // Show the panel with panelId
  document.getElementById(panelId).removeAttribute("hidden");
  if (panelId === "tasks-loading" || panelId === "tasks-new") {
    document
      .getElementById("task-new-link")
      .setAttribute("hidden", "true");
  } else {
    document
      .getElementById("task-new-link")
      .removeAttribute("hidden");
  }
};

const setTaskCompletion = (taskId, isChecked) => {
  setTaskIsCompleted(taskId, isChecked)
    .then((newTaskState) => {
      // Replace task in ourTasks by its new state
      for (let i = 0; i < ourTasks.length; i++) {
        if (ourTasks[i].id === taskId) {
          ourTasks[i] = newTaskState;
          break;
        }
      }
      buildList(ourTasks);
    })
    .catch((err) => {
      console.error(
        "Something happened when setting task completion",
        err
      );
      alert("Une erreur est survenue côté serveur");
      buildList(ourTasks);
    });
};

const deleteButtonClicked = (taskId) => {
  deleteTask(taskId)
    .then(() => {
      // Delete task from ourTasks
      ourTasks = ourTasks.filter((task) => task.id !== taskId);
      buildList(ourTasks);
    })
    .catch((err) => {
      console.error("Something happened when deleting a task", err);
      alert("Une erreur est survenue côté serveur");
    });
};

const createTask = (task, ul) => {
  const li = document.createElement("li");
  li.className = "task-li";
  const checkbox = document.createElement("input");
  checkbox.id = `checkbox_${task.id}`;
  checkbox.type = "checkbox";
  checkbox.checked = task.isCompleted;
  checkbox.addEventListener("change", (evt) =>
    setTaskCompletion(task.id, evt.target.checked)
  );
  li.appendChild(checkbox);
  const getpresentdate = new Date().toISOString();
  const title = document.createElement("label");
  const details = document.createElement("label");
  const due = document.createElement("label");
  const datetask = new Date(task.due);
  
  title.setAttribute("for", `checkbox_${task.id}`);
  title.innerText = task.title;
  
  details.innerText = task.details;
  due.innerText = task.due;
  if (task.isCompleted) {
    title.className = "striked";
  }

  if (task.due < getpresentdate){
    console.log(datetask, getpresentdate);
    due.style.color = "red";
  }
  li.appendChild(title);
  li.appendChild(details);
  li.appendChild(due);
  const deleteButton = document.createElement("a");
  deleteButton.setAttribute("uk-icon", "trash");
  deleteButton.addEventListener("click", () =>
    deleteButtonClicked(task.id)
  );
  li.appendChild(deleteButton);
  ul.appendChild(li);
};

const buildList = (tasks) => {
  if (tasks.length === 0) {
    showPanel("tasks-empty");
  } else {
    // Build the list
    const ul = document.getElementById("tasks-ul");
    ul.innerText = "";
    tasks.forEach((task) => createTask(task, ul));
    showPanel("tasks-list");
  }
};

const addNewTask = () => {
  const title = document.getElementById("task-new-title").value;
  const details = document.getElementById("task-new-details").value;
  const due = document.getElementById("task-new-due").value;
  const dueDate= new Date(due);
  const strdate = dueDate.toISOString();
  console.log(strdate);
  // Create task
  postTask(title, details, strdate, ourListId)
    .then((task) => {
      // Update ourTasks
      ourTasks.push(task);
      buildList(ourTasks);
      showPanel("tasks-list");
      document.getElementById("task-new-title").value = "";
      document.getElementById("task-new-details").value = "";
      document.getElementById("task-new-due").value = "";
    })
    .catch((err) => {
      console.error("Could not create task", err);
      alert("Une erreur est survenue côté serveur");
    });
};

export const refreshAllTasks = (listId) => {
  showPanel("tasks-loading");
  ourListId = listId;
  getTasks(listId).then((tasks) => {
    ourTasks = tasks;
    buildList(tasks);
  });
};

const initTasks = () => {
  document
    .getElementById("task-new-link")
    .addEventListener("click", () => showPanel("tasks-new"));
  document
    .getElementById("task-new-button")
    .addEventListener("click", addNewTask);
  document
    .getElementById("task-new-cancel")
    .addEventListener("click", () => showPanel("tasks-list"));
};

export default initTasks;
