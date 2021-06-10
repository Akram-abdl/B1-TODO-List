const crudfulConfig = {
  headers: {
    cfAccessKey: "d3fe693cc147b89aa6e0a5d68a97fddf9565bed8",
  },
};

export const getTasks = (listId) =>
  axios
    .get(`https://todo.crudful.com/tasks?listId=${listId}`, crudfulConfig)
    .then((result) => result.data.results);

export const setTaskIsCompleted = (taskId, isCompleted) =>
  axios
    .patch(
      `https://todo.crudful.com/tasks/${taskId}`,
      {
        isCompleted: isCompleted,
      },
      crudfulConfig
    )
    .then((result) => result.data);
// https://todo.crudful.com/tasks?listId=53f132b1-1136-4043-a48a-98d4e3c29971&ordering=isCompleted%2C-due

export const deleteTask = (taskId) =>
  axios.delete(
    `https://todo.crudful.com/tasks/${taskId}`,
    crudfulConfig
  );

export const postTask = (title, details, strdate, listId) =>
  axios
    .post(
      "https://todo.crudful.com/tasks",
      { title: title, details: details, due: strdate, listId: listId },
      crudfulConfig
    )
    .then((result) => result.data);

export const getLists = () =>
  axios
    .get("https://todo.crudful.com/lists", crudfulConfig)
    .then((result) => result.data.results);

export const deleteList = (listId) =>
  axios.delete(
    `https://todo.crudful.com/lists/${listId}`,
    crudfulConfig
  );

export const postList = (titre, couleur) =>
  axios
    .post(
      "https://todo.crudful.com/lists",
      { title: titre, color: couleur },
      crudfulConfig
    )
    .then((result) => result.data);
