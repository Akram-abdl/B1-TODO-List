import { deleteList, getLists, postList } from "./api.js";

let ourLists = [];

const showPanel = (panelId) => {
  // Hide all panels
  const panels = document.getElementsByClassName("panel");
  for (let i = 0; i < panels.length; i++) {
    panels[i].setAttribute("hidden", "true");
  }
  // Show the panel with panelId
  document.getElementById(panelId).removeAttribute("hidden");
  if (panelId === "lists-loading" || panelId === "lists-new") {
    document
      .getElementById("list-new-link")
      .setAttribute("hidden", "true");
  } else {
    document
      .getElementById("list-new-link")
      .removeAttribute("hidden");
  }
};

const deleteButtonClicked = (listId) => {
  deleteList(listId)
    .then(() => {
      // Delete list from ourLists
      ourLists = ourLists.filter((list) => list.id !== listId);
      buildList(ourLists);
    })
    .catch((err) => {
      console.error("Something happened when deleting a list", err);
      alert("Une erreur est survenue côté serveur");
    });
};

const createList = (list, ul) => {
  const li = document.createElement("li");
  li.className = "list-li";
  const link = document.createElement("a");
  link.innerText = list.title;
  link.href = `#tasks/${list.id}`;
  link.className = "list-tasks-link";
  link.style.color =  "#"+list.color;
  li.appendChild(link);
  
  const deleteButton = document.createElement("a");
  deleteButton.setAttribute("uk-icon", "trash");
  
  li.style.color = "#"+list.color;
  deleteButton.addEventListener("click", () =>
    deleteButtonClicked(list.id)
  );
  li.appendChild(deleteButton);
  ul.appendChild(li);
};

const buildList = (lists) => {
  if (lists.length === 0) {
    showPanel("lists-empty");
  } else {
    // Build the list
    const ul = document.getElementById("lists-ul");
    ul.innerText = "";
    lists.forEach((list) => createList(list, ul));
    showPanel("lists-list");
  }
};

const addNewList = () => {
  const titre = document.getElementById("list-new-title").value;
  const couleur = document.getElementById("list-new-color").value;
  console.log(couleur);
  console.log(titre);
  const couleurstr = couleur.substring(1);
  // Create task
  postList(titre, couleurstr)
    .then((list) => {
      // Update ourLists
      ourLists.push(list);
      buildList(ourLists);
      showPanel("lists-list");
      
    })
    .catch((err) => {
      console.error("Could not create list", err);
      alert("Une erreur est survenue côté serveur hello");
    });
    document.getElementById("list-new-title").value = "";
};

export const refreshAllLists = () => {
  showPanel("lists-loading");
  getLists().then((lists) => {
    ourLists = lists;
    buildList(lists);
  });
};

const initLists = () => {
  document
    .getElementById("list-new-link")
    .addEventListener("click", () => showPanel("lists-new"));
  document
    .getElementById("list-new-button")
    .addEventListener("click", addNewList);
  document
    .getElementById("list-new-cancel")
    .addEventListener("click", () => showPanel("lists-list"));
};

export default initLists;
